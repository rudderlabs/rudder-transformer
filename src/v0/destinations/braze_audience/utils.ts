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

export const buildBulkBody = (
  attributes: BrazeAudienceAttributePayload[],
): { attributes: BrazeAudienceAttributePayload[] } => ({ attributes });

/**
 * Trim and require a non-empty external_id.
 * Accept only string/number — do not coerce objects/arrays/booleans (e.g. "[object Object]").
 */
export const normalizeExternalId = (raw: unknown): string | null => {
  if (typeof raw !== 'string' && typeof raw !== 'number') return null;
  // Reject non-finite numbers (NaN / ±Infinity) — String(NaN) is "NaN", not a real id.
  if (typeof raw === 'number' && !Number.isFinite(raw)) return null;
  const value = String(raw).trim();
  return value.length > 0 ? value : null;
};
