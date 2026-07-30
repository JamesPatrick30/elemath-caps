import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { CookieNames } from '../types/cookie';
import { SharedService } from '../shared/shared.service';
@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private prismaService: PrismaService,
        private sharedService: SharedService
    ) {}

    private accessTokenSecret = process.env.ACCESS_JWT_SECRET;
    private refreshTokenSecret = process.env.REFRESH_JWT_SECRET;
    private cookieNames = {
        accessToken: CookieNames.accessToken,
        refreshToken: CookieNames.refreshToken,
    };

    private generateTokens(payload: any): { accessToken: string; refreshToken: string } {
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m', secret: this.accessTokenSecret });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d', secret: this.refreshTokenSecret });
        return { accessToken, refreshToken };
    }

    async teacherLogin(email: string, password: string, res: Response): Promise<{ accessToken: string; refreshToken: string }> {
        const teacher = await this.prismaService.client().user.findUnique({ where: { email } });

        if (!teacher){
            throw new NotFoundException('User not found');
        }

        if (teacher.isActive === false) {
            throw new NotFoundException('User is not active');
        }

        const isPasswordValid = await this.sharedService.comparePasswords(password, teacher.password);
        if (!isPasswordValid) {
            throw new NotFoundException('Invalid credentials');
        }

        const tokens = this.generateTokens({ sub: teacher.id, email: teacher.email, role: 'teacher' });
        
        res.cookie(this.cookieNames.accessToken, tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_STATUS === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
        });
        res.cookie(this.cookieNames.refreshToken, tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_STATUS === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return tokens;
    }

    async studentLogin(email: string, password: string, res: Response): Promise<{ accessToken: string; refreshToken: string }> {
        const student = await this.prismaService.client().user.findUnique({ where: { email } });

        if (!student){
            throw new NotFoundException('User not found');
        }

        const isPasswordValid = await this.sharedService.comparePasswords(password, student.password);
        if (!isPasswordValid) {
            throw new NotFoundException('Invalid credentials');
        }

        const tokens = this.generateTokens({ sub: student.id, email: student.email, role: 'student' });
        
        res.cookie(this.cookieNames.accessToken, tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_STATUS === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
        });
        res.cookie(this.cookieNames.refreshToken, tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_STATUS === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return tokens;
    }

    async refreshTokens(res: Response, user: any): Promise<{ accessToken: string; refreshToken: string }> {
        const tokens = this.generateTokens({ sub: user.sub, email: user.email, role: user.role });

        res.cookie(this.cookieNames.accessToken, tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_STATUS === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        res.cookie(this.cookieNames.refreshToken, tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_STATUS === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return tokens;
    }

    async logout(res: Response): Promise<{ message: string }> {
        res.clearCookie(this.cookieNames.accessToken);
        res.clearCookie(this.cookieNames.refreshToken);
        return { message: 'Logged out successfully' };
    }

}