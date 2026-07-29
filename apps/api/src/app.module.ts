import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { StudentsModule } from './students/students.module';
import { AuthModule } from './auth/auth.module';
import { SharedService } from './shared/shared.service';
import { ClassModule } from './class/class.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true,}), PrismaModule, UsersModule, StudentsModule, AuthModule, ClassModule, RedisModule],
  controllers: [AppController],
  providers: [AppService, { provide: SharedService, useClass: SharedService }],
})
export class AppModule {}

