import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [PrismaModule, AuthModule],
  providers: [ClassService],
  controllers: [ClassController]
})
export class ClassModule {}
