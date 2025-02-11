import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trade, TradeDocument } from '../database/schemas/trade.schema';
import { CreateTradeInput } from './dto/create-trade.input';

@Injectable()
export class TradeService {
  constructor(
    @InjectModel(Trade.name) private tradeModel: Model<TradeDocument>,
  ) {}

  async create(createTradeInput: CreateTradeInput): Promise<Trade> {
    const newTrade = new this.tradeModel(createTradeInput);
    return newTrade.save();
  }

  async findAll(): Promise<Trade[]> {
    return this.tradeModel.find().exec();
  }

  async findOne(id: string): Promise<Trade> {
    const trade = await this.tradeModel.findById(id).exec();
    if (!trade) {
      throw new NotFoundException(`Trade #${id} not found`);
    }
    return trade;
  }

  async updateStatus(id: string, status: string): Promise<Trade> {
    const updatedTrade = await this.tradeModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
    if (!updatedTrade) {
      throw new NotFoundException(`Trade #${id} not found`);
    }
    return updatedTrade;
  }
}
