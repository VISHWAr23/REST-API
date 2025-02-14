import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ThrottlerModule } from '@nestjs/throttler';                                   
import { MyLoggerModule } from './my-logger/my-logger.module';
import { AuthModule } from './auth/auth.module';
import { SalaryModule } from './salary/salary.module';
import { DailyWorkModule } from './daily-work/daily-work.module';
import { GraphqlModule } from './graphql/graphql.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { ConfigModule } from '@nestjs/config';
import { TradeModule } from './trade/trade.module';
import { AuthService } from './auth/auth.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

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
    TradeModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: '2215042@nec.edu.in',
          pass: '&221504205&'
        }
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>'
      },
      template: {
        dir: join(__dirname, '..', 'src', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        }
      }
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    }
  ],
})
export class AppModule {}