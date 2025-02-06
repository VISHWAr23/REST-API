import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Employee, EmployeeSchema } from './schemas/employee.schema';
import { Salary, SalarySchema } from './schemas/salary.schema';
import { DailyWork, DailyWorkSchema } from './schemas/daily-work.schema';
import { DatabaseService } from './database.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
        dbName: 'project0'
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: Salary.name, schema: SalarySchema },
      { name: DailyWork.name, schema: DailyWorkSchema },
    ]),
  ],
  providers: [DatabaseService],
  exports: [MongooseModule, DatabaseService],
})
export class DatabaseModule {}
