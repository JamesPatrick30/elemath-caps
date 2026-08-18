import { Body, Controller, Delete, Get, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import type { Request } from 'express';
import { AccessTeacherGuard } from '../auth/guard/accessTeacher.guard';
import { StartQuizDto } from './dto/startQuiz.dto';
import { GenerateQuestionsDto } from './dto/generateQuestions.dto';
import { AccessStudentGuard } from '../auth/guard/accessStudent.guard';
import { SubmitAnswerDto } from './dto/submitAnswer.dto';
@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @UseGuards(AccessTeacherGuard)
    @Get('session/:classId')
    async getGameSession(@Param('classId') classId: string) {
        return this.gameService.getQuizSession(classId);
    }

    @UseGuards(AccessStudentGuard)
    @Get('isGameSession')
    async isGameSessionExistStudent(@Req() req: Request) {
        console.log(`Checking game session for student with classId: ${req.user.classId}`);
        return this.gameService.isGameSessionExistStudent(req.user.classId);
    }

    @UseGuards(AccessTeacherGuard)
    @Get('isSessionExist/teacher')
    async isGameSessionExistTeacher(@Req() req: Request) {
        return this.gameService.isQuizSessionExist(req.user.sub);
    }

    @UseGuards(AccessTeacherGuard)
    @Post('create')
    async createGameSession(@Body() body: StartQuizDto, @Req() req: Request) {
        const { classId } = body;
        const userId = req.user.sub;
        return this.gameService.CreateQuizSession(classId, userId);
    }

    @UseGuards(AccessTeacherGuard)
    @Post('cancel')
    async cancelGameSession(@Body() body: StartQuizDto, @Req() req: Request) {
        const { classId } = body;
        const userId = req.user.sub;
        return this.gameService.CancelQuizSession(classId, userId);
    }

    @UseGuards(AccessTeacherGuard)
    @Post(':classId/save')
    async saveGameSession(@Param('classId') classId: string) {
        return this.gameService.saveQuizSession(classId);
    }

    @Get(':classId/leaderboard')
    @UseGuards( AccessTeacherGuard)
    async getLeaderboard(@Param('classId') classId: string) {
        console.log(`Fetching leaderboard for classId: ${classId}`);
        return this.gameService.getLeaderboard(classId);
    }

    @Get('getQuestion')
    @UseGuards( AccessStudentGuard)
    async getAnswered(@Req() req: Request){
        const { sub, classId} = req.user;
        if(!classId) throw new UnauthorizedException('this request is for students')
        return this.gameService.getQuestionSession(classId, sub);
    }

    @Post('submit/answer')
    @UseGuards(AccessStudentGuard)
    async submitAnswer(@Body() body: SubmitAnswerDto, @Req() req: Request) {
        const { answer, questionId } = body;
        if (!req.user.classId) {
            throw new UnauthorizedException('Class ID is missing for the student.');
        }
        return this.gameService.SubmitAnswer(answer, questionId, req.user.sub, req.user.classId);
    }

    @UseGuards(AccessTeacherGuard)
    @Post('generate/questions')
    async generateQuestions(@Body() body: GenerateQuestionsDto, @Req() req: Request) {
        const { classId,lessonId, numberOfQuestions, type } = body;
        return this.gameService.generateQuestions({id: req.user.sub, email: req.user.email}, lessonId, numberOfQuestions, type, classId);
    }

    @Post('join/:classId')
    @UseGuards(AccessStudentGuard)
    async joinGameSession(@Param('classId') classId: string, @Req() req: Request) {
        return this.gameService.joinQuizSession(classId, req.user.sub);
    }

    @Get('students')
    @UseGuards(AccessStudentGuard)
    async getStudentsInSession(@Req() req: Request) {
        const classId = req.user?.classId;
        return this.gameService.getStudentsInSession(classId);
    }
}
