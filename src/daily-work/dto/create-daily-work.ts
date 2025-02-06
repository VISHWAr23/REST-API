import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateDailyWorkInput {
  @Field(() => String)
  employeeId: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  ratePerUnit: number;

  @Field(() => String)
  workType: string;
}