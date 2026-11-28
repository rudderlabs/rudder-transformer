import identifyMapping from './data/ZDIdentifyConfig.json';
import groupMapping from './data/ZDGroupConfig.json';

export const BASE_PATH = '/api/v2/';
export const USER_FIELDS = 'user_fields';
export const ORGANIZATION_FIELDS = 'organization_fields';
// Keep custom-field exclusions aligned with the legacy transformer during gradual rollout.
// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require,import/extensions
export const FIELD_DEFAULTS = require('./config.js').defaultFields as Record<string, string[]>;

export const MAPPINGS = { identify: identifyMapping, group: groupMapping };
// The legacy module remains authoritative for marketplace headers on both routes.
// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require,import/extensions
export const MARKETPLACE_HEADERS = require('./config.js').DEFAULT_HEADERS as Record<string, string>;

export const OAUTH_ACCOUNT_DEFINITION = 'DESTINATION_ZENDESK_OAUTH_AUTH_CODE';
