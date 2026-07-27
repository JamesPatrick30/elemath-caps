import { Body,Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register.dto';
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}

    @Post('register')
    async create(@Body() body: RegisterUserDto): Promise<{message: string}> {
        return this.usersService.register(body);
    }
}
