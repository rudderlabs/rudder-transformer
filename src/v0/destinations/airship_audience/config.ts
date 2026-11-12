import { RecordAction } from '../../../types/rudderEvents';
import { BASE_URL_EU, BASE_URL_US } from '../airship/config';

export const DATA_CENTERS = ['US', 'EU'] as const;
type DataCenter = (typeof DATA_CENTERS)[number];

/** The only Airship endpoint this destination calls; also its static metrics label. */
export const ENDPOINT_PATH = '/api/named_users/tags';

const BASE_URLS: Record<DataCenter, string> = { US: BASE_URL_US, EU: BASE_URL_EU };

export const tagsEndpoint = (dataCenter: DataCenter): string =>
  `${BASE_URLS[dataCenter]}${ENDPOINT_PATH}`;

/** Airship's documented cap per call (live, it accepted 1,001: the cap is ours). */
export const MAX_NAMED_USERS = 1000;

// Live 2026-10-29: a 129-character ID gets 400 40003 "Named user id … is greater than 128 characters".
export const MAX_NAMED_USER_ID_LENGTH = 128;

export const ACCEPT_HEADER = 'application/vnd.urbanairship+json; version=3';

export type TagOperation = 'add' | 'remove';

/** insert/update add the tag; delete removes it. Named users are never created or deleted. */
export const ACTION_OPERATION: Record<RecordAction, TagOperation> = {
  [RecordAction.INSERT]: 'add',
  [RecordAction.UPDATE]: 'add',
  [RecordAction.DELETE]: 'remove',
};

export const REASONS = {
  noNamedUserId: 'No named user ID mapped',
  invalidNamedUserId: 'Invalid named user ID',
  missingApiKey: 'Airship API key is missing',
  missingTagGroup: 'Airship tag group is missing',
} as const;
