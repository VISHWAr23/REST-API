import { InputType, Field } from '@nestjs/graphql';
import { TradeType } from '../../database/schemas/trade.schema';

@InputType()
export class CreateTradeInput {
  @Field()
  companyName: string;

  @Field()
  typeOfWork: string;

  @Field()
  quantity: number;

  @Field(() => TradeType)
  tradeType: TradeType;

  @Field()
  date: Date;
}
