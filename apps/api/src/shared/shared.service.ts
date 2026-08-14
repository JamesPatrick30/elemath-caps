import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class SharedService {
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async userWebsocketIdKey(userId: string): Promise<string> {
    return `user_websocket_id_${userId}`;
  }

  joinRoomKey(roomId: string): string {
    return `room_${roomId}`;
  }

  uploadFileTaskKey(fileId?: string): string {
    return `upload_file_${fileId}`;
  }
}
