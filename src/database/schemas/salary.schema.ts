import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@ObjectType('EmployeeSalary')
@Schema({ timestamps: true })
export class Salary extends Document {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Employee', required: true })
  employeeId: MongooseSchema.Types.ObjectId;

  @Field()
  @Prop({ required: true })
  month: Date;

  @Field()
  @Prop({ required: true })
  totalAmount: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const SalarySchema = SchemaFactory.createForClass(Salary);