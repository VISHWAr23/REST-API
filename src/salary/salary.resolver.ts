import { Resolver, Query, Args } from '@nestjs/graphql';
import { SalaryService } from './salary.service';
import { Salary } from './entities/salary';

@Resolver(() => Salary)
export class SalaryResolver {
  constructor(private readonly salaryService: SalaryService) {}

  @Query(() => [Salary])
  async salaries() {
    return this.salaryService.findAll();
  }

  @Query(() => [Salary])
  async employeeSalaries(@Args('employeeId') employeeId: string) {
    return this.salaryService.findByEmployeeId(employeeId);
  }
}