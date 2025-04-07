import { Context, Next } from 'koa';
import { PlatformError } from '@rudderstack/integrations-lib';
import { RouterTransformationRequest, RouterCompactedTransformationRequest } from '../types';

/**
 * Middleware to transform a compacted payload for destination transformations
 * to its decompacted form, as it is expected by the destination transformers.
 * Compacted payloads are used to reduce the size of the payload by removing
 * connection and destination details from each input and instead providing them
 * in separate lookup tables.
 */
export async function RouterTransformCompactedPayloadV1Middleware(
  ctx: Context,
  next: Next,
): Promise<void> {
  if (ctx.get('x-content-format') === 'json+compactedv1') {
    const body = ctx.request.body as RouterCompactedTransformationRequest;
    ctx.request.body = {
      input: body.input.map((input) => {
        const destination = body.destinations[input.metadata.destinationId];
        if (!destination) {
          throw new PlatformError(
            `no destination found for id ${input.metadata.destinationId}`,
            500,
          );
        }
        const connectionKey = `${input.metadata.sourceId}:${input.metadata.destinationId}`;
        const connection = body.connections[connectionKey];
        if (!connection) {
          throw new PlatformError(`no connection found for id ${connectionKey}`, 500);
        }
        return {
          ...input,
          connection,
          destination,
        };
      }),
      destType: body.destType,
    } as RouterTransformationRequest;
  }
  await next();
}
