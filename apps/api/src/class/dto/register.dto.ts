import { IsString, IsNotEmpty, MaxLength, IsEnum } from 'class-validator';

export class RegisterClassDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name!: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(['Forest', 'Desert', 'Ocean'], {
        message: 'Invalid habitat. Please choose from Forest, Desert, or Ocean.'
    })
    habitat!: string;
}