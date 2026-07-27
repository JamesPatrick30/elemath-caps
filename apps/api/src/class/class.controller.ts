import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ClassService } from './class.service';
import { RegisterClassDto } from './dto/register.dto';
import type { Request } from 'express';
import { AccessTeacherGuard } from '../auth/guard/accessTeacher.guard';
@Controller('class')
@UseGuards(AccessTeacherGuard)
export class ClassController {
    constructor(private readonly classService: ClassService) {}

    @Get()
    async getUserClasses(@Req() req: Request): Promise<any[]> {
        return this.classService.getUserClasses(req.user.sub);
    }

    @Post('register')
    async registerClass(@Body() body: RegisterClassDto, @Req() req: Request): Promise<{ message: string }> {
        const { name, habitat } = body;
        return this.classService.registerClass(req.user.sub, name, habitat);
    }
}
