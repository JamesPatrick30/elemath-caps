import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class UsersService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly sharedService: SharedService
    ) {}

    async register(body: any): Promise<{message: string}> {
        const { email, password, name } = body;

        const existingUser = await this.prismaService.client().user.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw new ConflictException('User already exists');
        }
        const hashedPassword = await this.sharedService.hashPassword(password);
        const user = await this.prismaService.client().user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });
        return { message: 'User registered successfully' };
    }
}
