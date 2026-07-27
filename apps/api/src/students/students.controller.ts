import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { StudentsService } from './students.service';
import { AccessTeacherGuard } from '../auth/guard/accessTeacher.guard';
import { RegisterStudentDto } from './dto/register.dto';

@UseGuards(AccessTeacherGuard)
@Controller('students')
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) {}

    @Get()
    async getAllStudentsFromUser(@Req() req: Request): Promise<any[]> {
        return this.studentsService.getAllStudentsFromUser(req.user.sub);
    }
    @Post('register')
    async registerStudent(@Body() studentData: RegisterStudentDto, @Req() req: Request): Promise<{ message: string }> {
        const classId = studentData.classId;
        return this.studentsService.registerStudent(classId, req.user.sub, studentData.password, studentData.name, studentData.email);
    }

}