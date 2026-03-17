import { EVENT_TYPES } from '../../util/recordUtils';

export const ACTION_MAP: Record<string, string> = {
  add: 'add',
  remove: 'delete',
};

export const ACTION_RECORD_MAP: Record<string, string> = {
  [EVENT_TYPES.INSERT]: 'add',
  [EVENT_TYPES.UPDATE]: 'add',
  [EVENT_TYPES.DELETE]: 'delete',
};

export const DESTINATION_TYPE = 'tiktok_audience';

export const SHA256_TRAITS = ['IDFA_SHA256', 'AAID_SHA256', 'EMAIL_SHA256', 'PHONE_SHA256'];
export const MD5_TRAITS = ['IDFA_MD5', 'AAID_MD5'];

export const BASE_URL = 'https://business-api.tiktok.com/open_api/v1.3';
export const ENDPOINT_PATH = '/segment/mapping/';
export const ENDPOINT = `${BASE_URL}${ENDPOINT_PATH}`;

export const REMOVE_SPACES_REGEX = /\s/g;

/**
 * Whether to reject invalid field values (e.g., malformed emails, invalid country codes) for TikTok Audience
 * by replacing them with empty strings. When disabled, invalid values are passed through as-is.
 *
 * Controlled via env var: TIKTOK_AUDIENCE_REJECT_INVALID_FIELDS=true
 * Default: false
 */
export function isRejectInvalidFieldsEnabled(): boolean {
  return process.env.TIKTOK_AUDIENCE_REJECT_INVALID_FIELDS === 'true';
}
