import { IsString, IsNotEmpty, MaxLength, IsEnum } from 'class-validator';

export class UpdateClassDto {
    @IsString()
    @MaxLength(100)
    name?: string;

    @IsString()
    @IsEnum(['Forest', 'Desert', 'Ocean', null], {
        message: 'Invalid habitat. Please choose from Forest, Desert, or Ocean.'
    })
    habitat?: string;
}