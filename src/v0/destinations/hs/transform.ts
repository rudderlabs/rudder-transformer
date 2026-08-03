import { InstrumentationError } from '@rudderstack/integrations-lib';
import { EventType } from '../../../constants';
import { handleRtTfSingleEventError, groupEventsByType } from '../../util';
import { API_VERSION } from './config';
import { processLegacyIdentify, processLegacyTrack, legacyBatchEvents } from './es-retl-v1';
import { processIdentify, processTrack, batchEvents } from './es-retl-v3';
import { fetchFinalSetOfTraits, getProperties, validateDestinationConfig } from './util';
import { processBatchRouterRetl, shouldUseHsRetlSplitPath } from './retl-transform';
import type {
  HubSpotPropertyMap,
  HubSpotBatchRouterResult,
  HubSpotRouterTransformationOutput,
  HubspotRouterRequest,
  HubspotProcessorTransformationOutput,
  HubSpotBatchProcessingItem,
} from './types';

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

const processBatchRouter = async (
  inputs: HubspotRouterRequest[],
  reqMetadata: NonNullable<unknown>,
): Promise<HubSpotBatchRouterResult> => {
  // rETL (mappedToDestination) batches are handled by the dedicated rETL code
  // path. A router call is homogeneous per source, so the remaining logic below
  // only ever runs for event-stream batches.
  if (inputs.length > 0 && shouldUseHsRetlSplitPath(inputs[0])) {
    return processBatchRouterRetl(inputs, reqMetadata);
  }

  const tempInputs = inputs;
  // using the first destination config for transforming the batch
  const { destination, metadata } = tempInputs[0];
  let propertyMap: HubSpotPropertyMap | undefined;
  const successRespList: HubSpotBatchProcessingItem[] = [];
  const errorRespList: HubSpotRouterTransformationOutput[] = [];
  // batch implementation
  let batchedResponseList: HubSpotRouterTransformationOutput[] = [];
  try {
    // reduce the no. of calls for properties endpoint
    const traitsFound = tempInputs.some(
      (input) => fetchFinalSetOfTraits(input.message) !== undefined,
    );
    if (traitsFound) {
      propertyMap = await getProperties(destination, metadata);
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
        let receivedResponse = await processSingleMessage(
          { message: input.message, destination, metadata: input.metadata },
          propertyMap,
        );

        receivedResponse = Array.isArray(receivedResponse) ? receivedResponse : [receivedResponse];

        // received response can be in array format [{}, {}, {}, ..., {}]
        // if multiple response is being returned
        receivedResponse.forEach((element) => {
          successRespList.push({
            message: element,
            metadata: input.metadata,
            destination,
          });
        });
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

  // For dontBatch=true events, route them through the same batching logic
  // as individual single-event batches so they get proper endpoint rewriting
  // and { inputs: [...] } wrapping via batchIdentify().
  let dontBatchEvents: HubSpotRouterTransformationOutput[] = [];
  if (dontBatchTrueResponses.length > 0) {
    if (destination.Config.apiVersion === API_VERSION.v3) {
      dontBatchEvents = dontBatchTrueResponses.flatMap((event) => batchEvents([event]));
    } else {
      dontBatchEvents = dontBatchTrueResponses.flatMap((event) => legacyBatchEvents([event]));
    }
  }

  return {
    batchedResponseList,
    errorRespList,
    dontBatchEvents,
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

export { processRouterDest };
