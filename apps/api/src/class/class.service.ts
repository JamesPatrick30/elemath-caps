import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../redis/cache.service';
@Injectable()
export class ClassService {
    constructor(private readonly prismaService: PrismaService, private readonly cache: CacheService  ) {}

    private keyForUserClasses(userId: string): string {
        return `user_classes_${userId}`;
    }
    private async updateOldCache<T>(key: string, newData: any[]): Promise<void> {
        const oldCachedData = await this.cache.get<T[]>(key);
        if (oldCachedData) {
        const updatedData = [...oldCachedData, ...newData];
        await this.cache.set(key, updatedData);
        }
    }

    private async updateUserClassesCache(hey: string, data: any[]): Promise<void> {
        const oldCachedClasses = await this.cache.get<any[]>(hey);
        if (oldCachedClasses) {
            const updatedClasses = [...oldCachedClasses, ...data];
            await this.cache.set(hey, updatedClasses);
        }
    }
    async getUserClasses(userId?: string | undefined): Promise<any[]> {

        if (!userId) {
            throw new ConflictException('User ID is required');
        }
        const cacheKey = this.keyForUserClasses(userId);

        const cachedClasses = await this.cache.get<any[]>(cacheKey);

        if (cachedClasses) {
            return cachedClasses;
        }

        const classes = await this.prismaService.client().class.findMany({
            where: { teacherId: userId, isActive: true },
        });

        await this.cache.set(cacheKey, classes);

        return classes;
    }

    async registerClass(userId: string, className: string, habitat: string): Promise<{ message: string }> {
        // Implement the logic to register a class
        const cacheKey = this.keyForUserClasses(userId);
        const existingClassFromUser = await this.prismaService.client().class.findFirst({
            where: {
                teacherId: userId,
                name: className
            }
        });

        if (existingClassFromUser) {
            throw new ConflictException('Class with the same name already exists for this user');
        }

        const newClass = await this.prismaService.client().class.create({
            data: {
                teacherId: userId,
                name: className,
                habitat: habitat
            }
        });
        await this.updateOldCache(cacheKey, [newClass]);
        return { message: 'Class registered successfully' };
    }

    async updateClass(classId: string, userId: string, updatedData: {name?: string, habitat?: string}): Promise<{ message: string }> {
        const classToUpdate = await this.prismaService.client().class.findUnique({
            where: { id: classId },
        });

        if (!classToUpdate) {
            throw new ConflictException('Class not found');
        }

        await this.prismaService.client().class.update({
            where: { id: classId },
            data: updatedData,
        });

        const cacheKey = this.keyForUserClasses(userId);
        await this.cache.del(cacheKey);

        return { message: 'Class updated successfully' };
    }

    async deleteClass(classId: string, userId: string): Promise<{ message: string }> {
        const classToDelete = await this.prismaService.client().class.findUnique({
            where: { id: classId },
        });

        if (!classToDelete) {
            throw new ConflictException('Class not found');
        }
        await this.prismaService.client().class.update({
            where: { id: classId },
            data: { isActive: false },
        });

        const cacheKey = this.keyForUserClasses(userId);
        await this.cache.del(cacheKey);

        return { message: 'Class deleted successfully' };
    }
}
