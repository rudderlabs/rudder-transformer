/**
 * Delivery for GAINSIGHT_PX_AUDIENCE: one job per request (ChunkBatchStrategy maxItems 1).
 *
 * The framework's classification stands (2xx success, 429 throttled, 5xx retry, other 4xx abort).
 * Two things differ:
 *  - 404 on a leave (exactly one key, `false`) is a success: a user PX does not know is already not a
 *    member. A 404 on any request that is not a leave (exactly one key whose value is false)
 *    aborts, since users are never created.
 *  - the failure reason is PX's own message from the response body.
 */
import {
  success,
  type DeliveryContext,
  type DeliverySpec,
} from '../../../services/destination/destinationIntegration/destinationIntegration';

type PxErrorBody = {
  message?: unknown;
  externalapierror?: { subErrors?: { message?: unknown }[] };
};

/**
 * A leave writes exactly one attribute, the flag, with `false` (trait-mappings D24). A member write
 * carries `true` plus any traits; every other shape, including an unreadable body, is not a
 * leave, so its 404 takes the framework fallback (abort).
 */
export const isLeave = (ctx: DeliveryContext): boolean => {
  const json = ctx.request.body?.JSON as { customAttributes?: unknown } | undefined;
  const attributes = json?.customAttributes;
  if (attributes === null || typeof attributes !== 'object' || Array.isArray(attributes)) {
    return false;
  }
  const values = Object.values(attributes);
  return values.length === 1 && values[0] === false;
};

/**
 * PX's error text: `externalapierror.subErrors[].message` (400 validation) joined, else the
 * top-level `message` (401/403/404/429/5xx), else a static fallback naming the status.
 */
export const extractPxErrorMessage = (response: unknown, status: number): string => {
  const body = (response && typeof response === 'object' ? response : {}) as PxErrorBody;
  const subErrors = body.externalapierror?.subErrors;
  const subMessages = Array.isArray(subErrors)
    ? subErrors.map((e) => e?.message).filter((m): m is string => typeof m === 'string' && !!m)
    : [];
  if (subMessages.length > 0) return subMessages.join('; ');
  if (typeof body.message === 'string' && body.message) return body.message;
  return `Gainsight PX request failed with status ${status}`;
};

export const gainsightPxAudienceDelivery: DeliverySpec = {
  statusOverrides: {
    404: (ctx, fallback) => (isLeave(ctx) ? success() : fallback()),
  },
  failureReason: ({ response, status }) => extractPxErrorMessage(response, status),
};
