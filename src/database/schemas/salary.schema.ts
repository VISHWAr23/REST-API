import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Employee } from './employee.schema';

@Schema({ timestamps: true })
export class Salary extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Employee.name, required: true })
  employeeId: Employee;

  @Prop({ required: true })
  month: Date;

  @Prop({ required: true })
  totalAmount: number;
}

export const SalarySchema = SchemaFactory.createForClass(Salary);