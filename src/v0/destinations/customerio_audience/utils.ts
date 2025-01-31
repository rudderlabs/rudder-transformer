import { base64Convertor } from '@rudderstack/integrations-lib';
import { BatchUtils } from '@rudderstack/workflow-engine';
import { BASE_ENDPOINT, MAX_ITEMS } from './config';
import {
  ConnectionStructure,
  DestinationStructure,
  EventStructure,
  RespList,
  SegmentationHeadersType,
  SegmentationParamType,
  SegmentationPayloadType,
} from './type';

// return identifiers id type it can be 'id' or 'cio_id' or 'email'
function getIdType(connection: ConnectionStructure) {
  return connection?.config?.destination?.identifierMappings[0]?.to || 'id';
}

// returns build and return the final batched response
const buildBatchedResponse = (
  payload: SegmentationPayloadType,
  endpoint: string,
  headers: SegmentationHeadersType,
  params: SegmentationParamType,
  metadata: Record<string, unknown>[],
  destination: DestinationStructure,
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

// returns action of record event
const getEventAction = (event: EventStructure) => event?.message?.action?.toLowerCase() || '';

// returns segment id
function getSegmentId(connection: ConnectionStructure) {
  return connection?.config?.destination?.audienceId || '';
}

// returns the merged payload
// e.g. [{payload: {ids: [id1]}, metadata: m1},{payload: {ids: [id2]}, metadata: m2},{payload: {ids: [id3]}, metadata: m3}...]
// returns [ids: [id1,id2,id3]]
function getMergedPayload(batch: any[]) {
  const mergedIds = batch.flatMap((input) => input.payload.ids);
  return { ids: mergedIds };
}

// return merged metadata
// e.g. [{payload: p1, metadata: m1},{payload: p2, metadata: m2},{payload: p3, metadata: m3}...]
// returns [{m1},{m2},{m3},....]
const getMergedMetadata = (batch: any[]) => batch.map((input) => input.metadata);

// return headers for segmentation process
function getHeaders(destination: DestinationStructure): SegmentationHeadersType {
  return {
    'Content-Type': 'application/json',
    Authorization: `Basic ${base64Convertor(`${destination.Config.siteId}:${destination.Config.apiKey}`)}`,
  };
}

// return params for segmentation process
function getParams(connection: ConnectionStructure): SegmentationParamType {
  return {
    id_type: getIdType(connection),
  };
}

// return final batched response for insert/update flow
function insertOrUpdateBatchResponseBuilder(
  insertOrUpdateRespList: RespList[],
  destination: DestinationStructure,
  connection: ConnectionStructure,
) {
  const insertOrUpdateBatchResponse: any[] = [];
  const endpoint = `${BASE_ENDPOINT}/${getSegmentId(connection)}/add_customers`;
  const headers: SegmentationHeadersType = getHeaders(destination);
  const params: SegmentationParamType = getParams(connection);
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

// return final batched response for delete flow
function deleteBatchResponseBuilder(
  deleteRespList: RespList[],
  destination: DestinationStructure,
  connection: ConnectionStructure,
) {
  const deleteBatchResponse: any[] = [];
  const endpoint = `${BASE_ENDPOINT}/${getSegmentId(connection)}/remove_customers`;
  const headers: SegmentationHeadersType = getHeaders(destination);
  const params: SegmentationParamType = getParams(connection);
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

module.exports = {
  batchResponseBuilder,
  getEventAction,
};
