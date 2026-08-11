import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../redis/cache.service';
import { SharedService } from '../shared/shared.service';
@Injectable()
export class StudentsService {
    constructor(
        private readonly prismaService: PrismaService, 
        private readonly cache: CacheService,
        private readonly sharedService: SharedService,
    ) {}

    private keyForUserStudents(userId: string): string {
        return `user_students_${userId}`;
    }
    async getStudentsByClass(classId: string): Promise<any[]> {

        return this.prismaService.client().class.findMany({
            where: { id: classId },
        });
    }

    async getAllStudentsFromUser(userId: string): Promise<any[]> {
        const cacheKey = this.keyForUserStudents(userId);
        const cachedStudents = await this.cache.get<any[]>(cacheKey);
        if (cachedStudents) {
            return cachedStudents;
        }
        const students = await this.prismaService.client().class.findMany({
            where: { teacherId: userId, isActive: true },
            select: {
                id: true,
                name: true,
                students: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        isActive: true,
                    },
                },
            },
        });
        const filteredStudents = students.map((classroom) => ({
            classId: classroom.id,
            className: classroom.name,
            students: classroom.students.filter((student) => student.isActive),
        }));

        await this.cache.set(cacheKey, filteredStudents);

        return filteredStudents;
    }

    async registerStudent(classId: string,teacherId: string,password: string, studentName: string, studentEmail: string): Promise<{ message: string }> {

        const classExists = await this.prismaService.client().class.findUnique({
            where: { id: classId },
        });

        if (!classExists) {
            throw new ConflictException('Class not found');
        }

        const cacheKey = this.keyForUserStudents(teacherId);

        const existingStudent = await this.prismaService.client().students.findFirst({
            where:{
                email: studentEmail,
            }
        });

        if (existingStudent) {
            throw new ConflictException('Student with the same email already exists');
        }

        const HashedPassword = await this.sharedService.hashPassword(password);
        await this.prismaService.client().students.create({
            data: {
                teacherId,
                classroomId: classId,
                name: studentName,
                email: studentEmail,
                password: HashedPassword, // You might want to generate a random password or handle this differently
            }
        });
        await this.cache.del(cacheKey);
        return { message: 'Student registered successfully' };
    }
    async deleteStudent(studentId: string, teacherId: string): Promise<{ message: string }> {
        const student = await this.prismaService.client().students.findUnique({
            where: { id: studentId },
        });

        if (!student) {
            throw new NotFoundException('Student not found');
        }

        await this.prismaService.client().students.update({
            where: { id: studentId },
            data: { isActive: false },
        });

        const cacheKey = this.keyForUserStudents(teacherId);
        await this.cache.del(cacheKey);

        return { message: 'Student deleted successfully' };
    }

    async updateStudent(studentId: string, teacherId: string, updatedData: { name?: string; email?: string; password?: string }): Promise<{ message: string }> {
        const student = await this.prismaService.client().students.findUnique({
            where: { id: studentId },
        });

        if (!student) {
            throw new NotFoundException('Student not found');
        }

        if (updatedData.password) {
            const HashedPassword = await this.sharedService.hashPassword(updatedData.password);
            await this.prismaService.client().students.update({
                where: { id: studentId },
                data: { ...updatedData, password: HashedPassword },
            });

            return { message: 'Student updated successfully' };

        }

        await this.prismaService.client().students.update({
            where: { id: studentId },
            data: { 
                email: updatedData.email,
                name: updatedData.name,
             },
        });

        const cacheKey = this.keyForUserStudents(teacherId);
        await this.cache.del(cacheKey);

        return { message: 'Student updated successfully' };
    }
}