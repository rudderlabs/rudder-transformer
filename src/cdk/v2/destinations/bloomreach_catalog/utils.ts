import { BatchUtils } from '@rudderstack/workflow-engine';
import { base64Convertor } from '@rudderstack/integrations-lib';
import {
  getCreateBulkCatalogItemEndpoint,
  getDeleteBulkCatalogItemEndpoint,
  getUpdateBulkCatalogItemEndpoint,
  MAX_ITEMS,
  MAX_PAYLOAD_SIZE,
} from './config';

const buildBatchedRequest = (
  payload: string,
  method: string,
  endpoint: string,
  headers: any,
  metadata: any,
  destination: any,
) => ({
  batchedRequest: {
    body: {
      JSON: {},
      JSON_ARRAY: { batch: payload },
      XML: {},
      FORM: {},
    },
    version: '1',
    type: 'REST',
    method,
    endpoint,
    headers,
    params: {},
    files: {},
  },
  metadata,
  batched: true,
  statusCode: 200,
  destination,
});

const getHeaders = (destination: any) => ({
  'Content-Type': 'application/json',
  Authorization: `Basic ${base64Convertor(`${destination.Config.apiKey}:${destination.Config.apiSecret}`)}`,
});

// returns merged metadata for a batch
const getMergedMetadata = (batch: any[]) => batch.map((input) => input.metadata);

// returns merged payload for a batch
const getMergedEvents = (batch: any[]) => batch.map((input) => input.payload);

// builds final batched response for insert action records
const insertItemBatchResponseBuilder = (insertItemRespList: any[], destination: any) => {
  const insertItemBatchedResponse: any[] = [];

  const method = 'PUT';
  const endpoint = getCreateBulkCatalogItemEndpoint(
    destination.Config.apiBaseUrl,
    destination.Config.projectToken,
    destination.Config.catalogID,
  );
  const headers = getHeaders(destination);

  const batchesOfEvents = BatchUtils.chunkArrayBySizeAndLength(insertItemRespList, {
    maxSizeInBytes: MAX_PAYLOAD_SIZE,
    maxItems: MAX_ITEMS,
  });
  batchesOfEvents.items.forEach((batch: any) => {
    const mergedPayload = JSON.stringify(getMergedEvents(batch));
    const mergedMetadata = getMergedMetadata(batch);
    insertItemBatchedResponse.push(
      buildBatchedRequest(mergedPayload, method, endpoint, headers, mergedMetadata, destination),
    );
  });
  return insertItemBatchedResponse;
};

// builds final batched response for update action records
const updateItemBatchResponseBuilder = (updateItemRespList: any[], destination: any) => {
  const updateItemBatchedResponse: any[] = [];

  const method = 'POST';
  const endpoint = getUpdateBulkCatalogItemEndpoint(
    destination.Config.apiBaseUrl,
    destination.Config.projectToken,
    destination.Config.catalogID,
  );
  const headers = getHeaders(destination);

  const batchesOfEvents = BatchUtils.chunkArrayBySizeAndLength(updateItemRespList, {
    maxSizeInBytes: MAX_PAYLOAD_SIZE,
    maxItems: MAX_ITEMS,
  });
  batchesOfEvents.items.forEach((batch: any) => {
    const mergedPayload = JSON.stringify(getMergedEvents(batch));
    const mergedMetadata = getMergedMetadata(batch);
    updateItemBatchedResponse.push(
      buildBatchedRequest(mergedPayload, method, endpoint, headers, mergedMetadata, destination),
    );
  });
  return updateItemBatchedResponse;
};

// builds final batched response for delete action records
const deleteItemBatchResponseBuilder = (deleteItemRespList: any[], destination: any) => {
  const deleteItemBatchedResponse: any[] = [];

  const method = 'DELETE';
  const endpoint = getDeleteBulkCatalogItemEndpoint(
    destination.Config.apiBaseUrl,
    destination.Config.projectToken,
    destination.Config.catalogID,
  );
  const headers = getHeaders(destination);

  const batchesOfEvents = BatchUtils.chunkArrayBySizeAndLength(deleteItemRespList, {
    maxSizeInBytes: MAX_PAYLOAD_SIZE,
    maxItems: MAX_ITEMS,
  });
  batchesOfEvents.items.forEach((batch: any) => {
    const mergedPayload = JSON.stringify(getMergedEvents(batch));
    const mergedMetadata = getMergedMetadata(batch);
    deleteItemBatchedResponse.push(
      buildBatchedRequest(mergedPayload, method, endpoint, headers, mergedMetadata, destination),
    );
  });
  return deleteItemBatchedResponse;
};

// returns final batched response
export const batchResponseBuilder = (
  insertItemRespList: any,
  updateItemRespList: any,
  deleteItemRespList: any,
  destination: any,
) => {
  const response: any[] = [];
  if (insertItemRespList.length > 0) {
    response.push(...insertItemBatchResponseBuilder(insertItemRespList, destination));
  }
  if (updateItemRespList.length > 0) {
    response.push(...updateItemBatchResponseBuilder(updateItemRespList, destination));
  }
  if (deleteItemRespList.length > 0) {
    response.push(...deleteItemBatchResponseBuilder(deleteItemRespList, destination));
  }
  return response;
};
