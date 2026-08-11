import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { TeacherService } from './teacher.service';
import { AccessTeacherGuard } from '../../auth/guard/accessTeacher.guard';

@Controller('teacher')
@UseGuards(AccessTeacherGuard)
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get('dashboard')
  async getDashboardData(@Req() req: Request) {
    const userId = req.user.sub;
    return this.teacherService.getDashboardData(userId);
  }

  @Get('dashboard/stats')
  async getDashboardStats(@Req() req: Request) {
    const userId = req.user.sub;
    return this.teacherService.getDashboardStats(userId);
  }

  @Get('classes')
  async getClasses(@Req() req: Request) {
    const userId = req.user.sub;
    return this.teacherService.getClasses(userId);
  }

  @Get('students/performance')
  async getStudentPerformance(@Req() req: Request, @Query('classId') classId?: string) {
    const userId = req.user.sub;
    return this.teacherService.getStudentPerformance(userId, classId);
  }

  @Get('students/trend')
  async getPerformanceTrend(@Req() req: Request, @Query('classId') classId?: string) {
    const userId = req.user.sub;
    return this.teacherService.getPerformanceTrend(userId, classId);
  }
}