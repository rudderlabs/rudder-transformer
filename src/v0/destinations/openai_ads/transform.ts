import { InstrumentationError } from '@rudderstack/integrations-lib';
import { defaultRequestConfig } from '../../util';
import { JSON_MIME_TYPE } from '../../util/constant';
import { ENDPOINT, ENDPOINT_PATH } from './config';
import type { OpenAIAdsProcessorRequest } from './types';
import { buildOpenAIEvent, resolveAccountConfig } from './utils';

const processEvent = (event: OpenAIAdsProcessorRequest) => {
  const { apiKey, pixelId } = resolveAccountConfig(event.destination);
  const response = defaultRequestConfig();
  response.endpoint = ENDPOINT;
  response.endpointPath = ENDPOINT_PATH;
  response.method = 'POST';
  response.headers = { Authorization: `Bearer ${apiKey}`, 'Content-Type': JSON_MIME_TYPE };
  response.params = { pid: pixelId };
  response.body.JSON = { events: [buildOpenAIEvent(event.message, event.destination.Config)] };
  return response;
};

const process = (event: OpenAIAdsProcessorRequest) => {
  if (!['track', 'page', 'screen'].includes(event.message?.type)) {
    throw new InstrumentationError(`Event type ${event.message?.type} is not supported`);
  }
  return processEvent(event);
};

export { process, processEvent };
