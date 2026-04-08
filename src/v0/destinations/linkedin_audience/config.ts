import { EVENT_TYPES } from '../../util/recordUtils';

export const API_VERSION = '202509';
export const API_PROTOCOL_VERSION = '2.0.0';

export const ACTION_RECORD_MAP = {
  [EVENT_TYPES.INSERT]: 'ADD',
  [EVENT_TYPES.UPDATE]: 'ADD',
  [EVENT_TYPES.DELETE]: 'REMOVE',
} as const;

export const FIELD_MAP = {
  sha256Email: 'SHA256_EMAIL',
  sha512Email: 'SHA512_EMAIL',
  googleAid: 'GOOGLE_AID',
} as const;

const BASE_URL = 'https://api.linkedin.com/rest';
export const USER_ENDPOINT = (audienceId: string | number) =>
  `${BASE_URL}/dmpSegments/${audienceId}/users`;
export const USER_ENDPOINT_PATH = '/dmpSegments/<audienceId>/users';
export const COMPANY_ENDPOINT = (audienceId: string | number) =>
  `${BASE_URL}/dmpSegments/${audienceId}/companies`;
export const COMPANY_ENDPOINT_PATH = '/dmpSegments/<audienceId>/companies';
