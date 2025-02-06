import { Injectable, OnModuleInit } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService implements OnModuleInit {
    constructor(
        @InjectConnection() private readonly connection: Connection,
        private ConfigService: ConfigService
    ) {}

    async onModuleInit() {
        try {
          if (this.connection.db) {
            await this.connection.db.admin().ping();
            console.log('Connected to MongoDB Atlas');
          } else {
            console.error('MongoDB Atlas connection failed: connection.db is undefined');
          }
          console.log('Connected to MongoDB Atlas');
        } catch (error) {
          console.error('MongoDB Atlas connection failed:', error);
        }
      }
}