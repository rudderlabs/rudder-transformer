export const MAX_PAYLOAD_SIZE = 10000000;
export const MAX_ITEMS = 5000;

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

export const CatalogAction = {
  INSERT: 'insert',
  UPDATE: 'update',
  DELETE: 'delete',
};
