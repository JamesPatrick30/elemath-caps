import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  TeacherResponse,
  ClassItemResponse,
  StudentPerformanceResponse,
  TrendPointResponse,
  DashboardStatsResponse,
} from '@repo/types';
import { CacheService } from '../../redis/cache.service';
@Injectable()
export class TeacherService {
  constructor(private readonly prismaService: PrismaService, private readonly cacheService: CacheService) {}

  private cacheKey(userId: string, suffix: string) {
    return `teacher:${userId}:${suffix}`;
  }
  /** Basic profile info for the topbar/teacher badge. */
  async getDashboardData(userId: string): Promise<TeacherResponse> {
    const teacher = await this.prismaService.client().user.findUnique({
      where: { id: userId },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const cacheKey = this.cacheKey(userId, 'profile');
    const cachedData = await this.cacheService.get<TeacherResponse>(cacheKey);

    console.log('Cached data:', cachedData); // Log the cached data for debugging

    if (cachedData) {
      return cachedData;
    }
    const profileData: TeacherResponse = {
      id: teacher.id,
      email: teacher.email,
      name: teacher.name,
      isActive: teacher.isActive,
      createdAt: teacher.createdAt.toISOString(),
      updatedAt: teacher.updatedAt.toISOString(),
    };
    await this.cacheService.set(this.cacheKey(userId, 'profile'), JSON.stringify(profileData), 360); // Cache for 1 minute (360 seconds)
    return profileData;
  }

  /** Powers StatHUD: classes / students / avg score / needs-attention counts. */
  async getDashboardStats(userId: string): Promise<DashboardStatsResponse> {

    const cacheKey = this.cacheKey(userId, 'stats');
    const cachedData = await this.cacheService.get<DashboardStatsResponse>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const classes = await this.prismaService.client().class.findMany({
      where: { teacherId: userId, isActive: true },
      include: {
        _count: { select: { students: true } },
        classAnalytics: true,
      },
    });

    const totalClasses = classes.length;
    const totalStudents = classes.reduce((sum, c) => sum + c._count.students, 0);

    const scoredClasses = classes.filter((c) => c.classAnalytics !== null);
    const averageScore = scoredClasses.length
      ? Math.round(
          scoredClasses.reduce((sum, c) => sum + (c.classAnalytics?.averageScore ?? 0), 0) /
            scoredClasses.length,
        )
      : 0;

    const needsAttention = await this.prismaService.client().studentAnalytics.count({
      where: {
        averageScore: { lt: 60 },
        student: { teacherId: userId, isActive: true },
      },
    });

    await this.cacheService.set(cacheKey, JSON.stringify({ totalClasses, totalStudents, averageScore, needsAttention }), 360);

    return { totalClasses, totalStudents, averageScore, needsAttention };
  }

  /** Powers ClassOverview / ClassCard. */
  async getClasses(userId: string): Promise<ClassItemResponse[]> {
    const classes = await this.prismaService.client().class.findMany({
      where: { teacherId: userId, isActive: true },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { students: true, quizzes: true } },
        classAnalytics: true,
      },
    });

    return classes.map((c) => ({
      id: c.id,
      teacherId: c.teacherId,
      name: c.name,
      habitat: c.habitat,
      isActive: c.isActive,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      studentCount: c._count.students,
      quizCount: c._count.quizzes,
      classAnalytics: c.classAnalytics
        ? {
            id: c.classAnalytics.id,
            classId: c.classAnalytics.classId,
            totalStudents: c.classAnalytics.totalStudents,
            quizzesCreated: c.classAnalytics.quizzesCreated,
            quizzesCompleted: c.classAnalytics.quizzesCompleted,
            averageScore: c.classAnalytics.averageScore,
          }
        : null,
    }));
  }

  /** Powers StudentTable. Optionally scoped to one class. */
  async getStudentPerformance(
    userId: string,
    classId?: string,
  ): Promise<StudentPerformanceResponse[]> {
    const students = await this.prismaService.client().students.findMany({
      where: {
        teacherId: userId,
        isActive: true,
        ...(classId ? { classroomId: classId } : {}),
      },
      orderBy: { name: 'asc' },
      include: {
        classroom: { select: { name: true } },
        analytics: true,
      },
    });

    return students.map((s) => ({
      id: s.id,
      teacherId: s.teacherId,
      classroomId: s.classroomId,
      name: s.name,
      email: s.email,
      isActive: s.isActive,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      className: s.classroom.name,
      analytics: s.analytics
        ? {
            id: s.analytics.id,
            studentId: s.analytics.studentId,
            quizzesTaken: s.analytics.quizzesTaken,
            averageScore: s.analytics.averageScore,
            highestScore: s.analytics.highestScore,
            lowestScore: s.analytics.lowestScore,
            totalTimeSpent: s.analytics.totalTimeSpent,
            accuracy: s.analytics.accuracy,
          }
        : null,
    }));
  }

  /**
   * Powers PerformanceChart. There's no per-day bucket model in the schema,
   * so this buckets by quiz (in creation order) — each point is one quiz's
   * average score across all attempts. Swap the `map` step for a date-bucket
   * groupBy later if you add submission-day granularity.
   */
  async getPerformanceTrend(userId: string, classId?: string): Promise<TrendPointResponse[]> {
    const quizzes = await this.prismaService.client().quiz.findMany({
      where: { teacherId: userId, ...(classId ? { classId } : {}) },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        attempts: { select: { score: true, totalItems: true } },
      },
    });

    return quizzes
      .filter((q) => q.attempts.length > 0)
      .map((q) => {
        const pctScores = q.attempts.map((a) =>
          a.totalItems > 0 ? (a.score / a.totalItems) * 100 : 0,
        );
        const averageScore = Math.round(
          pctScores.reduce((sum, s) => sum + s, 0) / pctScores.length,
        );

        return {
          label: q.title,
          date: q.createdAt.toISOString(),
          averageScore,
          attempts: q.attempts.length,
        };
      });
  }
}