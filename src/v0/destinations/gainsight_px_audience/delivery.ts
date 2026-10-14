/**
 * Delivery for GAINSIGHT_PX_AUDIENCE: one job per request (ChunkBatchStrategy maxItems 1).
 *
 * The framework's classification stands (2xx success, 429 throttled, 5xx retry, other 4xx abort).
 * Two things differ:
 *  - 404 on a request that wrote `false` is a success: a user PX does not know is already not a
 *    member. A 404 on `true` aborts, since users are never created.
 *  - failure reasons are static per status, so neither PX response text (it echoes
 *    `rejectedValue`) nor the identifyId reaches the reason.
 */
import { ConfigurationError } from '@rudderstack/integrations-lib';
import {
  success,
  type DeliveryContext,
  type DeliverySpec,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import { API_KEY_HEADER, REASONS } from './config';

const ATTRIBUTE_MISSING_MARKER = 'does not exist or not enabled';

/** The boolean this request wrote; undefined when the body cannot be read as one. */
const sentValue = (ctx: DeliveryContext): boolean | undefined => {
  const json = ctx.request.body?.JSON as { customAttributes?: Record<string, unknown> } | undefined;
  const values = json?.customAttributes ? Object.values(json.customAttributes) : [];
  return typeof values[0] === 'boolean' ? values[0] : undefined;
};

const mentionsMissingAttribute = (response: unknown): boolean => {
  if (typeof response === 'string') return response.includes(ATTRIBUTE_MISSING_MARKER);
  try {
    return (JSON.stringify(response) ?? '').includes(ATTRIBUTE_MISSING_MARKER);
  } catch {
    return false;
  }
};

export const failureReason = ({ status, response }: DeliveryContext): string => {
  if (status === 400) {
    return mentionsMissingAttribute(response) ? REASONS.attributeMissing : REASONS.badRequest;
  }
  if (status === 401) return REASONS.unauthorized;
  if (status === 403) return REASONS.forbidden;
  if (status === 404) return REASONS.userNotFound;
  if (status === 429) return REASONS.throttled;
  if (status >= 500) return REASONS.serverError(status);
  return REASONS.otherClientError(status);
};

export const gainsightPxAudienceDelivery: DeliverySpec = {
  statusOverrides: {
    404: (ctx, fallback) => (sentValue(ctx) === false ? success() : fallback()),
  },
  failureReason,
  // The key is added for the call only and never persisted on the job or shown in Live Events.
  prepareRequest: (request, ctx) => {
    const raw = ctx.destinationConfig.apiKey;
    const apiKey = typeof raw === 'string' ? raw.trim() : '';
    if (!apiKey) throw new ConfigurationError(REASONS.missingApiKey);
    return { ...request, headers: { ...request.headers, [API_KEY_HEADER]: apiKey } };
  },
};
