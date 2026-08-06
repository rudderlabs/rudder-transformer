import { formatZodError } from '@rudderstack/integrations-lib';
import { Context, Middleware } from 'koa';
import { ZodType } from 'zod';
import logger from '../logger';

type ResponsePayloadSelector = (ctx: Context) => unknown;

type ResponseSchemaValidationOptions = {
  endpoint: string;
  schema: ZodType;
  selectPayload?: ResponsePayloadSelector;
};

export const responseSchemaValidationMiddleware =
  ({
    endpoint,
    schema,
    selectPayload = (ctx) => ctx.body,
  }: ResponseSchemaValidationOptions): Middleware =>
  async (ctx, next) => {
    await next();

    const payload = selectPayload(ctx);
    const validationResult = schema.safeParse(payload);
    if (validationResult.success) {
      return;
    }

    const formattedError = formatZodError(validationResult.error);
    logger.error('Response schema validation failed', {
      endpoint,
      error: formattedError,
      status: ctx.status,
    });

    const error = new Error(`Response schema validation failed for ${endpoint}: ${formattedError}`);
    (error as Error & { status: number }).status = 500;
    throw error;
  };
