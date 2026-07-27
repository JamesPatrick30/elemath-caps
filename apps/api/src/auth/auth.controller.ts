import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';
import { SignInDto } from './dto/signIn.dto';
import {RefreshGuard} from './guard/refresh.guard';
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signIn/teacher')
    async teacherLogin(@Body() body: SignInDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.teacherLogin(body.email, body.password, res);
    }

    @Post('signIn/student')
    async studentLogin(@Body() body: SignInDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.studentLogin(body.email, body.password, res);
    }

    @Post('refresh')
    @UseGuards(RefreshGuard)
    async refreshTokens(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
        return this.authService.refreshTokens(res, req.user);
    }
}
