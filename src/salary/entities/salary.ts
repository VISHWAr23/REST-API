import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class Salary {
  @Field(() => ID)
  id: string;

  @Field()
  employeeId: string;

  @Field()
  month: Date;

  @Field(() => Float)
  totalAmount: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}