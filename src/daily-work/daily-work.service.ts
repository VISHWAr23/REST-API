import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DailyWork } from '../database/schemas/daily-work.schema';
import { SalaryService } from '../salary/salary.service';
import { CreateDailyWorkInput } from './dto/create-daily-work';

@Injectable()
export class DailyWorkService {
  constructor(
    @InjectModel(DailyWork.name) private dailyWorkModel: Model<DailyWork>,
    private salaryService: SalaryService
  ) {}

  async createDailyWork(input: CreateDailyWorkInput) {
    try {
      const dailyAmount = input.quantity * input.ratePerUnit;

      const dailyWork = new this.dailyWorkModel({
        ...input,
        dailyAmount,
      });

      const savedDailyWork = await dailyWork.save();
      console.log("Created dailyWork:", savedDailyWork);

      await this.salaryService.updateOrCreateMonthlySalary(input.employeeId, dailyAmount);
      console.log("Salary updated successfully");

      return savedDailyWork;
    } catch (error) {
      console.error("Error in createDailyWork:", {
        error,
        stack: error.stack,
        message: error.message
      });
      throw error; // Throw the original error to preserve the stack trace
    }
  }

  async findAll() {
    return this.dailyWorkModel.aggregate([
      {
        $group: {
          _id: '$employeeId',
          dailyWorks: { $push: '$$ROOT' }
        }
      }
    ]).exec();
  }

  async findByEmployeeId(employeeId: string) {
    return this.dailyWorkModel.aggregate([
      {
        $match: { employeeId }
      },
      {
        $group: {
          _id: '$employeeId',
          dailyWorks: { 
            $push: {
              $mergeObjects: [
                '$$ROOT',
                { date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } } }
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          employeeId: '$_id',
          dailyWorks: {
            $sortArray: {
              input: '$dailyWorks',
              sortBy: { date: -1 }
            }
          }
        }
      }
    ]).exec();
  }
}