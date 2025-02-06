import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum Role {
  Owner = 'Owner',
  Employee = 'Employee'
}

@Schema({ timestamps: true })
export class Employee extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, enum: Role })
  role: Role;

  @Prop({ required: true })
  hashed_password: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Salary' }] })
  salaries: MongooseSchema.Types.ObjectId[];
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);