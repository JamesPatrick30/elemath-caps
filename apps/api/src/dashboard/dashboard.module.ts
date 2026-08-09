import { Module } from '@nestjs/common';
import { StudentService } from './student/student.service';
import { StudentController } from './student/student.controller';
import { TeacherController } from './teacher/teacher.controller';
import { TeacherService } from './teacher/teacher.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
@Module({
  imports: [AuthModule, PrismaModule, RedisModule],
  providers: [StudentService, TeacherService],
  controllers: [StudentController, TeacherController]
})
export class DashboardModule {}
