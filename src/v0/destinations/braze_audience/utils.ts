import { getEndpointFromConfig } from '../braze/util';
import {
  DEFAULT_TRACK_ENDPOINT,
  TRACK_ENDPOINT_SPECS,
  TRACK_ENDPOINTS,
  type TrackEndpoint,
  type TrackEndpointSpec,
} from './config';
import type { BrazeAudienceAttributePayload } from './types';

const isTrackEndpoint = (value: unknown): value is TrackEndpoint =>
  (TRACK_ENDPOINTS as readonly unknown[]).includes(value);

/**
 * The endpoint spec for an account's `trackEndpoint`. Absent means bulk (accounts saved before the
 * option existed). An unknown value also resolves to the default here, because the integration is
 * built before input validation runs; validation then rejects every record of that destination.
 */
export const getTrackEndpointSpec = (trackEndpoint: unknown): TrackEndpointSpec =>
  TRACK_ENDPOINT_SPECS[isTrackEndpoint(trackEndpoint) ? trackEndpoint : DEFAULT_TRACK_ENDPOINT];

export const getTrackUrl = (dataCenter: string, spec: TrackEndpointSpec): string => {
  const base = getEndpointFromConfig({
    Config: { dataCenter },
  } as Parameters<typeof getEndpointFromConfig>[0]);
  return `${base}${spec.path}`;
};

/**
 * Permanent Braze `/users/track` identity error `type` values.
 * Docs list uppercase enums; live Braze responses often return human
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

export const buildTrackBody = (
  attributes: BrazeAudienceAttributePayload[],
  { partner }: TrackEndpointSpec,
): { partner?: string; attributes: BrazeAudienceAttributePayload[] } =>
  partner ? { partner, attributes } : { attributes };

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
