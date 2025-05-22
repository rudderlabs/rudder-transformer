import {
  base64Convertor,
  ConfigurationError,
  formatZodError,
  InstrumentationError,
} from '@rudderstack/integrations-lib';
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
  CustomerIOBatchResponse,
  CustomerIOConnectionConfigSchema,
  CustomerIOMessageSchema,
  ProcessedEvent,
} from './type';
import { Metadata, RecordAction } from '../../../types/rudderEvents';

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

const getMergedMetadata = (batch: RespList[]): Partial<Metadata>[] =>
  batch.map((input) => input.metadata);

const buildBatchedResponse = (
  payload: SegmentationPayload,
  endpoint: string,
  headers: SegmentationHeaders,
  params: SegmentationParam,
  metadata: Partial<Metadata>[],
  destination: CustomerIODestination,
): CustomerIOBatchResponse => ({
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
): CustomerIOBatchResponse[] => {
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

export const batchResponseBuilder = (
  insertOrUpdateRespList: RespList[],
  deleteRespList: RespList[],
  destination: CustomerIODestination,
  connection: CustomerIOConnection,
): CustomerIOBatchResponse[] => {
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

const getEventAction = (event: CustomerIORouterRequest): RecordAction =>
  event.message.action as RecordAction;

const validateEvent = (event: CustomerIORouterRequest): boolean => {
  const { message, connection } = event;

  const connectionValidation = CustomerIOConnectionConfigSchema.safeParse(
    connection?.config.destination,
  );

  if (!connectionValidation.success) {
    throw new ConfigurationError(formatZodError(connectionValidation.error));
  }
  const messageValidation = CustomerIOMessageSchema.safeParse(message);

  if (!messageValidation.success) {
    throw new InstrumentationError(formatZodError(messageValidation.error));
  }

  return true;
};

export const createEventChunk = (event: CustomerIORouterRequest): ProcessedEvent => {
  validateEvent(event);
  const eventAction = getEventAction(event);
  const id = Object.values(event.message.identifiers)[0];

  return {
    payload: { ids: [id] },
    metadata: event.metadata,
    eventAction,
  };
};
