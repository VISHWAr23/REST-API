import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Prisma } from '@prisma/client';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { MyLoggerService } from 'src/my-logger/my-logger.service';
import { JwtAuthGuard } from 'src/auth/jwt.gurds';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  private logger = new MyLoggerService(EmployeesController.name);

  @Post()
  create(@Body() createEmployeeDto: Prisma.EmployeeCreateInput) {
    this.logger.log('create employee');
    return this.employeesService.create(createEmployeeDto);
  }

  @SkipThrottle( {default: false})
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('role') role?: 'Employee' | 'Owner') {
    this.logger.log('Finding all employees', EmployeesController.name);
    return this.employeesService.findAll( role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log('Finding one employee');
    return this.employeesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: Prisma.EmployeeUpdateInput) {
    this.logger.log(`Update employeefrom ${id} employee list`);
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.log(`Remove employee from ${id} employee list`);
    return this.employeesService.remove(+id);
  }


}
