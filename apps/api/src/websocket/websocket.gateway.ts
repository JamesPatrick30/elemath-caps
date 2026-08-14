import {
  WebSocketGateway,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';

import { OnModuleInit } from '@nestjs/common';

import { Server, Socket } from 'socket.io';

import { CacheService,RedisPubSubService } from '@repo/redis';
import { WebsocketService } from './websocket.service';
import { JwtService } from '@nestjs/jwt';
import { SharedService } from '../shared/shared.service';
import { SocketEvents } from '../types/socketEvents';
import { UnauthorizedException } from '@nestjs/common';
import { pubsubEvents } from '../types/pubsubEvents';
import { uploadTask } from '@repo/types';
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class WebsocketGateway implements OnGatewayInit, OnModuleInit {
  constructor(
    private readonly websocketService: WebsocketService,
    private readonly jwtService: JwtService,
    private readonly sharedService: SharedService,
    private readonly redisPubSubService: RedisPubSubService,
    private readonly cacheService: CacheService,
  ) {}

  @WebSocketServer()
  server!: Server;

  onModuleInit() {
    this.redisPubSubService.subscribe(pubsubEvents.FILE_UPLOAD, async (payload: uploadTask) => {
      const  { status, id, isDone, userId } = payload;
      console.log(`Publishing to socket ${id}:`, { status, isDone, userId });
      this.server.to(id).emit(SocketEvents.PDF_UPLOADED, {
        status,
        isDone,
      });

      if (isDone) {
        const cacheKey = this.sharedService.uploadFileTaskKey(userId);

        await this.cacheService.del(cacheKey);
      }
    });

    this.redisPubSubService.subscribe(pubsubEvents.SOCKET_EVENT, (payload: any) => {
      const { event, payload: eventPayload, room } = payload;
      if (room) {
        this.server.to(room).emit(event, eventPayload);
      } else {
        this.server.emit(event, eventPayload);
      }
    });
  }
  afterInit(server: Server) {
    this.websocketService.setServer(server);

    server.use(async (socket, next) => {
      try {
        await this.authenticate(socket);

        next();
      } catch (error) {
        next(new Error('Unauthorized'));
      }
    });
  }

  private async authenticate(socket: Socket) {
    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
      throw new UnauthorizedException('No cookies provided');
    }

    const token = this.extractAccessToken(cookieHeader);

    if (!token) {
      throw new UnauthorizedException('Access token not found');
    }

    try{

      const user =
        await this.jwtService.verifyAsync(token, {
          secret: process.env.ACCESS_JWT_SECRET,
        });
  
  
      if (!user) {
        throw new UnauthorizedException('Invalid access token');
      }
  
      if (user.role === 'student') {
        const roomKey = await this.sharedService.joinRoomKey(user.classId);
        socket.join(roomKey);
      }
  
      // Attach authenticated user to socket
      socket.data.user = user;
      await this.cacheService.set(`socket:${user.sub}`, JSON.stringify({id:socket.id}), 60 * 60); // Cache for 1 hour
    }catch(error){
      // socket.disconnect(true);
      throw new UnauthorizedException('Token verification failed');
    }
  }

  handleConnection(socket: Socket) {
    const user = socket.data.user;
  }



  private extractAccessToken(
    cookieHeader: string,
  ): string | null {
    const cookies = cookieHeader
      .split(';')
      .map((cookie) => cookie.trim());

    const accessTokenCookie = cookies.find(
      (cookie) =>
        cookie.startsWith('accessToken='),
    );

    if (!accessTokenCookie) {
      return null;
    }

    const seperatedToken = accessTokenCookie.split('=');
    if (seperatedToken.length !== 2) {
      return null;
    }
    return seperatedToken[1];
  }

  @SubscribeMessage(SocketEvents.STUDENT_JOIN)
  async handleJoinRoom(socket: Socket, data: { roomId: string }) {
    const user = socket.data.user;
    const { roomId } = data;

    if (!user) {
      console.error('User not authenticated');
      return;
    }

    if (!roomId) {
      const classId = user.classId;
      const roomKey = await this.sharedService.joinRoomKey(classId);
      socket.join(roomKey);
      return;
    }

    const roomKey = await this.sharedService.joinRoomKey(roomId);
    socket.join(roomKey);

  }


}