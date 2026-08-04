import { IsString, IsNotEmpty } from 'class-validator';

export class StartQuizDto {
    @IsNotEmpty()
    @IsString()
    classId!: string;
}