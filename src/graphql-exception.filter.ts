import { Catch, ArgumentsHost } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { MyLoggerService } from './my-logger/my-logger.service';

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  private readonly logger = new MyLoggerService(GraphQLExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo();

    let errorMessage = 'Internal server error';
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let statusCode = 500;

    // Handle different types of errors
    if (exception instanceof GraphQLError) {
      errorMessage = exception.message;
      errorCode = exception.extensions?.code as string || 'GRAPHQL_ERROR';
      statusCode = 400;
    } else if (exception.response) {
      // NestJS HTTP exceptions
      errorMessage = exception.response.message || exception.message;
      statusCode = exception.status || 500;
      errorCode = `ERROR_${statusCode}`;
    }

    const errorResponse = {
      message: errorMessage,
      timestamp: new Date().toISOString(),
      path: info?.path?.key || 'unknown',
      statusCode,
    };

    // Log the error
    this.logger.error(
      `${errorResponse.message} - Path: ${errorResponse.path}`,
      GraphQLExceptionFilter.name
    );

    // Return GraphQL formatted error
    return new GraphQLError(errorMessage, {
      extensions: {
        code: errorCode,
        timestamp: errorResponse.timestamp,
        path: errorResponse.path,
        statusCode,
      },
    });
  }
}