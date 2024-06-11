import { InstrumentationError, RudderStackEvent } from '@rudderstack/integrations-lib';
import { ProcessorTransformationRequest } from '../../../types';
import { handleCustomMappings } from './customMappingsHandler';
import { process as ga4Process } from '../ga4/transform';
import { basicConfigvalidaiton } from '../ga4/utils';

export function process(event: ProcessorTransformationRequest) {
  const { message, destination } = event;
  const { Config } = destination;

  const eventPayload = message as RudderStackEvent;

  if (!eventPayload.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }

  if (eventPayload.type !== 'track') {
    return ga4Process(event);
  }

  basicConfigvalidaiton(Config);

  // custom mappings flow
  return handleCustomMappings(message, Config);
}
