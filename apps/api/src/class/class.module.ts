import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from '../redis/redis.module';
@Module({
  imports: [PrismaModule, AuthModule, RedisModule],
  providers: [ClassService],
  controllers: [ClassController]
})
export class ClassModule {}
