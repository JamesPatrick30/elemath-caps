import {
  Injectable,
} from '@nestjs/common';

import {
  Server,
} from 'socket.io';

import { SocketEvents } from '../types/socketEvents';
import { CacheService } from '@repo/redis';
@Injectable()
export class WebsocketService {
  private server?: Server;

  constructor(private readonly cacheService: CacheService) {}
  setServer(server: Server) {
    this.server = server;
  }

  emit<T>(
    event: string,
    payload: T,
    room?: string,
  ) {
    if (!this.server) {
      return;
    }


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