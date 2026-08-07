import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '../redis/cache.service';
import { CookieNames } from '../types/cookie';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class WebsocketGateway {
  constructor(private readonly jwtService: JwtService, private readonly cacheService: CacheService) {}
  @WebSocketServer()
  server!: Server;

  private getToken(cookie?: string): string | null {
    if (!cookie) return null;

    const cookies = cookie.split(';');

    console.log('Parsed cookies:', cookies);
    for (const c of cookies) {
        const [key, value] = c.trim().split('=');

        if (key === CookieNames.accessToken) {
            return value;
        }
    }

    return null;
}

  async handleConnection(client: Socket) {
    try {
        const token = this.getToken(client.handshake.headers.cookie);

        if (!token) {
            client.disconnect();
            return;
        }

        const payload = await this.jwtService.verifyAsync(token,{secret: process.env.ACCESS_JWT_SECRET});

        this.cacheService.set(`socket:${payload.sub}`, client.id, 3600); // Store for 1 hour
        console.log(`socket id form cache: ${await this.cacheService.get(`socket:${payload.sub}`)}`);
    } catch {
      client.disconnect();
    }
  }

  emit(event: string, data: string, to?: string | null) {
    if (to) {
      this.server.to(to).emit(event, data);
    } else {
      this.server.emit(event, data);
    }
  }

  joinRoom(client: Socket, room: string) {
    client.join(room);
  }


}
