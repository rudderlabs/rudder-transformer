import get from 'get-value';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import { EventType } from '../../../constants';
import {
  handleRtTfSingleEventError,
  getDestinationExternalIDInfoForRetl,
  groupEventsByType,
} from '../../util';
import { API_VERSION } from './config';
import { processLegacyIdentify, processLegacyTrack, legacyBatchEvents } from './HSTransform-v1';
import { MappedToDestinationKey, GENERIC_TRUE_VALUES } from '../../../constants';
import { processIdentify, processTrack, batchEvents } from './HSTransform-v2';
import {
  splitEventsForCreateUpdate,
  fetchFinalSetOfTraits,
  getProperties,
  validateDestinationConfig,
  convertToResponseFormat,
} from './util';
import type {
  HubSpotPropertyMap,
  HubSpotBatchRouterResult,
  HubSpotRouterTransformationOutput,
  HubspotRouterRequest,
  HubspotProcessorTransformationOutput,
  HubspotProcessorRequest,
  HubSpotBatchProcessingItem,
} from './types';
import { isProcessorOutput } from './types';

const processSingleMessage = async (
  { message, destination, metadata }: HubspotRouterRequest,
  propertyMap?: HubSpotPropertyMap,
): Promise<HubspotProcessorTransformationOutput | HubspotProcessorTransformationOutput[]> => {
  if (!message.type) {
    throw new InstrumentationError('Message type is not present. Aborting message.');
  }

  // Config Validation
  validateDestinationConfig(destination);

  let response: HubspotProcessorTransformationOutput | HubspotProcessorTransformationOutput[];
  switch (message.type) {
    case EventType.IDENTIFY: {
      response = [];
      if (destination.Config.apiVersion === API_VERSION.v3) {
        response.push(await processIdentify({ message, destination, metadata }, propertyMap));
      } else {
        // Legacy API
        response.push(await processLegacyIdentify({ message, destination, metadata }, propertyMap));
      }
      break;
    }
    case EventType.TRACK:
      if (destination.Config.apiVersion === API_VERSION.v3) {
        response = await processTrack({ message, destination, metadata });
      } else {
        response = await processLegacyTrack({ message, destination, metadata }, propertyMap);
      }
      break;
    default:
      throw new InstrumentationError(`Message type ${message.type} is not supported`);
  }

  return response;
};

// has been deprecated - using routerTransform for both the versions
const process = async (
  event: HubspotProcessorRequest,
): Promise<HubspotProcessorTransformationOutput | HubspotProcessorTransformationOutput[]> => {
  const { destination, message, metadata } = event;
  const mappedToDestination = get(message, MappedToDestinationKey);
  let events: HubspotProcessorRequest[] = [event];
  if (mappedToDestination && GENERIC_TRUE_VALUES.includes(mappedToDestination?.toString())) {
    // get info about existing objects and splitting accordingly.
    events = await splitEventsForCreateUpdate(events, destination, metadata);
  }
  return processSingleMessage({
    message: events[0].message,
    destination,
    metadata,
  });
};

