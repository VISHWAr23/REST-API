import { IsNotEmpty, IsEmail, IsString, IsEnum } from 'class-validator';
import { Role } from '../../database/schemas/employee.schema';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}