import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { prisma } from '@repo/db';
import { Logger } from '@nestjs/common';
@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy{
  logger = new Logger(PrismaService.name);
  async onModuleInit() {
    await prisma.$connect();
    this.logger.log('Prisma connected to the database');
  }

  async onModuleDestroy() {
    await prisma.$disconnect();
    this.logger.log('Prisma disconnected from the database');
  }

  client() {
    return prisma;
  }
}
