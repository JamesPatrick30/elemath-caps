import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { WebsocketService } from '../websocket/websocket.service';
import { QueueNames } from '../types/queue';
import { GenerateQuestionsRequest } from '@repo/types';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../redis/cache.service';
import type { quizSession } from "@repo/types";
import type { addQuestion, getQuestionsResponse } from '../types/game';
import { SocketEvents } from '../types/game';
@Injectable()
export class GameService {
  constructor(
    @InjectQueue(QueueNames.GenerateQuestions) private readonly generateQuestionsQueue: Queue,
    private readonly prismaService: PrismaService,
    private readonly websocketService: WebsocketService,
    private readonly cacheService: CacheService
  ) {}

  private gameSessionCacheKey(classId: string, type: 'session'| 'questions' ): string {
    return `game_session_${classId}_${type}`;
  }

  private generateRandomQuestionsId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  
  async generateQuestions(data: GenerateQuestionsRequest): Promise<void> {
    console.log('Adding GenerateQuestions job to the queue:', data);
    await this.generateQuestionsQueue.add('generate-questions', {content: data.content, numberOfQuestions: data.numberOfQuestions, type: data.type} as GenerateQuestionsRequest, {
      attempts: 3,
      removeOnComplete: 100,
      removeOnFail: 100,
    });
  }

  async CreateQuizSession( classId: string ): Promise<void> {
    const ClassData = await this.prismaService.client().class.findUnique({
      where: { id: classId },
      include: { students: true },
    });

    if (!ClassData) {
      throw new NotFoundException(`Class with ID ${classId} not found`);
    }
    const key = this.gameSessionCacheKey(classId, 'session');

    const sessionData: quizSession = {
      classId: ClassData.id,
      students: ClassData.students.map(student => ({ id: student.id, name: student.name, isInGame: false })),
      createdAt: new Date().toISOString(),
      status: 'active',
      isStarted: false,
    }

    await this.cacheService.set(key, sessionData, 3600); // Set expiration to 1 hour (3600 seconds)
  }

  async getQuizSession(classId: string): Promise<any> {
    const key = this.gameSessionCacheKey(classId, 'session');
    const sessionData = await this.cacheService.get(key);

    if (!sessionData) {
      throw new NotFoundException(`No active quiz session found for class ID ${classId}`);
    }
    return sessionData;
  }

  async endQuizSession(classId: string): Promise<void> {
    const key = this.gameSessionCacheKey(classId, 'session');
    await this.cacheService.del(key);
  }

  async addQuestionsToSession(
    classId: string,
    question: addQuestion,
  ): Promise<void> {
    const key = this.gameSessionCacheKey(classId, 'questions');

    const mappedQuestions: addQuestion[] = [question].map((q) => ({
      id: this.generateRandomQuestionsId(),
      question: q.question,
      type: q.type,
      choices: q.choices,
      answer: q.answer,
    }));
    const cached = await this.cacheService.get<addQuestion[]>(key);

    if (!cached) {
      await this.cacheService.set(key, JSON.stringify(mappedQuestions));
      return;
    }


    const updatedQuestions = [
      ...cached,
      ...mappedQuestions,
    ];

    await this.cacheService.set(key, JSON.stringify(updatedQuestions));
  }

  async removeQuestionFromSession(classId: string, questionIds: string[]): Promise<void> {
    const key = this.gameSessionCacheKey(classId, 'questions');
    const cached = await this.cacheService.get<getQuestionsResponse[]>(key);

    if (!cached) {
      throw new NotFoundException(`No questions found for class ID ${classId}`);
    }

    const updatedQuestions = cached.filter(q => !questionIds.includes(q.id));

    await this.cacheService.set(key, JSON.stringify(updatedQuestions));
  }

  async CancelQuizSession(classId: string): Promise<{message: string}> {
    const sessionKey = this.gameSessionCacheKey(classId, 'session');
    const questionsKey = this.gameSessionCacheKey(classId, 'questions');

    await this.cacheService.del(sessionKey);
    await this.cacheService.del(questionsKey);

    return { message: `Quiz session for class ID ${classId} has been canceled.` };
  }

  async startQuizSession(classId: string): Promise<{message: string}> {
    const sessionKey = this.gameSessionCacheKey(classId, 'session');
   
    const sessionData = await this.cacheService.get<quizSession>(sessionKey);

    if (!sessionData) {
      throw new NotFoundException(`No active quiz session found for class ID ${classId}`);
    }

    this.cacheService.set(sessionKey, JSON.stringify({ ...sessionData, isStarted: true } as quizSession));
    this.websocketService.emit( SocketEvents.QUIZ_STARTED, { message: 'The quiz has started!', classId });
    return { message: `Quiz session for class ID ${classId} has been started.` };
  }
} 