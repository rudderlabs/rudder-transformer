import { defaultRequestConfig, removeUndefinedValues } from '../../../util';
import { RudderMessage } from '../../../../types';
import { validateConfigFields } from '../util';
import { buildEnvelope, buildRequestMeta } from './util';
import { CustomerIODestination, CustomerIOV2Payload, CustomerIOV2ProcessorOutput } from './types';

export const processV2 = (event: {
  message: RudderMessage;
  destination: CustomerIODestination;
}): CustomerIOV2ProcessorOutput => {
  const { message, destination } = event;
  validateConfigFields(destination);
  const envelope = buildEnvelope(message, destination);
  const { endpoint, endpointPath, method, headers } = buildRequestMeta(destination);
  const response = defaultRequestConfig() as unknown as CustomerIOV2ProcessorOutput;
  response.endpoint = endpoint;
  response.endpointPath = endpointPath;
  response.method = method;
  response.headers = headers;
  response.body.JSON = { batch: [removeUndefinedValues(envelope) as CustomerIOV2Payload] };
  response.statusCode = 200;
  return response;
};
