import { Body,Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    async create(@Body() body: any): Promise<{message: string}> {
        return this.usersService.register(body);
    }
}
