import { base64Convertor } from '@rudderstack/integrations-lib';
import { BatchUtils } from '@rudderstack/workflow-engine';
import { BASE_ENDPOINT, MAX_ITEMS } from './config';
import { ConnectionStructure, DestinationStructure, EventStructure, RespList } from './type';

const buildBatchedResponse = (
  payload: any,
  endpoint: string,
  headers: any,
  params: any,
  metadata: any,
  destination: any,
) => ({
  batchedRequest: {
    body: {
      JSON: payload,
      JSON_ARRAY: {},
      XML: {},
      FORM: {},
    },
    version: '1',
    type: 'REST',
    method: 'POST',
    endpoint,
    headers,
    params,
    files: {},
  },
  metadata,
  batched: true,
  statusCode: 200,
  destination,
});

const getEventAction = (event: EventStructure) => event?.message?.action?.toLowerCase() || '';

function getSegmentId(connection: ConnectionStructure) {
  return connection?.config?.destination?.audienceId || '';
}

function getIdType(connection: ConnectionStructure) {
  return connection?.config?.destination?.identifierMappings[0]?.to || 'id';
}

function getMergedPayload(batch: any[]) {
  const mergedIds = batch.flatMap((input) => input.payload.ids);
  return { ids: mergedIds };
}

const getMergedMetadata = (batch: any[]) => batch.map((input) => input.metadata);

function getHeaders(destination: any) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Basic ${base64Convertor(`${destination.Config.siteId}:${destination.Config.apiKey}`)}`,
  };
}

function getParams(connection: ConnectionStructure) {
  return {
    id_type: getIdType(connection),
  };
}

function insertOrUpdateBatchResponseBuilder(
  insertOrUpdateRespList: RespList[],
  destination: DestinationStructure,
  connection: ConnectionStructure,
) {
  const insertOrUpdateBatchResponse: any[] = [];
  const endpoint = `${BASE_ENDPOINT}/${getSegmentId(connection)}/add_customers`;
  const headers = getHeaders(destination);
  const params = getParams(connection);
  const batches = BatchUtils.chunkArrayBySizeAndLength(insertOrUpdateRespList, {
    maxItems: MAX_ITEMS,
  });
  batches.items.forEach((batch) => {
    const mergedPayload = getMergedPayload(batch);
    const mergedMetadata = getMergedMetadata(batch);
    insertOrUpdateBatchResponse.push(
      buildBatchedResponse(mergedPayload, endpoint, headers, params, mergedMetadata, destination),
    );
  });
  return insertOrUpdateBatchResponse;
}

function deleteBatchResponseBuilder(
  deleteRespList: RespList[],
  destination: DestinationStructure,
  connection: ConnectionStructure,
) {
  const deleteBatchResponse: any[] = [];
  const endpoint = `${BASE_ENDPOINT}/${getSegmentId(connection)}/remove_customers`;
  const headers = getHeaders(destination);
  const params = getParams(connection);
  const batches = BatchUtils.chunkArrayBySizeAndLength(deleteRespList, {
    maxItems: MAX_ITEMS,
  });
  batches.items.forEach((batch) => {
    const mergedPayload = getMergedPayload(batch);
    const mergedMetadata = getMergedMetadata(batch);
    deleteBatchResponse.push(
      buildBatchedResponse(mergedPayload, endpoint, headers, params, mergedMetadata, destination),
    );
  });
  return deleteBatchResponse;
}

// returns final batched response
const batchResponseBuilder = (
  insertOrUpdateRespList: RespList[],
  deleteRespList: RespList[],
  destination: DestinationStructure,
  connection: ConnectionStructure,
) => {
  const response: any[] = [];
  if (insertOrUpdateRespList.length > 0) {
    response.push(
      ...insertOrUpdateBatchResponseBuilder(insertOrUpdateRespList, destination, connection),
    );
  }
  if (deleteRespList.length > 0) {
    response.push(...deleteBatchResponseBuilder(deleteRespList, destination, connection));
  }
  return response;
};

module.exports = { batchResponseBuilder, getEventAction };
