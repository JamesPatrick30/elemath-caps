import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) {}

    async register(body: any): Promise<{message: string}> {
        const { email, password, name } = body;
        const user = await this.prismaService.client().user.create({
            data: {
                email,
                password,
                name
            }
        });
        return { message: 'User registered successfully' };
    }
}
