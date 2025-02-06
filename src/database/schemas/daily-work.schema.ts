import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Document, Types } from 'mongoose';

@ObjectType()
@Schema({ timestamps: true })
export class DailyWork extends Document {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  employeeId: string;

  @Field(() => Float)
  @Prop({ required: true })
  quantity: number;

  @Field(() => Float)
  @Prop({ required: true })
  ratePerUnit: number;

  @Field()
  @Prop({ required: true })
  workType: string;

  @Field(() => Float)
  @Prop({ required: true })
  dailyAmount: number;

  @Field()
  @Prop({ default: Date.now })
  date: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const DailyWorkSchema = SchemaFactory.createForClass(DailyWork);