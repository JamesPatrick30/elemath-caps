import { Injectable } from '@nestjs/common';
import {WebsocketGateway} from './websocket.gateway';
import { CacheService } from '../redis/cache.service';
@Injectable()
export class WebsocketService {
  constructor(private readonly websocketGateway: WebsocketGateway, private readonly cacheService: CacheService) {}

    emit(event: string, data?: any, to?: string | null) {
        this.websocketGateway.emit(event, data, to);
    }

    async joinRoom(userId: string, room: string) {
        const clientId =await this.cacheService.get<string>(`socket:${userId}`);
        if (!clientId) {
          return null;
        }

        const client = this.websocketGateway.server.sockets.sockets.get(clientId);
        if (client) {
            this.websocketGateway.joinRoom(client, room);
        }

    }
}
