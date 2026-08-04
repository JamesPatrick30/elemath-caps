import type { removeQuestionsFromSessionRequest } from "@repo/types";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class RemoveQuestionsDto implements removeQuestionsFromSessionRequest {

    @IsNotEmpty()
    @IsString()
    classId!: string;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    questionIds!: string[];
}