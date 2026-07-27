import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class StudentsService {
    constructor(private readonly prismaService: PrismaService) {}

    async getStudentsByClass(classId: string): Promise<any[]> {
        return this.prismaService.client().class.findMany({
            where: { id: classId },
        });
    }

    async getAllStudentsFromUser(userId: string): Promise<any[]> {
        return this.prismaService.client().class.findMany({
            where: { teacherId: userId },
            select: {
                id: true,
                name: true,
                students: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async registerStudent(classId: string,teacherId: string,password: string, studentName: string, studentEmail: string): Promise<{ message: string }> {
        // Implement the logic to register a student

        const existingStudent = await this.prismaService.client().students.findFirst({
            where:{
                email: studentEmail,
            }
        });

        if (existingStudent) {
            throw new ConflictException('Student with the same email already exists');
        }
        await this.prismaService.client().students.create({
            data: {
                teacherId,
                classroomId: classId,
                name: studentName,
                email: studentEmail,
                password, // You might want to generate a random password or handle this differently
            }
        });
        return { message: 'Student registered successfully' };
    }
}