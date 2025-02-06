import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DailyWork } from './models/daily-work';
import { DailyWorkService } from './daily-work.service';
import { CreateDailyWorkInput } from './dto/create-daily-work';

@Resolver(() => DailyWork)
export class DailyWorkResolver {
  constructor(private readonly dailyWorkService: DailyWorkService) {}

  @Query(() => [DailyWork])
  async dailyWorks() {
    return this.dailyWorkService.findAll();
  }

  @Query(() => [DailyWork]) 
  async employeeDailyWorks(@Args('employeeId') employeeId: string) {
    return this.dailyWorkService.findByEmployeeId(employeeId);
  }

  @Mutation(() => DailyWork)
  async createDailyWork(@Args('input') input: CreateDailyWorkInput) {
    return this.dailyWorkService.createDailyWork(input);
  }
}