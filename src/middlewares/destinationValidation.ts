import { Context, Next } from 'koa';
import { isValidDestination } from '../constants/destinationCanonicalNames';

const invalidDestinationResponse = (ctx: Context, destination: string) => {
  ctx.status = 400;
  ctx.body = { error: `Invalid destination: ${destination}` };
};

const validateDestination = (ctx: Context, destination: unknown): boolean => {
  if (typeof destination === 'string' && isValidDestination(destination)) {
    return true;
  }
  invalidDestinationResponse(ctx, String(destination));
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
    if (!validateDestination(ctx, body?.destType)) {
      return;
    }
    await next();
  }

  public static async userDeletionBody(ctx: Context, next: Next) {
    const requests = ctx.request.body;
    const invalidRequest = Array.isArray(requests)
      ? requests.find((request) => !isValidDestination(request?.destType))
      : undefined;
    const destination =
      invalidRequest?.destType ?? (Array.isArray(requests) ? requests[0]?.destType : undefined);
    if (!validateDestination(ctx, destination)) {
      return;
    }
    await next();
  }
}
