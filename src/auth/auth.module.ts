import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { Employee, EmployeeSchema } from '../database/schemas/employee.schema';
import { DailyWork, DailyWorkSchema } from '../database/schemas/daily-work.schema';
import { Salary, SalarySchema } from '../database/schemas/salary.schema';
import { AuthController } from './auth.controller';
import { Verification, VerificationSchema } from 'src/database/schemas/verification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: DailyWork.name, schema: DailyWorkSchema },
      { name: Salary.name, schema: SalarySchema },
      { name: Employee.name, schema: EmployeeSchema },
      { name: Verification.name, schema: VerificationSchema }
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule
  ],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
  controllers:[AuthController],
})
export class AuthModule {}