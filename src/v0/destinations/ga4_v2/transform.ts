import {
  InstrumentationError,
  isDefinedAndNotNull,
  RudderStackEvent,
} from '@rudderstack/integrations-lib';
import { ProcessorTransformationRequest } from '../../../types';
import { handleCustomMappings } from './customMappingsHandler';
import { processEvents as ga4Process } from '../ga4/transform';
import { basicConfigvalidaiton } from '../ga4/utils';

export function process(event: ProcessorTransformationRequest) {
  const { message, destination } = event;
  const { Config } = destination;
  if (isDefinedAndNotNull(Config.configData)) {
    const configDetails = JSON.parse(Config.configData);
    Config.propertyId = configDetails.PROPERTY;
    Config.typesOfClient = configDetails.DATA_STREAM.type;
    if (Config.typesOfClient === 'gtag') {
      Config.measurementId = configDetails.DATA_STREAM.value;
    } else if (Config.typesOfClient === 'firebase') {
      Config.firebaseAppId = configDetails.DATA_STREAM.value;
    }
    Config.apiSecret = configDetails.MEASUREMENT_PROTOCOL_SECRET;
  }

  const eventPayload = message as RudderStackEvent;

  if (!eventPayload.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }

  if (eventPayload.type !== 'track') {
    return ga4Process({ event, destType: 'ga4_v2' });
  }

  basicConfigvalidaiton(Config);

  // custom mappings flow
  return handleCustomMappings(message, Config);
}
