import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QueueNames } from '../types/queue';
import { GenerateQuestionsRequest } from '@repo/types';
@Injectable()
export class GameService {
  constructor(@InjectQueue(QueueNames.GenerateQuestions) private readonly generateQuestionsQueue: Queue) {}
  async generateQuestions(data: GenerateQuestionsRequest): Promise<void> {
    console.log('Adding GenerateQuestions job to the queue:', data);
    await this.generateQuestionsQueue.add('generate-questions', {content: data.content, numberOfQuestions: data.numberOfQuestions, type: data.type} as GenerateQuestionsRequest, {
      attempts: 3,
      removeOnComplete: 100,
      removeOnFail: 100,
    });
  }
}