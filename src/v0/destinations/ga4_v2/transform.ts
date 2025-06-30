import { InstrumentationError, isDefinedAndNotNull } from '@rudderstack/integrations-lib';
import { ProcessorTransformationRequest } from '../../../types';
import { handleCustomMappings } from './customMappingsHandler';
import { processEvents as ga4Process } from '../ga4/transform';
import { basicConfigvalidaiton } from '../ga4/utils';

export function process(event: ProcessorTransformationRequest) {
  const { message, destination } = event;
  const { Config } = destination;

  // Create an enhanced config object instead of mutating the original
  let enhancedConfig = Config;
  if (isDefinedAndNotNull(Config.configData)) {
    if (typeof Config.configData !== 'string') {
      throw new InstrumentationError('Config data is not a string');
    }
    const configDetails = JSON.parse(Config.configData);

    // Create a new config object with parsed properties instead of mutating the original
    enhancedConfig = {
      ...Config,
      propertyId: configDetails.PROPERTY,
      typesOfClient: configDetails.DATA_STREAM.type,
      apiSecret: configDetails.MEASUREMENT_PROTOCOL_SECRET,
      ...(configDetails.DATA_STREAM.type === 'gtag' && {
        measurementId: configDetails.DATA_STREAM.value,
      }),
      ...(configDetails.DATA_STREAM.type === 'firebase' && {
        firebaseAppId: configDetails.DATA_STREAM.value,
      }),
    };
  }

  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }

  if (message.type !== 'track') {
    // Create a new event object with the enhanced config for ga4Process
    const enhancedEvent = {
      ...event,
      destination: {
        ...destination,
        Config: enhancedConfig,
      },
    } as ProcessorTransformationRequest;
    return ga4Process({ event: enhancedEvent, destType: 'ga4_v2' });
  }

  basicConfigvalidaiton(enhancedConfig);

  // custom mappings flow
  return handleCustomMappings(message, enhancedConfig);
}
