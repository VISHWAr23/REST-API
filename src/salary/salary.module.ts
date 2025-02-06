import { Module } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { SalaryResolver } from './salary.resolver';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [SalaryService, SalaryResolver],
  exports: [SalaryService],
})
export class SalaryModule {}