import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from '@repo/redis';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PdfModule } from './pdf/pdf.module';
import { GameModule } from './game/game.module';
import { AiModule } from './ai/ai.module';
@Module({
  imports: [ ConfigModule.forRoot({ isGlobal: true }), PrismaModule, RedisModule, BullModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      connection: {
        host: config.get<string>('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT'),
          password: config.get<string>('REDIS_PASSWORD') || undefined,
      },
    }),
  }), PdfModule, GameModule, AiModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
