import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Salary } from '../database/schemas/salary.schema';

@Injectable()
export class SalaryService {
  constructor(
    @InjectModel(Salary.name) private readonly salaryModel: Model<Salary>
  ) {}

  async findAll() {
    return await this.salaryModel.aggregate([
      {
        $group: {
          _id: '$employeeId',
          totalSalary: { $sum: '$totalAmount' },
          salaries: {
            $push: {
              _id: { $toString: '$_id' },  // Convert ObjectId to string
              employeeId: { $toString: '$employeeId' },  // Convert ObjectId to string
              month: '$month',
              totalAmount: '$totalAmount',
              createdAt: '$createdAt',
              updatedAt: '$updatedAt'
            }
          }
        }
      },
      {
        $lookup: {
          from: 'employees',
          localField: '_id',
          foreignField: '_id',
          as: 'employeeDetails'
        }
      },
      {
        $unwind: '$employeeDetails'
      },
      {
        $project: {
          _id: { $toString: '$_id' },  // Convert ObjectId to string
          totalSalary: 1,
          salaries: 1,
          employeeDetails: {
            _id: { $toString: '$employeeDetails._id' },  // Convert ObjectId to string
            // Add other employee fields you need
          }
        }
      }
    ]);
  }

  async findByEmployeeId(employeeId: string) {
    return await this.salaryModel.aggregate([
      {
        $match: { employeeId: new Types.ObjectId(employeeId) }  // Convert string to ObjectId
      },
      {
        $group: {
          _id: '$employeeId',
          totalSalary: { $sum: '$totalAmount' },
          salaries: {
            $push: {
              _id: { $toString: '$_id' },  // Convert ObjectId to string
              employeeId: { $toString: '$employeeId' },  // Convert ObjectId to string
              month: '$month',
              totalAmount: '$totalAmount',
              createdAt: '$createdAt',
              updatedAt: '$updatedAt'
            }
          }
        }
      },
      {
        $lookup: {
          from: 'employees',
          localField: '_id',
          foreignField: '_id',
          as: 'employeeDetails'
        }
      },
      {
        $unwind: '$employeeDetails'
      },
      {
        $project: {
          _id: { $toString: '$_id' },  // Convert ObjectId to string
          totalSalary: 1,
          salaries: 1,
          employeeDetails: {
            _id: { $toString: '$employeeDetails._id' },  // Convert ObjectId to string
            // Add other employee fields you need
          }
        }
      }
    ]);
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