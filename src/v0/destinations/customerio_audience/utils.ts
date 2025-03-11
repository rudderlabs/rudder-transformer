import { base64Convertor } from '@rudderstack/integrations-lib';
import { BatchUtils } from '@rudderstack/workflow-engine';
import { BASE_ENDPOINT, DEFAULT_ID_TYPE, MAX_ITEMS } from './config';
import {
  CustomerIOConnection,
  CustomerIODestination,
  CustomerIORouterRequest,
  RespList,
  SegmentationHeaders,
  SegmentationParam,
  SegmentationPayload,
} from './type';
import { Metadata } from '../../../types';

const getIdType = (connection: CustomerIOConnection): string =>
  connection.config.destination.identifierMappings[0]?.to || DEFAULT_ID_TYPE;

const getSegmentId = (connection: CustomerIOConnection): string | number =>
  connection.config.destination.audienceId;

const getHeaders = (destination: CustomerIODestination): SegmentationHeaders => ({
  'Content-Type': 'application/json',
  Authorization: `Basic ${base64Convertor(`${destination.Config.siteId}:${destination.Config.apiKey}`)}`,
});

const getParams = (connection: CustomerIOConnection): SegmentationParam => ({
  id_type: getIdType(connection),
});

const getMergedPayload = (batch: RespList[]): SegmentationPayload => ({
  ids: batch.flatMap((input) => input.payload.ids),
});

const getMergedMetadata = (batch: RespList[]): Metadata[] => batch.map((input) => input.metadata);

const buildBatchedResponse = (
  payload: SegmentationPayload,
  endpoint: string,
  headers: SegmentationHeaders,
  params: SegmentationParam,
  metadata: Metadata[],
  destination: CustomerIODestination,
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
  destination: CustomerIODestination,
  connection: CustomerIOConnection,
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
  destination: CustomerIODestination,
  connection: CustomerIOConnection,
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

const getEventAction = (event: CustomerIORouterRequest): string => {
  const { message } = event;
  const action = (message as { action?: string }).action || '';
  return action;
};

export { batchResponseBuilder, getEventAction };
