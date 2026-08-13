import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import type { Request } from 'express';
import { AccessTeacherGuard } from '../auth/guard/accessTeacher.guard';
import { StartQuizDto } from './dto/startQuiz.dto';
import { GenerateQuestionsDto } from './dto/generateQuestions.dto';
import { AddQuestionDto } from './dto/addQuestion.dto';
import { RemoveQuestionsDto } from './dto/removeQuestions.dto';
import { AccessStudentGuard } from '../auth/guard/accessStudent.guard';
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
    @Post('start/:classId')
    async startGameSession(@Param('classId') classId: string) {
        return this.gameService.startQuizSession(classId);
    }

    @Post('questions/add')
    async addQuestions(@Body() body: AddQuestionDto) {
        const { classId, question, choices, type, answer } = body;
        return this.gameService.addQuestionsToSession(classId, { question, choices, type, answer });
    }

    @Delete('questions/remove')
    async removeQuestions(@Body() body:RemoveQuestionsDto)  {
        const { classId, questionIds } = body;
        return this.gameService.removeQuestionFromSession(classId, questionIds);
    }

    @Post('generate/questions')
    async generateQuestions(@Body() body: GenerateQuestionsDto) {
        const { content, numberOfQuestions, type } = body;
        return this.gameService.generateQuestions({ content, numberOfQuestions, type });
    }

    @Post('join/:classId')
    @UseGuards(AccessStudentGuard)
    async joinGameSession(@Param('classId') classId: string, @Req() req: Request) {
        console.log(`Student attempting to join quiz session for classId: ${classId}`);
        return this.gameService.joinQuizSession(classId, req.user.sub);
    }

    @Get('students')
    @UseGuards(AccessStudentGuard)
    async getStudentsInSession(@Req() req: Request) {
        const classId = req.user?.classId;
        return this.gameService.getStudentsInSession(classId);
    }
}
