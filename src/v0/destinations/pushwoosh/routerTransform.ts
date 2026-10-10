import { z } from 'zod';
import {
  ChunkBatchStrategy,
  DestinationIntegration,
  makeRouterInputSchema,
  type BatchStrategy,
  type TransformedEvent,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import { JSON_MIME_TYPE } from '../../util/constant';
import {
  EVENTS_ENDPOINT,
  EVENTS_ENDPOINT_PATH,
  MAX_BATCH_SIZE,
  SET_TAGS_ENDPOINT,
  SET_TAGS_ENDPOINT_PATH,
} from './config';
import { pushwooshDelivery } from './delivery';
import {
  PushwooshDestinationConfigSchema,
  PushwooshMessageSchema,
  type PushwooshDestinationConfig,
  type PushwooshMessage,
  type PushwooshMessageType,
  type PushwooshPayload,
} from './types';
import { buildPushwooshEvent, buildSetTagsBody } from './utils';

const pushwooshInputSchema = makeRouterInputSchema({
  destinationConfig: PushwooshDestinationConfigSchema,
  message: PushwooshMessageSchema,
});

type MessageHandler = (
  message: PushwooshMessage,
  config: PushwooshDestinationConfig,
) => TransformedEvent<PushwooshPayload>;

const authHeaders = ({ apiToken }: PushwooshDestinationConfig) => ({
  Authorization: `Token ${apiToken}`,
  'Content-Type': JSON_MIME_TYPE,
});

const MESSAGE_HANDLERS: Record<PushwooshMessageType, MessageHandler> = {
  track: (message, config) => ({
    body: buildPushwooshEvent(message, config),
    endpoint: EVENTS_ENDPOINT,
    endpointPath: EVENTS_ENDPOINT_PATH,
    method: 'POST',
    headers: { ...authHeaders(config), 'X-PW-Appcode': config.appCode },
  }),
  identify: (message, config) => ({
    body: buildSetTagsBody(message, config),
    endpoint: SET_TAGS_ENDPOINT,
    endpointPath: SET_TAGS_ENDPOINT_PATH,
    method: 'POST',
    headers: authHeaders(config),
  }),
};

class PushwooshIntegration extends DestinationIntegration<
  PushwooshPayload,
  typeof pushwooshInputSchema
> {
  static readonly delivery = pushwooshDelivery;

  transformEvent(input: z.infer<typeof pushwooshInputSchema>): TransformedEvent<PushwooshPayload> {
    const { message } = input;
    return MESSAGE_HANDLERS[message.type](message, this.destination.Config);
  }

  getBatchStrategy(endpoint: string): BatchStrategy<PushwooshPayload> {
    if (endpoint === EVENTS_ENDPOINT) {
      return new ChunkBatchStrategy<PushwooshPayload>({
        maxItems: MAX_BATCH_SIZE,
        wrapBody: (bodies) => ({ events: bodies }),
      });
    }
    // setTags addresses a single user per request.
    return new ChunkBatchStrategy<PushwooshPayload>({
      maxItems: 1,
      wrapBody: ([body]) => body,
    });
  }

  getInputSchema() {
    return pushwooshInputSchema;
  }
}

export const Integration = PushwooshIntegration;
