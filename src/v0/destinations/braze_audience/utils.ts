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

/** Trim and require a non-empty external_id (sources already key identifiers by destination field). */
export const normalizeExternalId = (raw: unknown): string | null => {
  if (raw === null || raw === undefined) return null;
  const value = String(raw).trim();
  return value.length > 0 ? value : null;
};