const processBatchRouter = async (
  inputs: HubspotRouterRequest[],
  reqMetadata: NonNullable<unknown>,
): Promise<HubSpotBatchRouterResult> => {
  let tempInputs = inputs;
  // using the first destination config for transforming the batch
  const { destination, metadata } = tempInputs[0];
  let propertyMap: HubSpotPropertyMap | undefined;
  const mappedToDestination = get(tempInputs[0].message, MappedToDestinationKey);
  const externalIdInfo = getDestinationExternalIDInfoForRetl(tempInputs[0].message, 'HS');
  const objectType = externalIdInfo?.objectType;
  const successRespList: HubSpotBatchProcessingItem[] = [];
  const errorRespList: HubSpotRouterTransformationOutput[] = [];
  // batch implementation
  let batchedResponseList: HubSpotRouterTransformationOutput[] = [];
  try {
    if (mappedToDestination && GENERIC_TRUE_VALUES.includes(mappedToDestination?.toString())) {
      // skip splitting the batches to inserts and updates if object it is an association
      if (!objectType || String(objectType).toLowerCase() !== 'association') {
        propertyMap = await getProperties(destination, metadata);
        // get info about existing objects and splitting accordingly.
        tempInputs = await splitEventsForCreateUpdate(tempInputs, destination, metadata);
      }
    } else {
      // reduce the no. of calls for properties endpoint
      const traitsFound = tempInputs.some(
        (input) => fetchFinalSetOfTraits(input.message) !== undefined,
      );
      if (traitsFound) {
        propertyMap = await getProperties(destination, metadata);
      }
    }
  } catch (error: unknown) {
    // Any error thrown from the above try block applies to all the events
    return {
      batchedResponseList,
      errorRespList: tempInputs.map((input) =>
        handleRtTfSingleEventError(input, error, reqMetadata),
      ),
      dontBatchEvents: [],
    };
  }

  await Promise.all(
    inputs.map(async (input) => {
      try {
        if (input.message.statusCode && isProcessorOutput(input.message)) {
          // already transformed event
          successRespList.push({
            message: input.message,
            metadata: input.metadata,
            destination,
          });
        } else {
          // event is not transformed
          let receivedResponse = await processSingleMessage(
            { message: input.message, destination, metadata: input.metadata },
            propertyMap,
          );

          receivedResponse = Array.isArray(receivedResponse)
            ? receivedResponse
            : [receivedResponse];

          // received response can be in array format [{}, {}, {}, ..., {}]
          // if multiple response is being returned
          receivedResponse.forEach((element) => {
            successRespList.push({
              message: element,
              metadata: input.metadata,
              destination,
            });
          });
        }
      } catch (error: unknown) {
        const errRespEvent = handleRtTfSingleEventError(input, error, reqMetadata);
        errorRespList.push(errRespEvent);
      }
    }),
  );

  const dontBatchTrueResponses: HubSpotBatchProcessingItem[] = [];
  const dontBatchFalseOrUndefinedResponses: HubSpotBatchProcessingItem[] = [];
  // segregating successRepList depending on dontbatch value
  successRespList.forEach((successResp) => {
    if (successResp.metadata?.dontBatch) {
      dontBatchTrueResponses.push(successResp);
    } else {
      dontBatchFalseOrUndefinedResponses.push(successResp);
    }
  });

  // batch implementation
  if (dontBatchFalseOrUndefinedResponses.length > 0) {
    if (destination.Config.apiVersion === API_VERSION.v3) {
      batchedResponseList = batchEvents(dontBatchFalseOrUndefinedResponses);
    } else {
      batchedResponseList = legacyBatchEvents(dontBatchFalseOrUndefinedResponses);
    }
  }
  return {
    batchedResponseList,
    errorRespList,
    // if there are any events where dontbatch set to true we need to update them according to the response format
    dontBatchEvents: convertToResponseFormat(dontBatchTrueResponses),
  };
};

// we are batching by default at routerTransform
const processRouterDest = async (
  inputs: HubspotRouterRequest[],
  reqMetadata: NonNullable<unknown>,
): Promise<HubSpotRouterTransformationOutput[]> => {
  const tempNewInputs: HubspotRouterRequest[][] = groupEventsByType(inputs);
  const batchedResponseList: HubSpotRouterTransformationOutput[] = [];
  const errorRespList: HubSpotRouterTransformationOutput[] = [];
  const dontBatchEvents: HubSpotRouterTransformationOutput[] = [];
  const promises = tempNewInputs.map(async (inputEvents) => {
    const response = await processBatchRouter(inputEvents, reqMetadata);
    return response;
  });

  const results = await Promise.all(promises);

  results.forEach((response) => {
    errorRespList.push(...response.errorRespList);
    batchedResponseList.push(...response.batchedResponseList);
    dontBatchEvents.push(...response.dontBatchEvents);
  });
  return [...batchedResponseList, ...errorRespList, ...dontBatchEvents];
};

export { process, processRouterDest };
