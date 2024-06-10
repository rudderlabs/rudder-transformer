import {
  ConfigurationError,
  InstrumentationError,
  RudderStackEvent,
} from '@rudderstack/integrations-lib';
import { ProcessorTransformationRequest } from '../../../types';
import { handleCustomMappings } from './customMappingsHandler';

export function process(event: ProcessorTransformationRequest) {
  const { message, destination } = event;
  const { Config } = destination;

  if (!Config.typesOfClient) {
    throw new ConfigurationError('Client type not found. Aborting ');
  }
  if (!Config.apiSecret) {
    throw new ConfigurationError('API Secret not found. Aborting ');
  }
  if (Config.typesOfClient === 'gtag' && !Config.measurementId) {
    throw new ConfigurationError('measurementId must be provided. Aborting');
  }
  if (Config.typesOfClient === 'firebase' && !Config.firebaseAppId) {
    throw new ConfigurationError('firebaseAppId must be provided. Aborting');
  }

  const eventPayload = message as RudderStackEvent;

  if (!eventPayload.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }

  // custom mappings flow
  return handleCustomMappings(message, Config);
}
