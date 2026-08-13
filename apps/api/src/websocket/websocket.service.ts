import {
  Injectable,
} from '@nestjs/common';

import {
  Server,
} from 'socket.io';

import { SocketEvents } from '../types/socketEvents';
import { pubsubEvents } from '../types/pubsubEvents';
import { RedisPubSubService } from '@repo/redis';
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
    void this.redisPubSubService.publish(pubsubEvents.SOCKET_EVENT, { event, payload, room });
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
    this.pub(event, payload, room);

    if (room) {
      this.server
        .to(room)
        .emit(event, payload);
      return;
    }

    this.server.emit(event, payload);
  }

  joinRoom(userId: string, room: string) {
    if (!this.server) {
      return;
    }

    this.server.socketsJoin(room);
    this.server.to(room).emit(SocketEvents.STUDENT_JOIN, { userId, room });
  }
}