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

const getIdType = (connection: ConnectionStructure): string =>
  connection.config.destination.identifierMappings[0]?.to || 'id';

const getSegmentId = (connection: ConnectionStructure): string | number =>
  connection.config.destination.audienceId;

const getHeaders = (destination: DestinationStructure): SegmentationHeadersType => ({
  'Content-Type': 'application/json',
  Authorization: `Basic ${base64Convertor(`${destination.Config.siteId}:${destination.Config.apiKey}`)}`,
});

const getParams = (connection: ConnectionStructure): SegmentationParamType => ({
  id_type: getIdType(connection),
});

const getMergedPayload = (batch: RespList[]): SegmentationPayloadType => ({
  ids: batch.flatMap((input) => input.payload.ids),
});

const getMergedMetadata = (batch: RespList[]): Record<string, unknown>[] =>
  batch.map((input) => input.metadata);

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

const processBatch = (
  respList: RespList[],
  endpoint: string,
  destination: DestinationStructure,
  connection: ConnectionStructure,
): any[] => {
  if (!respList?.length) {
    return [];
  }

  const headers = getHeaders(destination);
  const params = getParams(connection);
  const batches = BatchUtils.chunkArrayBySizeAndLength(respList, { maxItems: MAX_ITEMS });

  return batches.items.map((batch) => {
    const mergedPayload = getMergedPayload(batch);
    const mergedMetadata = getMergedMetadata(batch);
    return buildBatchedResponse(
      mergedPayload,
      endpoint,
      headers,
      params,
      mergedMetadata,
      destination,
    );
  });
};

const batchResponseBuilder = (
  insertOrUpdateRespList: RespList[],
  deleteRespList: RespList[],
  destination: DestinationStructure,
  connection: ConnectionStructure,
): any[] => {
  const segmentId = getSegmentId(connection);

  const insertResponses = processBatch(
    insertOrUpdateRespList,
    `${BASE_ENDPOINT}/${segmentId}/add_customers`,
    destination,
    connection,
  );

  const deleteResponses = processBatch(
    deleteRespList,
    `${BASE_ENDPOINT}/${segmentId}/remove_customers`,
    destination,
    connection,
  );

  return [...insertResponses, ...deleteResponses];
};

const getEventAction = (event: EventStructure): string =>
  event?.message?.action?.toLowerCase() || '';

export { batchResponseBuilder, getEventAction };
