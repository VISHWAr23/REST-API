import { Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Request, Response } from "express";
import { MyLoggerService } from "./my-logger/my-logger.service";
import { GqlArgumentsHost } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
import { GqlContextType } from "@nestjs/graphql";

type MyResponseObj = {
    statusCode: number;
    timestamp: string;
    path: string;
    response: string | object;
}

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    private readonly logger = new MyLoggerService(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        // Check the execution context type
        const contextType = host.getType<GqlContextType>();

        if (contextType === 'http') {
            this.handleRestException(exception, host);
        } else if (contextType === 'graphql') {
            return this.handleGraphQLException(exception, host);
        } else {
            // Handle other context types if needed
            super.catch(exception, host);
        }
    }

    private handleRestException(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        
        const MyResponseObj: MyResponseObj = {
            statusCode: 500,
            timestamp: new Date().toISOString(),
            path: request.url,
            response: 'Internal Server Error'
        }

        if (exception instanceof HttpException) {
            MyResponseObj.statusCode = exception.getStatus();
            MyResponseObj.response = exception.getResponse();
        } else {
            MyResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            MyResponseObj.response = 'Internal Server Error';
        }

        response.status(MyResponseObj.statusCode).json(MyResponseObj);
        this.logger.error(
            `[REST] ${exception instanceof Error ? exception.message : 'Unknown error'} - Stack: ${exception instanceof Error ? exception.stack : 'No stack trace'}`,
            AllExceptionsFilter.name
        );
    }

    private handleGraphQLException(exception: unknown, host: ArgumentsHost) {
        const gqlHost = GqlArgumentsHost.create(host);
        const info = gqlHost.getInfo();
        const context = gqlHost.getContext();

        const ip = context?.req?.socket?.remoteAddress || 
               context?.req?.headers['x-forwarded-for'] || 
               'unknown';

    let errorMessage = 'Internal server error';
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let statusCode = 500;

    console.log('Full Exception:', {
        exception,
        stack: exception instanceof Error ? exception.stack : undefined,
        context: {
            ip,
            path: info?.path?.key
        }
    });

        if (exception instanceof HttpException) {
            errorMessage = exception.message;
            statusCode = exception.getStatus();
            errorCode = `ERROR_${statusCode}`;
        } else if (exception instanceof GraphQLError) {
            errorMessage = exception.message;
            errorCode = exception.extensions?.code as string || 'GRAPHQL_ERROR';
            statusCode = 400;
        } else if (exception instanceof Error) {
            errorMessage = exception.message;
        }

        const errorResponse = {
            message: errorMessage,
            timestamp: new Date().toISOString(),
            path: info?.path?.key || 'unknown',
            statusCode,
        };

        this.logger.error(
            `[GraphQL] ${errorResponse.message} - Path: ${errorResponse.path}`,
            AllExceptionsFilter.name
        );

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