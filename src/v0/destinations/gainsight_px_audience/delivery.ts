/**
 * Delivery for GAINSIGHT_PX_AUDIENCE: one job per request (ChunkBatchStrategy maxItems 1).
 *
 * The framework's classification stands (2xx success, 429 throttled, 5xx retry, other 4xx abort).
 * Two things differ:
 *  - 404 on a request that wrote `false` is a success: a user PX does not know is already not a
 *    member. A 404 on `true` aborts, since users are never created.
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

/** The boolean this request wrote; undefined when the body cannot be read as one. */
const sentValue = (ctx: DeliveryContext): boolean | undefined => {
  const json = ctx.request.body?.JSON as { customAttributes?: Record<string, unknown> } | undefined;
  const values = json?.customAttributes ? Object.values(json.customAttributes) : [];
  return typeof values[0] === 'boolean' ? values[0] : undefined;
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
    404: (ctx, fallback) => (sentValue(ctx) === false ? success() : fallback()),
  },
  failureReason: ({ response, status }) => extractPxErrorMessage(response, status),
};
