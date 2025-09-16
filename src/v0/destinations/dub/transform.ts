import { ConfigurationError, InstrumentationError } from '@rudderstack/integrations-lib';
import {
  simpleProcessRouterDest,
  defaultRequestConfig,
  defaultPostRequestConfig,
  getHashFromArray,
} from '../../util';
import { RudderMessage } from '../../../types';

import { DubIORouterRequest } from './types';
import { LEAD_ENDPOINT, SALES_ENDPOINT } from './config';
import { createHeader, buildLeadPayload, buildSalePayload } from './utils';

const processLeadEvent = (message: RudderMessage, apiKey: string) => {
  // Handle lead event transformation logic using type-safe helper
  const payload = buildLeadPayload(message);

  const response = defaultRequestConfig();
  response.endpoint = LEAD_ENDPOINT;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = createHeader(apiKey);
  response.body.JSON = payload;
  return response;
};

const processSaleEvent = (message: RudderMessage, apiKey: string) => {
  // Handle sale event transformation logic using type-safe helper
  const payload = buildSalePayload(message);

  const response = defaultRequestConfig();
  response.endpoint = SALES_ENDPOINT;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = createHeader(apiKey);
  response.body.JSON = payload;
  return response;
};

const processEvent = (event: DubIORouterRequest) => {
  const { message, destination } = event;
  const { eventMapping, apiKey } = destination.Config;
  if (!message.event) {
    throw new InstrumentationError('Event name is not present. Aborting message.');
  }

  const mappedEvent = getHashFromArray(eventMapping);
  switch (mappedEvent[message.event.toLowerCase()]) {
    case 'LEAD_CONVERSION':
      return processLeadEvent(message, apiKey);
    case 'SALES_CONVERSION':
      return processSaleEvent(message, apiKey);
    default:
      throw new ConfigurationError(
        `Event "${message.event}" is not mapped to any DUB event type. Aborting message.`,
      );
  }
};

const process = (event: DubIORouterRequest) => {
  // Transform the incoming event data to match the DUB API specifications
  const { message, destination } = event;
  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }

  if (!destination.Config.apiKey) {
    throw new ConfigurationError('API Key not found');
  }

  if (message.type === 'track') {
    return processEvent(event);
  }

  throw new InstrumentationError(`Event type "${message.type}" is  not supported`);
};

const processRouterDest = async (
  inputs: DubIORouterRequest[],
  reqMetadata: Record<string, unknown>,
) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata, {});
  return respList;
};

export { process, processRouterDest };
