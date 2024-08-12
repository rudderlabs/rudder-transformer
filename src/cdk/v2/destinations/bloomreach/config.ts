import { getMappingConfig } from '../../../../v0/util';

export const CUSTOMER_COMMAND = 'customers';
export const CUSTOMER_EVENT_COMMAND = 'customers/events';
export const MAX_BATCH_SIZE = 50;
export const MAX_PAYLOAD_SIZE = 10000000;
export const MAX_ITEMS = 5000;

// ref:- https://documentation.bloomreach.com/engagement/reference/batch-commands-2
export const getBatchEndpoint = (apiBaseUrl: string, projectToken: string): string =>
  `${apiBaseUrl}/track/v2/projects/${projectToken}/batch`;

// ref:- https://documentation.bloomreach.com/engagement/reference/bulk-update-catalog-item
export const getCreateBulkCatalogItemEndpoint = (
  apiBaseUrl: string,
  projectToken: string,
  catalogId: string,
): string => `${apiBaseUrl}/data/v2/projects/${projectToken}/catalogs/${catalogId}/items`;

// ref:- https://documentation.bloomreach.com/engagement/reference/bulk-partial-update-catalog-item
export const getUpdateBulkCatalogItemEndpoint = (
  apiBaseUrl: string,
  projectToken: string,
  catalogId: string,
): string =>
  `${apiBaseUrl}/data/v2/projects/${projectToken}/catalogs/${catalogId}/items/partial-update`;

// ref:- https://documentation.bloomreach.com/engagement/reference/bulk-delete-catalog-items
export const getDeleteBulkCatalogItemEndpoint = (
  apiBaseUrl: string,
  projectToken: string,
  catalogId: string,
): string =>
  `${apiBaseUrl}/data/v2/projects/${projectToken}/catalogs/${catalogId}/items/bulk-delete`;

export const RecordAction = {
  INSERT: 'insert',
  UPDATE: 'update',
  DELETE: 'delete',
};

const CONFIG_CATEGORIES = {
  CUSTOMER_PROPERTIES_CONFIG: { name: 'BloomreachCustomerPropertiesConfig' },
};
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
export const EXCLUSION_FIELDS: string[] = [
  'email',
  'firstName',
  'firstname',
  'first_name',
  'lastName',
  'lastname',
  'last_name',
  'name',
  'phone',
  'city',
  'birthday',
  'country',
];
export const CUSTOMER_PROPERTIES_CONFIG =
  MAPPING_CONFIG[CONFIG_CATEGORIES.CUSTOMER_PROPERTIES_CONFIG.name];
