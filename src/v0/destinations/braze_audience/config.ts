import { RecordAction } from '../../../types/rudderEvents';
import { BRAZE_PARTNER_NAME, TRACK_BRAZE_MAX_REQ_COUNT } from '../braze/config';

/**
 * Which Braze endpoint an account syncs through. `bulk` needs Braze's limited-beta
 * `users.track.bulk` permission; `standard` works on every workspace. An account saved before the
 * option existed has no value and keeps syncing through bulk.
 */
export const TRACK_ENDPOINTS = ['standard', 'bulk'] as const;
export type TrackEndpoint = (typeof TRACK_ENDPOINTS)[number];
export const DEFAULT_TRACK_ENDPOINT: TrackEndpoint = 'bulk';

export type TrackEndpointSpec = {
  path: string;
  /** Records per request. */
  maxItems: number;
  /** Sent as the body's `partner` field when set. */
  partner?: string;
};

/** Everything that differs between the two endpoints; the rest of the destination reads it from here. */
export const TRACK_ENDPOINT_SPECS: Record<TrackEndpoint, TrackEndpointSpec> = {
  // Ref: https://www.braze.com/docs/api/endpoints/user_data/post_user_track/
  // 75 per request and the `partner` field, shared with the event-stream braze destination.
  standard: {
    path: '/users/track',
    maxItems: TRACK_BRAZE_MAX_REQ_COUNT,
    partner: BRAZE_PARTNER_NAME,
  },
  // Ref: https://www.braze.com/docs/api/endpoints/user_data/post_user_track_bulk/
  // Its published schema lists no `partner` field, so bulk bodies go without one.
  bulk: { path: '/users/track/bulk', maxItems: 1000 },
};

/**
 * Byte cap per request on both endpoints. Sized for bulk's documented ~2 MB limit with headroom for
 * JSON overhead; a Standard batch (75 records) never comes near it, its limit is `maxItems`.
 */
export const MAX_PAYLOAD_SIZE = '1.8mb';

export const DATA_CENTERS = [
  'US-01',
  'US-02',
  'US-03',
  'US-04',
  'US-05',
  'US-06',
  'US-07',
  'US-08',
  'EU-01',
  'EU-02',
  'EU-03',
  'AU-01',
] as const;

export type DataCenter = (typeof DATA_CENTERS)[number];

/** INSERT/UPDATE → membership true; DELETE → false (keep key queryable). */
export const ACTION_ATTR_VALUE: Record<RecordAction, boolean> = {
  [RecordAction.INSERT]: true,
  [RecordAction.UPDATE]: true,
  [RecordAction.DELETE]: false,
};
