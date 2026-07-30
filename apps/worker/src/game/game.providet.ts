import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {GenerateQuestionsRequest} from '@repo/types';
import { GameService } from './game.service';
import {QueueNames} from '../types/queue';
@Processor(QueueNames.GenerateQuestions)
export class GenerateQuestionsProcessor extends WorkerHost {
  constructor(private readonly game: GameService) {
    super();
  }

  async process(job: Job): Promise<void> {
    console.log('Processing GenerateQuestions job:', job.data);
    await this.game.generateQuestions(job.data as GenerateQuestionsRequest);

    
  }
}