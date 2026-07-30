import { getEndpointFromConfig } from '../braze/util';
import { BULK_TRACK_PATH } from './config';
import type { BrazeAudienceAttributePayload } from './types';

export const getBulkTrackEndpoint = (
  dataCenter: string,
): { endpoint: string; endpointPath: string } => {
  const base = getEndpointFromConfig({
    Config: { dataCenter },
  } as Parameters<typeof getEndpointFromConfig>[0]);
  return {
    endpoint: `${base}${BULK_TRACK_PATH}`,
    endpointPath: BULK_TRACK_PATH,
  };
};

/**
 * Permanent Braze `/users/track` identity error `type` values.
 * Docs list uppercase enums; live `/users/track/bulk` often returns human
 * messages (e.g. "'external_id' must be fewer than 988 bytes") instead.
 */
const ABORTED_IDENTITY_TYPES = new Set([
  'BLACKLISTED_EXTERNAL_USER_ID',
  'EXTERNAL_USER_ID_TOO_LARGE',
]);

/**
 * Whether a Braze partial-failure `type` names a permanent identity problem, which no retry can
 * fix. Shared by the legacy network handler and the batching-framework delivery path so the two
 * cannot classify the same response differently while both are live.
 */
export const isIdentityAborted = (type?: string): boolean => {
  if (!type) return false;
  if (ABORTED_IDENTITY_TYPES.has(type)) return true;
  // Live Braze message forms for permanent identity failures (not retryable).
  return (
    /external_user_id_too_large|blacklisted_external_user_id/i.test(type) ||
    /external_id.*(?:fewer|bytes|too\s*large|blacklist)/i.test(type) ||
    /blacklist(?:ed)?.*external_id/i.test(type)
  );
};

export const buildBulkBody = (
  attributes: BrazeAudienceAttributePayload[],
): { attributes: BrazeAudienceAttributePayload[] } => ({ attributes });

/**
 * Trim and require a non-empty external_id.
 * Wire shape is already `string | number` at Zod; this rejects empty / non-finite.
 */
export const normalizeExternalId = (raw: string | number | undefined): string | null => {
  if (raw === undefined) return null;
  // Reject non-finite numbers (NaN / ±Infinity) — String(NaN) is "NaN", not a real id.
  if (typeof raw === 'number' && !Number.isFinite(raw)) return null;
  const value = String(raw).trim();
  return value.length > 0 ? value : null;
};
