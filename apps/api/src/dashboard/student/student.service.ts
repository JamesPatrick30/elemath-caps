import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ActiveQuizSession,
  JoinQuizResponse,
  StudentDashboardData,
  TrailQuiz,
} from '@repo/types';
import { CacheService } from '../../redis/cache.service';
@Injectable()
export class StudentService {
    constructor(private readonly prisma: PrismaService, private readonly cacheService: CacheService) {}

    async getStudentDashboard(studentId: string): Promise<StudentDashboardData> {

        const [student, recentAttemptRows] = await Promise.all([
            this.prisma.client().students.findUnique({
                where: { id: studentId },
                select: {
                id: true,
                name: true,
                classroomId: true,
                analytics: {
                    select: {
                    quizzesTaken: true,
                    averageScore: true,
                    highestScore: true,
                    accuracy: true,
                    },
                },
                classroom: {
                    select: {
                    id: true,
                    name: true,
                    habitat: true,
                    quizzes: {
                        orderBy: { createdAt: 'asc' },
                        select: { id: true, title: true },
                    },
                    },
                },
                attempts: {
                    where: { submittedAt: { not: null } },
                    select: { quizId: true, score: true, totalItems: true, submittedAt: true },
                },
                },
            }),
            this.prisma.client().quizAttempt.findMany({
                where: { studentId, submittedAt: { not: null } },
                orderBy: { submittedAt: 'desc' },
                take: 5,
                select: {
                id: true,
                score: true,
                totalItems: true,
                durationSec: true,
                quiz: { select: { title: true } },
                },
            }),
        ]);

        if (!student) {
            throw new NotFoundException('Student not found');
        }

        const cacheKey = `student:${studentId}:dashboard`;

        const cachedData = await this.cacheService.get<StudentDashboardData>(cacheKey);
        if (cachedData) {
            return cachedData;
        }
        // quizId -> completed attempt, O(1) lookup while walking the quiz list below
        const attemptByQuizId = new Map(student.attempts.map((a) => [a.quizId, a]));

        let foundCurrent = false;
        const trailQuizzes: TrailQuiz[] = student.classroom.quizzes.map((quiz) => {
        const attempt = attemptByQuizId.get(quiz.id);

        if (attempt) {
            return {
                id: quiz.id,
                title: quiz.title,
                status: 'done',
                score: attempt.score,
                totalItems: attempt.totalItems,
            };
        }

        if (!foundCurrent) {
            foundCurrent = true;
            return { id: quiz.id, title: quiz.title, status: 'current' };
        }

            return { id: quiz.id, title: quiz.title, status: 'locked' };
        });

        const quizzesTaken = student.analytics?.quizzesTaken ?? 0;

        const dashboardData: StudentDashboardData = {
            studentName: student.name,
            streakDays: calculateStreak(student.attempts.map((a) => a.submittedAt!)),
            analytics: {
                quizzesTaken,
                averageScore: student.analytics?.averageScore ?? 0,
                highestScore: student.analytics?.highestScore ?? 0,
                accuracy: student.analytics?.accuracy ?? 0,
            },
            trail: [
                {
                classId: student.classroom.id,
                className: student.classroom.name,
                habitat: student.classroom.habitat,
                quizzes: trailQuizzes,
                },
            ],
            recentAttempts: recentAttemptRows.map((a) => ({
                id: a.id,
                title: a.quiz.title,
                score: a.score,
                totalItems: a.totalItems,
                durationSec: a.durationSec,
            })),
        };

        await this.cacheService.set(cacheKey, dashboardData, 60); // Cache for 60 seconds

        return dashboardData;
    }

    async getActiveQuiz(classId: string): Promise<JoinQuizResponse> {
        // Swap this stub for whatever tracks a "live" session — e.g. a Redis key
        // set when a teacher starts a quiz lobby, or a QuizSession table/socket
        // room. A raw DB query has no notion of "currently live" on its own.
        const activeSession: ActiveQuizSession | null = null;

        if (!activeSession) {
        return { hasActiveQuiz: false };
        }

        return { hasActiveQuiz: true, session: activeSession };
    }

    async setStudentAnalytics(studentId: string, analytics: Partial<StudentDashboardData['analytics']>) {
        // TODO: Implement this method to update the student's analytics in the database.
    }
}

function calculateStreak(submittedDates: Date[]): number {
    if (submittedDates.length === 0) return 0;

    const dayKeys = new Set(
        submittedDates.map((d) => d.toISOString().slice(0, 10)), // YYYY-MM-DD
    );

    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const key = cursor.toISOString().slice(0, 10);
        if (!dayKeys.has(key)) break;
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
}