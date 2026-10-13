import { RecordAction } from '../../../types/rudderEvents';
import { getBaseEndpoint } from '../gainsight_px/config';

export const DESTINATION_TYPE = 'GAINSIGHT_PX_AUDIENCE';

export const DATA_CENTERS = ['US', 'EU', 'US2'] as const;
export type DataCenter = (typeof DATA_CENTERS)[number];

/** Static: the identifyId travels in the body, never in the URL or metric labels. */
export const ENDPOINT_PATH = '/v1/users/update';
const USERS_UPDATE_PATH = '/users/update';

export const API_KEY_HEADER = 'X-APTRINSIC-API-KEY';

export const ATTRIBUTE_NAME_PATTERN = /^\w{1,200}$/;

/** INSERT/UPDATE → member (true); DELETE → left (false). Users are never created or deleted. */
export const ACTION_ATTR_VALUE: Record<RecordAction, boolean> = {
  [RecordAction.INSERT]: true,
  [RecordAction.UPDATE]: true,
  [RecordAction.DELETE]: false,
};

export const usersUpdateEndpoint = (dataCenter: DataCenter): string =>
  `${getBaseEndpoint({ dataCenter })}${USERS_UPDATE_PATH}`;

/** Static reasons only: never an identifyId, never PX response text (it echoes rejectedValue). */
export const REASONS = {
  userNotFound: 'Gainsight PX user not found',
  attributeMissing: 'Gainsight PX attribute is missing or disabled',
  badRequest: 'Gainsight PX rejected the request (400)',
  unauthorized: 'Gainsight PX rejected the API key or data center',
  forbidden: 'Gainsight PX API key lacks Write permission',
  throttled: 'Gainsight PX rate limit exceeded',
  otherClientError: (status: number) => `Gainsight PX rejected the request (${status})`,
  serverError: (status: number) => `Gainsight PX server error (${status})`,
  noIdentifyId: 'No identifyId mapped',
  invalidIdentifyId: 'Invalid identifyId',
  missingApiKey: 'Gainsight PX API key is missing',
} as const;
