import {
  Injectable,
} from '@nestjs/common';

import {
  Server,
} from 'socket.io';

import { SocketEvents } from '../types/socketEvents';
import { pubsubEvents } from '../types/pubsubEvents';
import { RedisPubSubService } from '@repo/redis';
import { PubSubSocketEvents } from '@repo/types';
@Injectable()
export class WebsocketService {
  private server?: Server;

  constructor(
    private readonly redisPubSubService: RedisPubSubService,
  ) {}
  setServer(server: Server) {
    this.server = server;
  }

  private pub( event: string, payload: any, room?: string) {
    void this.redisPubSubService.publish(pubsubEvents.SOCKET_EVENT, { event, payload, room } as PubSubSocketEvents);
  }

  emit<T>(
    event: string,
    payload: T,
    room?: string,
  ) {
    if (!this.server) {
      return;
    }

    // Publish the event to Redis Pub/Sub
    console.log(`Publishing event ${event} to Redis Pub/Sub with payload:`, payload, 'Room:', room);
    this.pub(event, payload, room);

    if (room) {
      this.server
        .to(room)
        .emit(event, payload);
      return;
    }

    this.server.emit(event, payload);
  }

  teacherJoinRoom( room: string) {
    if (!this.server) {
      return;
    }
    try{
      this.server.socketsJoin(room);
    } catch (error) {
      console.error(`Error joining room ${room}:`, error);
    }
    // this.server.socketsJoin(room);
    // this.server.to(room).emit(SocketEvents.STUDENT_JOIN, { room });
  }
  joinRoom(userId: string, room: string) {
    if (!this.server) {
      return;
    }

    this.server.socketsJoin(room);
    this.server.to(room).emit(SocketEvents.STUDENT_JOIN, { userId, room });
  }
}