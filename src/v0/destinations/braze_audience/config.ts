import { RecordAction } from '../../../types/rudderEvents';

/**
 * Which Braze endpoint an account syncs through. `bulk` needs Braze's limited-beta
 * `users.track.bulk` permission; `standard` works on every workspace. An account saved before the
 * option existed has no value and keeps syncing through bulk.
 */
export const TRACK_ENDPOINTS = ['standard', 'bulk'] as const;
export type TrackEndpoint = (typeof TRACK_ENDPOINTS)[number];
export const DEFAULT_TRACK_ENDPOINT: TrackEndpoint = 'bulk';

export const BULK_TRACK_PATH = '/users/track/bulk';
export const STANDARD_TRACK_PATH = '/users/track';

// Ref: https://www.braze.com/docs/api/endpoints/user_data/post_user_track_bulk/
export const BULK_MAX_BATCH_SIZE = 1000;

/** Braze `/users/track/bulk` documented ~2 MB cap; leave headroom for JSON overhead. */
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

// /users/track batch cap; shared with the event-stream braze destination so the two cannot drift.
export { TRACK_BRAZE_MAX_REQ_COUNT as STANDARD_MAX_BATCH_SIZE } from '../braze/config';
