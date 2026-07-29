import { RecordAction } from '../../../types/rudderEvents';

export const MAX_BATCH_SIZE = 1000;
/** Braze `/users/track/bulk` documented ~2 MB cap; leave headroom for JSON overhead. */
export const MAX_PAYLOAD_SIZE = '1.8mb';

export const BULK_TRACK_PATH = '/users/track/bulk';

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
