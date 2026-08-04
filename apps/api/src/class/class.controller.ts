import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ClassService } from './class.service';
import { RegisterClassDto } from './dto/register.dto';
import type { Request } from 'express';
import { AccessTeacherGuard } from '../auth/guard/accessTeacher.guard';
import { UpdateClassDto } from './dto/update.dto';
@Controller('class')
@UseGuards(AccessTeacherGuard)
export class ClassController {
    constructor(private readonly classService: ClassService) {}

    @Get()
    async getUserClasses(@Req() req: Request): Promise<any[]> {
        return this.classService.getUserClasses(req.user?.sub);
    }

    @Post('register')
    async registerClass(@Body() body: RegisterClassDto, @Req() req: Request): Promise<{ message: string }> {
        const { name, habitat } = body;
        return this.classService.registerClass(req.user.sub, name, habitat);
    }

    @Put(':id')
    async updateClass(@Req() req: Request, @Body() body: UpdateClassDto, @Param('id') classId: string): Promise<{ message: string }> {
        return this.classService.updateClass(req.user.sub, classId, body);
    }

    @Delete(':id')
    async deleteClass(@Req() req: Request, @Param('id') classId: string): Promise<{ message: string }> {
        return this.classService.deleteClass(req.user.sub, classId);
    }
}
