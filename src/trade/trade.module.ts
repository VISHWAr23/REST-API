import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeResolver } from './trade.resolver';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [TradeResolver, TradeService],
  exports: [TradeService],
})
export class TradeModule {}
