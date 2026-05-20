import {
  ConfigurationError,
  InstrumentationError,
  formatZodError,
} from '@rudderstack/integrations-lib';
import { BatchUtils } from '@rudderstack/workflow-engine';
import { Metadata, RecordAction } from '../../../types/rudderEvents';
import { BASE_URL_MAP, MAX_BATCH_SIZE, SUBSCRIBE_PATH, UNSUBSCRIBE_PATH } from './config';
import {
  IterableAudienceBatchResponse,
  IterableAudienceConnection,
  IterableAudienceConnectionConfigSchema,
  IterableAudienceDestination,
  IterableAudienceDestinationConfigSchema,
  IterableAudienceMessageSchema,
  IterableAudienceRouterRequest,
  IterableSubscriber,
  RespList,
} from './type';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PRINTABLE_ASCII_REGEX = /^[\x20-\x7E]+$/;

const getHeaders = (destination: IterableAudienceDestination): Record<string, string> => ({
  'Content-Type': 'application/json',
  'Api-Key': destination.Config.apiKey,
});

const getBaseEndpoint = (destination: IterableAudienceDestination): string =>
  `${BASE_URL_MAP[destination.Config.dataCenter]}`;

const getListId = (connection: IterableAudienceConnection): string | number =>
  connection.config.destination.audienceId;

const getMappedIdentifier = (connection: IterableAudienceConnection): 'email' | 'userId' =>
  connection.config.destination.identifierMappings[0].to;

const assertEmail = (value: unknown): string => {
  const email = String(value || '').trim().toLowerCase();
  if (!email || !EMAIL_REGEX.test(email)) {
    throw new InstrumentationError('A valid email identifier is required');
  }
  return email;
};

const assertUserId = (value: unknown): string => {
  const userId = String(value || '').trim();
  if (!userId || !PRINTABLE_ASCII_REGEX.test(userId)) {
    throw new InstrumentationError('A printable ASCII userId identifier is required');
  }
  return userId;
};

export const buildSubscriber = (
  event: IterableAudienceRouterRequest,
  mappedIdentifier: 'email' | 'userId',
): IterableSubscriber => {
  const { projectType } = event.connection.config.destination;
  const identifiers = event.message.identifiers || {};

  if (projectType === 'email') {
    return { email: assertEmail(identifiers.email) };
  }

  if (projectType === 'userId') {
    return { userId: assertUserId(identifiers.userId) };
  }

  // Hybrid
  if (mappedIdentifier === 'userId') {
    return { userId: assertUserId(identifiers.userId) };
  }

  return { email: assertEmail(identifiers.email) };
};

export const createEventChunk = (event: IterableAudienceRouterRequest): RespList & { eventAction: RecordAction } => {
  const destinationValidation = IterableAudienceDestinationConfigSchema.safeParse(event.destination.Config);
  if (!destinationValidation.success) {
    throw new ConfigurationError(formatZodError(destinationValidation.error));
  }

  const connectionValidation = IterableAudienceConnectionConfigSchema.safeParse(
    event.connection?.config.destination,
  );
  if (!connectionValidation.success) {
    throw new ConfigurationError(formatZodError(connectionValidation.error));
  }

  const messageValidation = IterableAudienceMessageSchema.safeParse(event.message);
  if (!messageValidation.success) {
    throw new InstrumentationError(formatZodError(messageValidation.error));
  }

  const mappedIdentifier = getMappedIdentifier(event.connection);
  const payload = buildSubscriber(event, mappedIdentifier);
  const eventAction = (event.message.action || RecordAction.INSERT).toString().toUpperCase() as RecordAction;

  return {
    payload,
    metadata: event.metadata,
    eventAction,
  };
};

const buildBatches = (
  rows: RespList[],
  endpoint: string,
  destination: IterableAudienceDestination,
  connection: IterableAudienceConnection,
  isUnsubscribe: boolean,
): IterableAudienceBatchResponse[] => {
  if (!rows.length) {
    return [];
  }

  const chunks = BatchUtils.chunkArrayBySizeAndLength(rows, { maxItems: MAX_BATCH_SIZE });

  return chunks.items.map((chunk) => ({
    batchedRequest: {
      version: '1',
      type: 'REST',
      method: 'POST',
      endpoint,
      headers: getHeaders(destination),
      params: {},
      body: {
        JSON: {
          listId: getListId(connection),
          subscribers: chunk.map((row) => row.payload),
          ...(isUnsubscribe ? { campaignId: null, channelUnsubscribe: false } : {}),
        },
        JSON_ARRAY: {},
        XML: {},
        FORM: {},
      },
      files: {},
    },
    metadata: chunk.map((row) => row.metadata as Partial<Metadata>),
    batched: true,
    statusCode: 200,
    destination,
  }));
};

export const batchResponseBuilder = (
  upsertRows: RespList[],
  deleteRows: RespList[],
  destination: IterableAudienceDestination,
  connection: IterableAudienceConnection,
): IterableAudienceBatchResponse[] => {
  const base = getBaseEndpoint(destination);
  const unsubscribeEndpoint = `${base}/${UNSUBSCRIBE_PATH}`;
  const subscribeEndpoint = `${base}/${SUBSCRIBE_PATH}`;

  // Mirror-safe ordering: unsubscribe batches before subscribe batches.
  return [
    ...buildBatches(deleteRows, unsubscribeEndpoint, destination, connection, true),
    ...buildBatches(upsertRows, subscribeEndpoint, destination, connection, false),
  ];
};
