import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class ClassService {
    constructor(private readonly prismaService: PrismaService) {}

    async getUserClasses(userId: string): Promise<any[]> {
        return this.prismaService.client().class.findMany({
            where: { teacherId: userId },
        });
    }
    async registerClass(userId: string, className: string, habitat: string): Promise<{ message: string }> {
        // Implement the logic to register a class

        const existingClassFromUser = await this.prismaService.client().class.findFirst({
            where: {
                teacherId: userId,
                name: className
            }
        });

        if (existingClassFromUser) {
            throw new ConflictException('Class with the same name already exists for this user');
        }

        await this.prismaService.client().class.create({
            data: {
                teacherId: userId,
                name: className,
                habitat: habitat
            }
        });
        return { message: 'Class registered successfully' };
    }
}
