import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Salary } from '../database/schemas/salary.schema';

@Injectable()
export class SalaryService {
  constructor(
    @InjectModel(Salary.name) private readonly salaryModel: Model<Salary>
  ) {}

  async findAll() {
    return await this.salaryModel.find().populate('employeeId');
  }

  async findByEmployeeId(employeeId: string) {
    return await this.salaryModel.find({ employeeId }).populate('employeeId');
  }

  async updateOrCreateMonthlySalary(employeeId: string, amount: number) {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const existingSalary = await this.salaryModel.findOne({
      employeeId,
      month: {
        $gte: currentMonth,
        $lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
      }
    });

    if (existingSalary) {
      existingSalary.totalAmount += amount;
      return await existingSalary.save();
    }

    const newSalary = new this.salaryModel({
      employeeId,
      month: currentMonth,
      totalAmount: amount
    });

    return await newSalary.save();
  }
}