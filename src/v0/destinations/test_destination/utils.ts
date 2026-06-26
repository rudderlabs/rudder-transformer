// ⚠️ DEV-ONLY TEST FIXTURE — NOT A REAL DESTINATION (INT-6492). See config.ts.
import { defaultRequestConfig } from '../../util';
import { JSON_MIME_TYPE } from '../../util/constant';
import { getV1Endpoint } from './config';
import { TestDestinationProcessorRequest } from './type';

// v1 transform — intentionally minimal (dev-only fixture, no real business logic). Echoes the
// message to the dataCenter-scoped endpoint, authenticating with the v1 restApiKey secret.
export const processV1 = (event: TestDestinationProcessorRequest) => {
  const { message, destination } = event;
  const { restApiKey, dataCenter } = destination.Config;

  const response = defaultRequestConfig();
  response.method = 'POST';
  response.endpoint = getV1Endpoint(dataCenter);
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
    ...(restApiKey && { 'X-Api-Key': restApiKey }),
  };
  response.body.JSON = message as Record<string, unknown>;
  return response;
};
