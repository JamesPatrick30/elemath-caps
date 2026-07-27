import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class RegisterStudentDto {

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;

    @IsString()
    @IsNotEmpty()
    classId!: string;
}