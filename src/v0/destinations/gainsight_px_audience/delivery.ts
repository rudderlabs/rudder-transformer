/**
 * Delivery for GAINSIGHT_PX_AUDIENCE: one job per request (ChunkBatchStrategy maxItems 1).
 *
 * Every non-2xx verdict is returned per item, never as a uniform verdict: a uniform non-2xx verdict
 * takes the framework's throw path, which copies the PX body (it echoes `rejectedValue`) into
 * reporting and lets rudder-server's isJobTerminated abort any 4xx — including a 429 we want
 * throttled. Per item, an abort reaches rudder-server as 400, a retry as 500, throttled as 429,
 * each with a static reason.
 */
import { ConfigurationError } from '@rudderstack/integrations-lib';
import {
  abort,
  perItem,
  retry,
  success,
  throttled,
  type DeliveryContext,
  type DeliverySpec,
  type ItemVerdict,
  type StatusOverrideMap,
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

export const verdictFor = (ctx: DeliveryContext): ItemVerdict => {
  const { status, response } = ctx;
  if (status >= 200 && status < 300) return success();
  // A user PX does not know is not a member: leaving succeeds, joining fails visibly and replays.
  if (status === 404) return sentValue(ctx) === false ? success() : abort(REASONS.userNotFound);
  if (status === 400) {
    return mentionsMissingAttribute(response)
      ? abort(REASONS.attributeMissing)
      : abort(REASONS.badRequest);
  }
  if (status === 401) return abort(REASONS.unauthorized);
  if (status === 403) return abort(REASONS.forbidden);
  if (status === 429) return throttled(REASONS.throttled);
  if (status >= 500) return retry(REASONS.serverError(status));
  return abort(REASONS.otherClientError(status));
};

const perJob = (ctx: DeliveryContext) => perItem(ctx.jobs.map(() => verdictFor(ctx)));

const statusOverrides: StatusOverrideMap = {
  '4xx': perJob,
  '5xx': perJob,
};

export const gainsightPxAudienceDelivery: DeliverySpec = {
  statusOverrides,
  // The key is added for the call only and never persisted on the job or shown in Live Events.
  prepareRequest: (request, ctx) => {
    const raw = ctx.destinationConfig.apiKey;
    const apiKey = typeof raw === 'string' ? raw.trim() : '';
    if (!apiKey) throw new ConfigurationError(REASONS.missingApiKey);
    return { ...request, headers: { ...request.headers, [API_KEY_HEADER]: apiKey } };
  },
};
