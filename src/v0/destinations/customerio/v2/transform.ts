import get from 'get-value';
import {
  defaultRequestConfig,
  removeUndefinedValues,
  addExternalIdToTraits,
  adduserIdFromExternalId,
} from '../../../util';
import { MappedToDestinationKey } from '../../../../constants';
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
  // For RETL/warehouse sources (mappedToDestination), derive userId from
  // context.externalId and fold externalId into traits, mirroring the v1 path.
  const mappedToDestination = get(message, MappedToDestinationKey);
  if (mappedToDestination) {
    addExternalIdToTraits(message);
    adduserIdFromExternalId(message);
  }
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
