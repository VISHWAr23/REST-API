import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';                                        
import { MyLoggerModule } from './my-logger/my-logger.module';
import { AuthModule } from './auth/auth.module';
import { SalaryModule } from './salary/salary.module';
import { DailyWorkModule } from './daily-work/daily-work.module';
import { GraphqlModule } from './graphql/graphql.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    ThrottlerModule.forRoot([{
      ttl: 600,
      limit: 10,
    }]),
    MyLoggerModule,
    AuthModule,
    SalaryModule,
    DailyWorkModule,
    GraphqlModule,
  ],
  controllers: [AppController],
  providers: [AppService,{
    provide: APP_FILTER,
    useClass: AllExceptionsFilter,
  }],
})
export class AppModule {}
