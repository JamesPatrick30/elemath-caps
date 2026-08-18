import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { GenerateQuestionsRequest } from '@repo/types';

export class GenerateQuestionsDto implements GenerateQuestionsRequest {
    @IsString()
    classId!: string;
    
    @IsString()
    lessonId!: string ;

    @IsNotEmpty()
    numberOfQuestions!: number;

    @IsString()
    @IsEnum(['multiple-choice', 'true-false', 'short-answer'],
        {message: 'type must be one of the following: multiple-choice, true-false, short-answer'}
    )
    type!: 'multiple-choice' | 'true-false' | 'short-answer';
}