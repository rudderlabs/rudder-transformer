import { getMappingConfig } from '../../../util';

const DATA_MANAGER_BASE_URL = 'https://datamanager.googleapis.com/v1';
const DATA_MANAGER_INGEST_ENDPOINT = `${DATA_MANAGER_BASE_URL}/audienceMembers:ingest`;
const DATA_MANAGER_REMOVE_ENDPOINT = `${DATA_MANAGER_BASE_URL}/audienceMembers:remove`;
const DATA_MANAGER_DEFAULT_ENCODING = 'HEX';
const DATA_MANAGER_DEFAULT_ACCOUNT_TYPE = 'GOOGLE_ADS';
const DATA_MANAGER_DEFAULT_TOS_STATUS = 'ACCEPTED';
const DATA_MANAGER_BATCH_SIZE = 10000;

const DM_CONFIG_CATEGORIES = {
  USER_IDENTIFIER: { type: 'userIdentifier', name: 'userIdentifier' },
};

const DM_MAPPING_CONFIG = getMappingConfig(DM_CONFIG_CATEGORIES, __dirname);

/**
 * Maps processed field names (email, phone, firstName, lastName, country, postalCode)
 * to the DM API UserIdentifier structure via constructPayload.
 */
const dmUserIdentifierMapping = DM_MAPPING_CONFIG[DM_CONFIG_CATEGORIES.USER_IDENTIFIER.name];

export {
  DATA_MANAGER_INGEST_ENDPOINT,
  DATA_MANAGER_REMOVE_ENDPOINT,
  DATA_MANAGER_DEFAULT_ENCODING,
  DATA_MANAGER_DEFAULT_ACCOUNT_TYPE,
  DATA_MANAGER_DEFAULT_TOS_STATUS,
  DATA_MANAGER_BATCH_SIZE,
  dmUserIdentifierMapping,
};
