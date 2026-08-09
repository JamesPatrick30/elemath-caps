import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from '../redis/redis.module';
import { SharedService } from '../shared/shared.service';
@Module({
  providers: [StudentsService, SharedService],
  controllers: [StudentsController],
  imports: [PrismaModule, AuthModule, RedisModule]
})
export class StudentsModule {}
