import { Injectable,NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { WebsocketService } from '../websocket/websocket.service';
import { QueueNames } from '../types/queue';
import { GenerateQuestionsRequest } from '@repo/types';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '@repo/redis';
import type { quizSession, createQuizSessionResponse } from "@repo/types";
import type { addQuestion, getQuestionsResponse } from '../types/game';
import { SocketEvents } from '../types/socketEvents';
import { SharedService } from '../shared/shared.service';
@Injectable()
export class GameService {
  constructor(
    @InjectQueue(QueueNames.AI) private readonly generateQuestionsQueue: Queue,
    private readonly prismaService: PrismaService,
    private readonly websocketService: WebsocketService,
    private readonly cacheService: CacheService,
    private readonly sharedService: SharedService,
  ) {}

  private gameSessionCacheKey(classId: string, type: 'session'| 'questions' ): string {
    return `game_session_${classId}_${type}`;
  }

  private gameSessionCheckKey(userId: string): string {
    return `game_session_check_${userId}`;
  }

  private generateRandomQuestionsId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  
  async generateQuestions(user: { id: string, email: string },lessonId: string , numberOfQuestions: number, type: 'multiple-choice' | 'true-false' | 'short-answer'): Promise<{message: string}> {
    // TODO: Add logic to generate questions based on the provided data
    console.log('Adding GenerateQuestions job to the queue:', { lessonId, numberOfQuestions, type });

    const lessondata = await this.prismaService.client().lessons.findUnique({
      where: { id: lessonId },
      select: { 
        id: true,
        class: {
          select:{
            teacherId: true
          }
        }},
    });

    console.log('Lesson data retrieved:', lessondata);
    if (!lessondata) {
      throw new NotFoundException(`Lesson with ID ${lessonId} not found`);
    }

    if (lessondata.class.teacherId !== user.id) {
      throw new UnauthorizedException(`User with ID ${user.email} is not authorized to generate questions for this lesson`);
    }
    void this.generateQuestionsQueue.add('generate-questions', {lessonId: lessonId, numberOfQuestions: numberOfQuestions, type: type} as GenerateQuestionsRequest, {
      attempts: 3,
      removeOnComplete: 100,
      removeOnFail: 100,
    });

    return {message: "GenerateQuestions job has been added to the queue."};
  }

  async isQuizSessionExist(userId: string): Promise<boolean> {
    const checkKey = this.gameSessionCheckKey(userId);
    const exists = await this.cacheService.get(checkKey);

    if (!exists) {
      throw new NotFoundException(`No active quiz session found for user ID ${userId}`);
    }
    return true;
  }
  async CreateQuizSession( classId: string, userId: string ): Promise<createQuizSessionResponse> {
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
      students: ClassData.students.map(student => ({ id: student.id, name: student.name, isInGame: false,joinedAt: null })),
      createdAt: new Date().toISOString(),
      status: 'active',
      isStarted: false,
    }

    const checkKey = this.gameSessionCheckKey(userId);
    this.cacheService.setGameData(checkKey, 'true', 3600); // Set expiration to 1 hour (3600 seconds)
    await this.cacheService.setGameData(key, JSON.stringify(sessionData), 3600); // Set expiration to 1 hour (3600 seconds)
    const roomKey = await this.sharedService.joinRoomKey(classId);

    this.websocketService.teacherJoinRoom(roomKey);
    this.websocketService.emit(userId,{role: 'teacher' },roomKey);

    return { sessionId: classId, message: `Quiz session for class ID ${classId} has been created.` };
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
      await this.cacheService.setGameData(key, JSON.stringify(mappedQuestions));
      return;
    }


    const updatedQuestions = [
      ...cached,
      ...mappedQuestions,
    ];

    await this.cacheService.setGameData(key, JSON.stringify(updatedQuestions));
  }

  async removeQuestionFromSession(classId: string, questionIds: string[]): Promise<void> {
    const key = this.gameSessionCacheKey(classId, 'questions');
    const cached = await this.cacheService.get<getQuestionsResponse[]>(key);

    if (!cached) {
      throw new NotFoundException(`No questions found for class ID ${classId}`);
    }

    const updatedQuestions = cached.filter(q => !questionIds.includes(q.id));

    await this.cacheService.setGameData(key, JSON.stringify(updatedQuestions));
  }

  async CancelQuizSession(classId: string, userId: string): Promise<{message: string}> {
    const sessionKey = this.gameSessionCacheKey(classId, 'session');
    const questionsKey = this.gameSessionCacheKey(classId, 'questions');

    await this.cacheService.del(sessionKey);
    await this.cacheService.del(questionsKey);
    await this.cacheService.del(this.gameSessionCheckKey(userId));

    return { message: `Quiz session for class ID ${classId} has been canceled.` };
  }

  async startQuizSession(classId: string): Promise<{message: string}> {
    const sessionKey = this.gameSessionCacheKey(classId, 'session');
   
    const sessionData = await this.cacheService.get<quizSession>(sessionKey);

    if (!sessionData) {
      throw new NotFoundException(`No active quiz session found for class ID ${classId}`);
    }

    this.cacheService.setGameData(sessionKey, JSON.stringify({ ...sessionData, isStarted: true } as quizSession));
    
    this.websocketService.emit( SocketEvents.QUIZ_STARTED, { message: 'The quiz has started!', classId });
    return { message: `Quiz session for class ID ${classId} has been started.` };
  }


  async isGameSessionExistStudent(classId?: string ): Promise<{message: string, exists: boolean}> {

    if (!classId) {
      throw new NotFoundException('Class ID is required to check for an active game session.');
    }
    console.log(`Checking if game session exists for class ID: ${classId}`);
    const key = this.gameSessionCheckKey(classId);
    const exists = await this.cacheService.get(key);
    return { message: `Game session for class ID ${classId} ${exists ? 'exists' : 'does not exist'}`, exists: !!exists };
  }

  async joinQuizSession(classId: string, userId: string): Promise<{message: string}> {
    const sessionKey = this.gameSessionCacheKey(classId, 'session');
    const sessionData = await this.cacheService.get<quizSession>(sessionKey);

    if (!sessionData) {
      throw new NotFoundException(`No active quiz session found for class ID ${classId}`);
    }

    console.log(sessionData);
    console.log(sessionData.students);
    sessionData.students.forEach(student => {
      if (!student.isInGame && student.id === userId) {
        student.isInGame = true;
        student.joinedAt = new Date().getTime();
      }
    });

    await this.cacheService.setGameData(sessionKey, JSON.stringify(sessionData));
    const roomKey = await this.sharedService.joinRoomKey(classId);
    this.websocketService.joinRoom(userId, roomKey);
    this.websocketService.emit(SocketEvents.STUDENT_JOIN, { role: 'student', id: userId }, roomKey);
    return { message: `Successfully joined quiz session for class ID ${classId}` };
  }

  async getStudentsInSession(
    classId?: string,
  ): Promise<quizSession> {
    if (!classId) {
      throw new NotFoundException(
        'Class ID is required to fetch students in session.',
      );
    }

    const sessionKey = this.gameSessionCacheKey(classId, 'session');

    const sessionData: quizSession | null = await this.cacheService.get(sessionKey);

    if (!sessionData) {
      throw new NotFoundException(
        `No active quiz session found for class ID ${classId}`,
      );
    }
    return sessionData;
  }
}

