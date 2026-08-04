import type { addQuestionsToSessionRequest } from "@repo/types";
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AddQuestionDto implements addQuestionsToSessionRequest {

    @IsNotEmpty()
    @IsString()
    classId!: string;

    @IsNotEmpty()
    @IsString()
    question!: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    choices?: string[] | null;

    @IsNotEmpty()
    @IsEnum(['multiple-choice', 'true-false', 'short-answer'])
    type!: 'multiple-choice' | 'true-false' | 'short-answer';

    @IsString()
    answer!: string;
}