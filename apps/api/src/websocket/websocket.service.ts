import { Injectable } from '@nestjs/common';
import {WebsocketGateway} from './websocket.gateway';
@Injectable()
export class WebsocketService {
  constructor(private readonly websocketGateway: WebsocketGateway) {}

    emit(event: string, data?: any, to?: string | null) {
        this.websocketGateway.emit(event, data, to);
    }
}
