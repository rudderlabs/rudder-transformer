import { Context, Next } from 'koa';
import logger from '../logger';
import { isSafeDestinationName, isValidDestination } from '../features';

const rejectInvalidDestination = (ctx: Context, destination: unknown) => {
  ctx.status = 400;
  ctx.body = { error: `Invalid destination: ${String(destination)}` };
};

const validateDestination = (ctx: Context, destination: unknown): boolean => {
  if (isValidDestination(destination)) {
    return true;
  }
  if (!isSafeDestinationName(destination)) {
    rejectInvalidDestination(ctx, destination);
    return false;
  }
  if (process.env.REJECT_UNKNOWN_DESTINATIONS === 'true') {
    rejectInvalidDestination(ctx, destination);
    return false;
  }
  logger.warn(`Unknown destination encountered: ${String(destination)}`);
  return true;
};

const rejectMalformedUserDeletionPayload = (ctx: Context) => {
  ctx.status = 400;
  ctx.body = { error: 'Malformed deleteUsers payload: expected a non-empty array' };
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
    if (!Array.isArray(requests) || requests.length === 0) {
      rejectMalformedUserDeletionPayload(ctx);
      return;
    }

    const userDeletionRequests = requests as Array<{ destType?: unknown } | null | undefined>;
    for (const request of userDeletionRequests) {
      if (!validateDestination(ctx, request?.destType)) {
        return;
      }
    }
    await next();
  }
}
