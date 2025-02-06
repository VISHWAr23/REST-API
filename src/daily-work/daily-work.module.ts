import { Module } from '@nestjs/common';
import { DailyWorkService } from './daily-work.service';
import { DailyWorkResolver } from './daily-work.resolver';
import { DatabaseModule } from '../database/database.module';
import { SalaryModule } from '../salary/salary.module';

@Module({
  imports: [DatabaseModule, SalaryModule],
  providers: [DailyWorkService, DailyWorkResolver],
  exports: [DailyWorkService],
})
export class DailyWorkModule {}
