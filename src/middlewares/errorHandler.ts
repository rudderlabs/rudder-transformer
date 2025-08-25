import { Middleware } from 'koa';
import logger from '../logger';

/**
 * Determines if an error should be ignored (not logged)
 * @param error - The error to check
 * @returns true if the error should be ignored, false otherwise
 */
function shouldIgnoreError(error: unknown): boolean {
  return error instanceof Error && error.constructor.name === 'BadRequestError';
}

/**
 * Error handling middleware that captures any errors thrown in the middleware stack
 * and logs them using the logger.
 *
 * This middleware should be placed early in the middleware stack to catch errors
 * from all subsequent middleware and route handlers.
 *
 * @returns A middleware function that catches and logs errors
 */
export function errorHandlerMiddleware(): Middleware {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error: unknown) {
      if (shouldIgnoreError(error)) {
        logger.debug('Ignoring aborted request error', {
          error: error instanceof Error ? error.message : String(error),
        });
        // Set appropriate response for aborted requests
        ctx.status = 400;
        ctx.body = { error: 'Request aborted' };
        return;
      }

      // Log the error with context information
      logger.error('Unhandled error in middleware stack', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        url: ctx.url,
        method: ctx.method,
        status: ctx.status,
        userAgent: ctx.get('User-Agent'),
        ip: ctx.ip,
        requestId: ctx.get('X-Request-ID'),
      });

      // Set appropriate error response
      ctx.status = error instanceof Error && (error as any).status ? (error as any).status : 500;
      // Determine error message based on environment
      let errorMessage: string;
      if (process.env.NODE_ENV === 'production') {
        errorMessage = 'An unexpected error occurred';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = String(error);
      }

      ctx.body = {
        error: 'Internal Server Error',
        message: errorMessage,
      };

      // Emit the error so other error handlers can process it
      ctx.app.emit('error', error, ctx);
    }
  };
}
