import { ConfigurationError, InstrumentationError } from '@rudderstack/integrations-lib';
import {
  simpleProcessRouterDest,
  defaultRequestConfig,
  defaultPostRequestConfig,
  getHashFromArray,
} from '../../util';
import { RudderMessage } from '../../../types';

import { DubIORouterRequest, DubIODestinationConfig } from './types';
import { LEAD_ENDPOINT, SALES_ENDPOINT, LEAD_ENDPOINT_PATH, SALES_ENDPOINT_PATH } from './config';
import { createHeader, buildLeadPayload, buildSalePayload } from './utils';

const processLeadEvent = (message: RudderMessage, destinationConfig: DubIODestinationConfig) => {
  // Handle lead event transformation logic using type-safe helper
  const { apiKey } = destinationConfig;
  const payload = buildLeadPayload(message);

  const response = defaultRequestConfig();
  response.endpoint = LEAD_ENDPOINT;
  response.endpointPath = LEAD_ENDPOINT_PATH;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = createHeader(apiKey);
  response.body.JSON = payload;
  return response;
};

const processSaleEvent = (message: RudderMessage, destinationConfig: DubIODestinationConfig) => {
  // Handle sale event transformation logic using type-safe helper
  const { apiKey, convertAmountToCents } = destinationConfig;
  const payload = buildSalePayload(message, convertAmountToCents);

  const response = defaultRequestConfig();
  response.endpoint = SALES_ENDPOINT;
  response.endpointPath = SALES_ENDPOINT_PATH;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = createHeader(apiKey);
  response.body.JSON = payload;
  return response;
};

const processEvent = (event: DubIORouterRequest) => {
  const { message, destination } = event;
  const { eventMapping } = destination.Config;
  if (!message.event) {
    throw new InstrumentationError('Event name is not present. Aborting message.');
  }

  const mappedEvent = getHashFromArray(eventMapping);
  switch (mappedEvent[message.event.toLowerCase()]) {
    case 'LEAD_CONVERSION':
      return processLeadEvent(message, destination.Config);
    case 'SALES_CONVERSION':
      return processSaleEvent(message, destination.Config);
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
