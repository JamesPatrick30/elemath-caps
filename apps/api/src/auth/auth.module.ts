import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { SharedService } from '../shared/shared.service';
import {  AccessTeacherGuard } from './guard/accessTeacher.guard';
import {  AccessTeacherStrategy } from './strategy/accessTeacher.strategy';
import { AccessStudentsStrategy } from './strategy/accessStudents.strategy';
import { RefreshStrategy } from './strategy/refresh.strategy';
import { RefreshGuard } from './guard/refresh.guard';
@Module({
  imports: [
    JwtModule.register({}),
    PrismaModule, 
  ],
  controllers: [AuthController],
  providers: [AuthService, SharedService, AccessTeacherGuard, AccessTeacherStrategy, AccessStudentsStrategy, RefreshStrategy, RefreshGuard],
  exports: [AuthService, AccessTeacherGuard, AccessTeacherStrategy, AccessStudentsStrategy]
})
export class AuthModule {}
