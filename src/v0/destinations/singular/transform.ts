import { InstrumentationError } from '@rudderstack/integrations-lib';
import { defaultRequestConfig, defaultGetRequestConfig, simpleProcessRouterDest } from '../../util';

import { PARTNER_OBJECT } from './config';
import type {
  SingularMessage,
  SingularDestination,
  SingularRouterRequest,
  SingularBatchRequest,
  SingularProcessorRequest,
} from './types';

import {
  platformWisePayloadGenerator,
  generateRevenuePayloadArray,
  isSessionEvent,
  getEndpoint,
} from './util';

const responseBuilderSimple = (
  message: SingularMessage,
  { Config }: SingularDestination,
): SingularBatchRequest | SingularBatchRequest[] => {
  const eventName = message.event;

  if (!eventName) {
    throw new InstrumentationError('Event name is not present for the event');
  }

  const sessionEvent = isSessionEvent(Config, eventName);
  const payload = platformWisePayloadGenerator(message, sessionEvent, Config);
  const endpoint = getEndpoint(message, sessionEvent);

  // If we have an event where we have an array of Products, example Order Completed
  // We will convert the event to revenue events
  if (!sessionEvent && Array.isArray(message?.properties?.products)) {
    return generateRevenuePayloadArray(message.properties.products, payload, Config, endpoint);
  }

  // Build params with API key
  const params = { ...payload, a: Config.apiKey, ...PARTNER_OBJECT };

  const response: SingularBatchRequest = {
    ...defaultRequestConfig(),
    endpoint,
    params,
    method: defaultGetRequestConfig.requestMethod,
  };

  return response;
};

const processEvent = (
  message: SingularMessage,
  destination: SingularDestination,
): SingularBatchRequest | SingularBatchRequest[] => {
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }
  const messageType = message.type.toLowerCase();

  if (messageType === 'track') {
    return responseBuilderSimple(message, destination);
  }

  throw new InstrumentationError(`Event type ${messageType} is not supported`);
};

const process = (event: SingularProcessorRequest) => processEvent(event.message, event.destination);

const processRouterDest = async (
  inputs: SingularRouterRequest[],
  reqMetadata: Record<string, unknown>,
) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata, {});
  return respList;
};

export { process, processRouterDest };
