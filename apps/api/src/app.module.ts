import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { StudentsModule } from './students/students.module';
import { AuthModule } from './auth/auth.module';
import { SharedService } from './shared/shared.service';
import { ClassModule } from './class/class.module';
import { RedisModule } from './redis/redis.module';
import { BullModule } from '@nestjs/bullmq';
import { PdfModule } from './pdf/pdf.module';
import { GameModule } from './game/game.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [BullModule.forRootAsync({
    useFactory: () => ({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD || undefined,
      },
    }),
  }),ConfigModule.forRoot({isGlobal: true,}), PrismaModule, UsersModule, StudentsModule, AuthModule, ClassModule, RedisModule, PdfModule, GameModule, WebsocketModule],
  controllers: [AppController],
  providers: [AppService, { provide: SharedService, useClass: SharedService }],
})
export class AppModule {}

