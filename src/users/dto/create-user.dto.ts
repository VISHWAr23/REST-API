import { IsEmail, IsEnum, IsString,IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    gmail: string;

    @IsNotEmpty()
    @IsEnum(['Employee', 'Owner'],{
        message: 'Role must be either Employee or Owner'
    })
    role: 'Employee' | 'Owner';
}