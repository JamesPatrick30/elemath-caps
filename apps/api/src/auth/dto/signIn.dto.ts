import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import type { SignInType } from '@repo/types';
export class SignInDto implements SignInType {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}