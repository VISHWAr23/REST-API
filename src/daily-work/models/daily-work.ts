import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class DailyWork {

  @Field()
  employeeId: string;

  @Field(() => Float)
  quantity: number;

  @Field(() => Float)
  ratePerUnit: number;

  @Field()
  workType: string;

  @Field(() => Float)
  dailyAmount: number;

  @Field()
  date: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}