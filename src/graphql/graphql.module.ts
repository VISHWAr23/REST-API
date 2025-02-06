import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      introspection: true,
      context: ({ req, res }) => ({ req, res }),
      playground: true
    }),
    MongooseModule.forRoot("mongodb+srv://vishwarajkumar05:E8ccnggsfjI83xAE@sample1.gwluq.mongodb.net/?retryWrites=true&w=majority&appName=sample1"),
    
  ],
})
export class GraphqlModule {}