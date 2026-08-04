import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GameService } from './game.service';

import { StartQuizDto } from './dto/startQuiz.dto';
import { AddQuestionDto } from './dto/addQuestion.dto';
import { RemoveQuestionsDto } from './dto/removeQuestions.dto';
@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @Get('session/:classId')
    async getGameSession(@Param('classId') classId: string) {
        return this.gameService.getQuizSession(classId);
    }

    @Post('create')
    async createGameSession(@Body() body: StartQuizDto) {
        const { classId } = body;
        console.log("Creating quiz session for class ID:", classId);
        return this.gameService.CreateQuizSession(classId);
    }

    @Post('cancel')
    async cancelGameSession(@Body() body: StartQuizDto) {
        const { classId } = body;
        return this.gameService.CancelQuizSession(classId);
    }

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
}
