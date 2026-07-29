import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterStudentDto {

    @IsOptional()
    @IsString()
    name!: string;

    @IsString()
    @IsOptional()
    email!: string;

    @IsString()
    @IsOptional()
    password!: string;

  
}