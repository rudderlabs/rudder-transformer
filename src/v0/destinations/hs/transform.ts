import get from 'get-value';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import { EventType } from '../../../constants';
import {
  handleRtTfSingleEventError,
  getDestinationExternalIDInfoForRetl,
  groupEventsByType as batchEventsInOrder,
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
import type { Metadata, ProcessorTransformationRequest } from '../../../types';
import type {
  HubSpotDestination,
  HubSpotPropertyMap,
  HubSpotEventInput,
  HubSpotExternalIdInfo,
} from './types';

const processSingleMessage = async (
  {
    message,
    destination,
    metadata,
  }: { message: Record<string, unknown>; destination: HubSpotDestination; metadata: Metadata },
  propertyMap?: HubSpotPropertyMap,
): Promise<Record<string, unknown> | Record<string, unknown>[]> => {
  if (!message.type) {
    throw new InstrumentationError('Message type is not present. Aborting message.');
  }

  // Config Validation
  validateDestinationConfig(destination);

  let response: Record<string, unknown> | Record<string, unknown>[] | undefined;
  switch (message.type) {
    case EventType.IDENTIFY: {
      response = [];
      if (destination.Config.apiVersion === API_VERSION.v3) {
        response.push(await processIdentify({ message, destination, metadata }, propertyMap));
      } else {
        // Legacy API
        response.push(
          await processLegacyIdentify({ message, destination, metadata }, propertyMap),
        );
      }
      break;
    }
    case EventType.TRACK:
      if (destination.Config.apiVersion === API_VERSION.v3) {
        response = await processTrack({ message, destination });
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
  event: ProcessorTransformationRequest,
): Promise<Record<string, unknown> | Record<string, unknown>[]> => {
  const { destination, message, metadata } = event;
  const hsDestination = destination as unknown as HubSpotDestination;
  const mappedToDestination = get(message, MappedToDestinationKey);
  let events: { message: Record<string, unknown> }[] = [
    { message: message as Record<string, unknown> },
  ];
  if (mappedToDestination && GENERIC_TRUE_VALUES.includes(mappedToDestination?.toString())) {
    // get info about existing objects and splitting accordingly.
    events = await splitEventsForCreateUpdate(events, hsDestination, metadata);
  }
  return processSingleMessage({
    message: events[0].message,
    destination: hsDestination,
    metadata,
  });
};

const processBatchRouter = async (
  inputs: HubSpotEventInput[],
  reqMetadata: Record<string, unknown>,
): Promise<{
  batchedResponseList: unknown[];
  errorRespList: unknown[];
  dontBatchEvents: unknown[];
}> => {
  let tempInputs = inputs;
  // using the first destination config for transforming the batch
  const { destination, metadata } = tempInputs[0];
  let propertyMap: HubSpotPropertyMap | undefined;
  const mappedToDestination = get(tempInputs[0].message, MappedToDestinationKey);
  const externalIdInfo = getDestinationExternalIDInfoForRetl(
    tempInputs[0].message,
    'HS',
  ) as HubSpotExternalIdInfo | null;
  const objectType = externalIdInfo?.objectType;
  const successRespList: HubSpotEventInput[] = [];
  const errorRespList: unknown[] = [];
  // batch implementation
  let batchedResponseList: unknown[] = [];
  try {
    if (mappedToDestination && GENERIC_TRUE_VALUES.includes(mappedToDestination?.toString())) {
      // skip splitting the batches to inserts and updates if object it is an association
      if (!objectType || String(objectType).toLowerCase() !== 'association') {
        propertyMap = await getProperties(destination, metadata);
        // get info about existing objects and splitting accordingly.
        tempInputs = (await splitEventsForCreateUpdate(
          tempInputs,
          destination,
          metadata,
        )) as typeof tempInputs;
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
        if (input.message.statusCode) {
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

  const dontBatchTrueResponses: HubSpotEventInput[] = [];
  const dontBatchFalseOrUndefinedResponses: HubSpotEventInput[] = [];
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
  inputs: HubSpotEventInput[],
  reqMetadata: Record<string, unknown>,
): Promise<unknown[]> => {
  const tempNewInputs = batchEventsInOrder(inputs);
  const batchedResponseList: unknown[] = [];
  const errorRespList: unknown[] = [];
  const dontBatchEvents: unknown[] = [];
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
