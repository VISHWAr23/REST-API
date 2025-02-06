import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GraphqlThrottlerGuard extends ThrottlerGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First check if it's a GraphQL context
    if (context.getType<'graphql' | 'http'>() === 'graphql') {
      return this.handleGraphQLRequest(context);
    }
    // For REST requests, use the parent implementation
    return super.canActivate(context);
  }

  private async handleGraphQLRequest(context: ExecutionContext): Promise<boolean> {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    
    // If no request object exists, allow the request
    if (!ctx.req) {
      return true;
    }

    // Ensure request has headers
    if (!ctx.req.headers) {
      ctx.req.headers = {};
    }

    // Ensure IP address exists
    if (!ctx.req.ip) {
      ctx.req.ip = ctx.req.connection?.remoteAddress || '127.0.0.1';
    }

    return super.canActivate(context);
  }

  getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    
    return { 
      req: {
        ...ctx.req,
        headers: ctx.req?.headers || {},
        ip: ctx.req?.ip || ctx.req?.connection?.remoteAddress || '127.0.0.1'
      },
      res: ctx.res 
    };
  }
}