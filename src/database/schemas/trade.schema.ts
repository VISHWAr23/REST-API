import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';
import { Document } from 'mongoose';

export enum TradeType {
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
}

registerEnumType(TradeType, {
  name: 'TradeType',
});

export enum TradeStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(TradeStatus, {
  name: 'TradeStatus',
});

@ObjectType()
@Schema({ timestamps: true })
export class Trade {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  companyName: string;

  @Field()
  @Prop({ required: true })
  typeOfWork: string;

  @Field()
  @Prop({ required: true })
  quantity: number;

  @Field(() => TradeType)
  @Prop({ required: true, enum: TradeType })
  tradeType: TradeType;

  @Field(() => TradeStatus)
  @Prop({ required: true, enum: TradeStatus, default: TradeStatus.PENDING })
  status: TradeStatus;

  @Field()
  @Prop({ required: true })
  date: Date;
}

export type TradeDocument = Trade & Document;
export const TradeSchema = SchemaFactory.createForClass(Trade);
