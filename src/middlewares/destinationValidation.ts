import { Context, Next } from 'koa';
import { isValidDestination } from '../features';
import logger from '../logger';

const validateDestination = (ctx: Context, destination: unknown): boolean => {
  if (isValidDestination(destination)) {
    return true;
  }
  logger.error(`Unknown destination encountered: ${String(destination)}`);
  ctx.status = 404;
  ctx.body = { error: `Unknown destination: ${String(destination)}` };
  return false;
};

export class DestinationValidationMiddleware {
  public static async pathParam(ctx: Context, next: Next) {
    if (!validateDestination(ctx, ctx.params.destination)) {
      return;
    }
    await next();
  }

  public static async bodyDestType(ctx: Context, next: Next) {
    const body = ctx.request.body as { destType?: unknown };
    if (body?.destType === undefined) {
      await next();
      return;
    }
    if (!validateDestination(ctx, body?.destType)) {
      return;
    }
    await next();
  }

  public static async userDeletionBody(ctx: Context, next: Next) {
    const requests = ctx.request.body;
    const userDeletionRequests = Array.isArray(requests)
      ? (requests as Array<{ destType?: unknown } | null | undefined>)
      : [];
    for (const request of userDeletionRequests) {
      if (!validateDestination(ctx, request?.destType)) {
        return;
      }
    }
    await next();
  }
}
