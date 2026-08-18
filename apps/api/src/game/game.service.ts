import { Injectable,NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { WebsocketService } from '../websocket/websocket.service';
import { QueueNames } from '../types/queue';
import type { LeaderboardResponse, generateQuestionsQueueData, QuizStudentData,GetQuizQuestionsResponse, QuestionSave, quizSession, createQuizSessionResponse } from '@repo/types';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '@repo/redis';
// import type { addQuestion, getQuestionsResponse } from '../types/game';
import { SocketEvents } from '../types/socketEvents';
import { SharedService } from '../shared/shared.service';
import type { StudentLeaderboardTable, updateStudentScore } from '@repo/types';
interface answeredData {
  id: string
}

@Injectable()
export class GameService {
  constructor(
    @InjectQueue(QueueNames.AI) private readonly generateQuestionsQueue: Queue,
    private readonly prismaService: PrismaService,
    private readonly websocketService: WebsocketService,
    private readonly cacheService: CacheService,
    private readonly sharedService: SharedService,
  ) {}

  private gameSessionCacheKey(classId: string, type: 'session'| 'questions' | 'score' ): string {
    return `game_session_${classId}_${type}`;
  }

  private gameSessionCheckKey(userId: string): string {
    return `game_session_check_${userId}`;
  }

  private studentAnsweredKey(classId: string, studentId: string): string {
    return `answerd:${classId}-${studentId}`;
  }

  
  
  async generateQuestions(user: { id: string, email: string },lessonId: string , numberOfQuestions: number, type: 'multiple-choice' | 'true-false' | 'short-answer', classId: string): Promise<{message: string}> {
    // TODO: Add logic to generate questions based on the provided data

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

    const roomKey = await this.sharedService.joinRoomKey(classId);
    const roomQuestionsKey = this.gameSessionCacheKey(classId,'questions');
    void this.generateQuestionsQueue.add('generate-questions', {moduleId: lessonId, numberOfQuestions: numberOfQuestions, type: type, roomKey: roomKey, roomQuestionsKey: roomQuestionsKey} as generateQuestionsQueueData, {
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
      students: ClassData.students.map(student => ({ id: student.id, name: student.name, isInGame: false,joinedAt: null, isDone: false })),
      createdAt: new Date().toISOString(),
      status: 'active',
      isStarted: false,
      isSessionDone: false,
    }

    const checkKey = this.gameSessionCheckKey(userId);
    this.cacheService.setGameData(checkKey, 'true', 3600); // Set expiration to 1 hour (3600 seconds)
    await this.cacheService.setGameData(key, JSON.stringify(sessionData), 3600); // Set expiration to 1 hour (3600 seconds)
    const roomKey = await this.sharedService.joinRoomKey(classId);

    this.websocketService.teacherJoinRoom(roomKey);
    this.websocketService.emit(userId,{role: 'teacher' },roomKey);

    return { sessionId: classId, message: `Quiz session for class ID ${classId} has been created.` };
  }

  async checkAllStudentsDone(classId: string): Promise<boolean> {
    const sessionKey = this.gameSessionCacheKey(classId, 'session');
    let sessionData = await this.cacheService.get<quizSession>(sessionKey);

    if (!sessionData) {
      throw new NotFoundException(`No active quiz session found for class ID ${classId}`);
    }
    console.log('sessionData:', sessionData);
    const allStudentsInGame = sessionData.students.filter(student => student.isInGame);
    if (allStudentsInGame.length === 0) {
      throw new NotFoundException(`No students are currently in the game for class ID ${classId}`);
    }
    const allDone = allStudentsInGame.every(student => student.isDone === true);

    if (allDone) {
      // Update the session to mark it as done
      sessionData.isSessionDone = true;
      console.log(`All students have completed the quiz for class ID ${classId}. Updating session status to done.`);
      await this.cacheService.setGameData(sessionKey, JSON.stringify(sessionData));
    }
    return allDone;
  }

  async getQuizSession(classId: string): Promise<any> {
    const key = this.gameSessionCacheKey(classId, 'session');
    const sessionData = await this.cacheService.get(key);

    if (!sessionData) {
      throw new NotFoundException(`No active quiz session found for class ID ${classId}`);
    }
    const roomKey = await this.sharedService.joinRoomKey(classId);

    this.websocketService.teacherJoinRoom(roomKey);

    return sessionData;
  }

  async endQuizSession(classId: string): Promise<void> {
    const key = this.gameSessionCacheKey(classId, 'session');
    await this.cacheService.del(key);
  }


  async CancelQuizSession(classId: string, userId: string): Promise<{message: string}> {
    const sessionKey = this.gameSessionCacheKey(classId, 'session');
    const questionsKey = this.gameSessionCacheKey(classId, 'questions');

    await this.cacheService.del(sessionKey);
    await this.cacheService.del(questionsKey);
    await this.cacheService.del(this.gameSessionCheckKey(userId));

    return { message: `Quiz session for class ID ${classId} has been canceled.` };
  }

  async getLeaderboard(classId: string): Promise<LeaderboardResponse> {
    const scoreKey = this.gameSessionCacheKey(classId, 'score');
    const leaderboard = await this.cacheService.getLeaderboard(scoreKey);
    const sessionKey = this.gameSessionCacheKey(classId, 'session');
    const sessionData = await this.cacheService.get<quizSession>(sessionKey);

    if (!sessionData) {
      throw new NotFoundException(`No active quiz session found for class ID ${classId}`);
    }

    const leaderboardWithNames: StudentLeaderboardTable[] = sessionData.students.map(entry => {
      const scoreEntry = leaderboard.find(s => s.studentId === entry.id);
      return {
        id: entry.id,
        name: entry.name,
        score: scoreEntry ? scoreEntry.score : 0
      };
    });
    const allStudentsDone = await this.checkAllStudentsDone(classId);
    console.log(`All students done status for class ID ${classId}:`, allStudentsDone);
        if (allStudentsDone) {
          this.websocketService.emit(SocketEvents.QUIZ_COMPLETED, { message: 'All students have completed the quiz' }, await this.sharedService.joinRoomKey(classId));
        }

    console.log(`Leaderboard for class ID ${classId}:`, leaderboardWithNames, `Session done status: ${sessionData.isSessionDone}`);
    return {
      leaderboard: leaderboardWithNames,
      isSessionDone: sessionData.isSessionDone
    };
  }

  async getQuestionSession(
    classId: string,
    studentId: string,
  ): Promise<GetQuizQuestionsResponse> {
      const answeredKey = this.studentAnsweredKey(
          classId,
          studentId,
      );

      const answeredQuestions =
          await this.cacheService.get<answeredData[]>(answeredKey);

      const questionKey = this.gameSessionCacheKey(
          classId,
          'questions',
      );

      const quizCacheData =
          await this.cacheService.get<QuizStudentData>(questionKey);

      if (!quizCacheData) {
          throw new NotFoundException(
              `No questions found for class ID ${classId}`,
          );
      }

      const answeredIds = new Set(
          answeredQuestions?.map(question => question.id) ?? [],
      );

      const nextQuestion = quizCacheData.questions.find(
          question => !answeredIds.has(question.id),
      );

      return {
          type: quizCacheData.type,
          question: nextQuestion
              ? {
                    id: nextQuestion.id,
                    question: nextQuestion.question,
                    options: nextQuestion.options ?? [],
                }
              : null,
      };
  }

  async SubmitAnswer(
      answer: string,
      questionId: string,
      studentId: string,
      classId: string,
  ) {
      const Questionskey = this.gameSessionCacheKey(classId, 'questions');
      const ScoreKey = this.gameSessionCacheKey(classId,'score');
      const quizCacheData = await this.cacheService.get<QuizStudentData>(Questionskey);
      if (!quizCacheData) {
          throw new NotFoundException('No questions found');
      }

      const questions = quizCacheData?.questions;

      const question = questions.find(
          (q) => q.id === questionId,
      );

      if (!question) {
          throw new NotFoundException('Question not found');
      }

      const answeredKey = this.studentAnsweredKey(
          classId,
          studentId,
      );

      const answeredQuestions =
          await this.cacheService.get<answeredData[]>(answeredKey);

      console.log('Answered questions:', answeredQuestions, 'Question Answer:', question.answer, 'Submitted Answer:', answer);
      if (answer.toLowerCase() === question.answer.toLowerCase()) {
        const score = await this.cacheService.incrementScore(ScoreKey,studentId);
        this.websocketService.emit(SocketEvents.SUBMIT_ANSWER, { studentId, score } as updateStudentScore, await this.sharedService.joinRoomKey(classId));
      }

        // this.websocketService.emit(SocketEvents.SUBMIT_ANSWER, { studentId, questionId }, await this.sharedService.joinRoomKey(classId));

      const updatedAnsweredQuestions = [
          ...(answeredQuestions ?? []),
          { id: questionId },
      ];

      await this.cacheService.setGameData(answeredKey, JSON.stringify(updatedAnsweredQuestions));

      // const nextQuestion = questions.find(
      //     (q) => q.id !== questionId,
      // );

      const nextQuestion = await this.getQuestionSession(classId,studentId);

      if (nextQuestion.question) {
          return { nextQuestion:nextQuestion.question, message: 'Answer submitted successfully' };
      } else {
        const sessionKey = this.gameSessionCacheKey(classId, 'session');
        const sessionData = await this.cacheService.get<quizSession>(sessionKey);

        if (!sessionData) {
          throw new NotFoundException(`No active quiz session found for class ID ${classId}`);
        }

        sessionData.students.forEach(student => {
          if (student.id === studentId) {
            student.isDone = true;
          }
        });

        await this.cacheService.setGameData(sessionKey, JSON.stringify(sessionData));
        const allStudentsDone = await this.checkAllStudentsDone(classId);
        if (allStudentsDone) {
          this.websocketService.emit(SocketEvents.QUIZ_COMPLETED, { message: 'All students have completed the quiz' }, await this.sharedService.joinRoomKey(classId));
        }
          return { message: 'Quiz completed' };
      }
  }


  async saveQuizSession(classId: string): Promise<{message: string}> {

    // TODO: Implement logic to save the quiz session data to a persistent storage (e.g., database) if needed.
    // Delete the session data from the cache
    const sessionKey = this.gameSessionCacheKey(classId, 'session');
    await this.cacheService.del(sessionKey);
  
    const questionsKey = this.gameSessionCacheKey(classId, 'questions');
    await this.cacheService.del(questionsKey);
    
    const checkKey = this.gameSessionCheckKey(classId);
    await this.cacheService.del(checkKey);

    const scoreKey = this.gameSessionCacheKey(classId, 'score');
    await this.cacheService.del(scoreKey);
    return { message: `Quiz session for class ID ${classId} has been saved.` };
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

