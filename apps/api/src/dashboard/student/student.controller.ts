import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { AccessStudentGuard } from '../../auth/guard/accessStudent.guard';
import type { Request } from 'express';
@Controller('student')
@UseGuards(AccessStudentGuard) 
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @Get('dashboard')
    async getStudentDashboard(@Req() req: Request) {
        return this.studentService.getStudentDashboard(req.user.sub);
    }
}
