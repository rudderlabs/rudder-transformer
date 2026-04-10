import { EVENT_TYPES } from '../../util/recordUtils';

export const API_VERSION = '202603';
export const API_PROTOCOL_VERSION = '2.0.0';

export const DESTINATION_TYPE = 'linkedin_audience';

export const ACTION_RECORD_MAP = {
  [EVENT_TYPES.INSERT]: 'ADD',
  [EVENT_TYPES.UPDATE]: 'ADD',
  [EVENT_TYPES.DELETE]: 'REMOVE',
} as const;

export const USER_IDENTIFIER_MAP = {
  sha256Email: 'SHA256_EMAIL',
  sha512Email: 'SHA512_EMAIL',
  googleAid: 'GOOGLE_AID',
} as const;

export const COMPANY_TRAITS = [
  'companyName',
  'organizationUrn',
  'companyWebsiteDomain',
  'companyEmailDomain',
  'companyPageUrl',
];

const BASE_URL = 'https://api.linkedin.com/rest';
export const USER_ENDPOINT = (audienceId: string | number) =>
  `${BASE_URL}/dmpSegments/${audienceId}/users`;
export const USER_ENDPOINT_PATH = '/dmpSegments/<audienceId>/users';
export const COMPANY_ENDPOINT = (audienceId: string | number) =>
  `${BASE_URL}/dmpSegments/${audienceId}/companies`;
export const COMPANY_ENDPOINT_PATH = '/dmpSegments/<audienceId>/companies';

// Maximum batch size (Users, Companies) for LinkedIn Audience API
export const MAX_BATCH_SIZE = process.env.LINKEDIN_AUDIENCE_MAX_BATCH_SIZE
  ? parseInt(process.env.LINKEDIN_AUDIENCE_MAX_BATCH_SIZE, 10)
  : 5000;

export const REMOVE_SPACES_REGEX = /\s/g;
