import { getMappingConfig } from '../../../util';

const DATA_MANAGER_HOST = 'datamanager.googleapis.com';
const DATA_MANAGER_BASE_URL = `https://${DATA_MANAGER_HOST}`;
const DATA_MANAGER_INGEST_ENDPOINT_PATH = '/v1/audienceMembers:ingest';
const DATA_MANAGER_INGEST_ENDPOINT = `${DATA_MANAGER_BASE_URL}${DATA_MANAGER_INGEST_ENDPOINT_PATH}`;
const DATA_MANAGER_REMOVE_ENDPOINT_PATH = '/v1/audienceMembers:remove';
const DATA_MANAGER_REMOVE_ENDPOINT = `${DATA_MANAGER_BASE_URL}${DATA_MANAGER_REMOVE_ENDPOINT_PATH}`;
const DATA_MANAGER_DEFAULT_ENCODING = 'HEX';
const DATA_MANAGER_DEFAULT_ACCOUNT_TYPE = 'GOOGLE_ADS';
const DATA_MANAGER_DEFAULT_TOS_STATUS = 'ACCEPTED';
const DATA_MANAGER_BATCH_SIZE = 10000;

/**
 * Account definition name of the dedicated Data Manager OAuth account.
 * When a GARL destination's `deliveryAccount.accountDefinitionName` matches
 * this value, the Data Manager API path is selected. Kept here (rather than
 * inlined) to avoid drift with the same name in rudder-integrations-config
 * and the rudder-auth resolver.
 */
const DM_ACCOUNT_DEFINITION_NAME = 'DESTINATION_GOOGLE_ADWORDS_REMARKETING_LISTS_DMOAUTH';

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
  DATA_MANAGER_HOST,
  DATA_MANAGER_INGEST_ENDPOINT,
  DATA_MANAGER_INGEST_ENDPOINT_PATH,
  DATA_MANAGER_REMOVE_ENDPOINT,
  DATA_MANAGER_REMOVE_ENDPOINT_PATH,
  DATA_MANAGER_DEFAULT_ENCODING,
  DATA_MANAGER_DEFAULT_ACCOUNT_TYPE,
  DATA_MANAGER_DEFAULT_TOS_STATUS,
  DATA_MANAGER_BATCH_SIZE,
  DM_ACCOUNT_DEFINITION_NAME,
  dmUserIdentifierMapping,
};
