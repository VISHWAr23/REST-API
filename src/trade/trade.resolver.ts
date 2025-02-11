import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TradeService } from './trade.service';
import { Trade, TradeStatus } from '../database/schemas/trade.schema';
import { CreateTradeInput } from './dto/create-trade.input';

@Resolver(() => Trade)
export class TradeResolver {
  constructor(private readonly tradeService: TradeService) {}

  @Query(() => [Trade])
  async trades(): Promise<Trade[]> {
    return this.tradeService.findAll();
  }

  @Query(() => Trade)
  async trade(@Args('id', { type: () => ID }) id: string): Promise<Trade> {
    return this.tradeService.findOne(id);
  }

  @Mutation(() => Trade)
  async createTrade(
    @Args('createTradeInput') createTradeInput: CreateTradeInput,
  ): Promise<Trade> {
    return this.tradeService.create(createTradeInput);
  }

  @Mutation(() => Trade)
  async updateTradeStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('status', { type: () => TradeStatus }) status: TradeStatus,
  ): Promise<Trade> {
    return this.tradeService.updateStatus(id, status);
  }
}
