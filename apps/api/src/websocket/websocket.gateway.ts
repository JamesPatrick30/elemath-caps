import {
  WebSocketGateway,
  OnGatewayInit,
  SubscribeMessage,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { WebsocketService } from './websocket.service';
import { JwtService } from '@nestjs/jwt';
import { SharedService } from '../shared/shared.service';
import { SocketEvents } from '../types/socketEvents';
import { UnauthorizedException } from '@nestjs/common';
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class WebsocketGateway implements OnGatewayInit {
  constructor(
    private readonly websocketService: WebsocketService,
    private readonly jwtService: JwtService,
    private readonly sharedService: SharedService,
  ) {}

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