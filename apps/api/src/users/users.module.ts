import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SharedService } from '../shared/shared.service';
@Module({
  providers: [UsersService, SharedService],
  controllers: [UsersController],
  imports: [PrismaModule]
})
export class UsersModule {}
