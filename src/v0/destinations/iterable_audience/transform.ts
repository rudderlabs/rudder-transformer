import { mapInBatches } from '@rudderstack/integrations-lib';

import { handleRtTfSingleEventError } from '../../util';
import { UNSUBSCRIBE_PATH } from './config';
import { IterableAudienceRequestBuildResult, IterableAudienceRouterRequest } from './types';
import { batchResponseBuilder, createEventChunk } from './utils';

const processRouterDest = async (inputs: IterableAudienceRouterRequest[], reqMetadata: any) => {
  if (!inputs?.length) return [];

  const { destination } = inputs[0];

  const processedEvents = await mapInBatches(inputs, (event) => {
    try {
      if (event.message.statusCode) {
        return {
          success: false,
          transformedEvent: event,
        };
      }
      return {
        success: true,
        data: createEventChunk(event),
      };
    } catch (error) {
      return {
        success: false,
        transformedEvent: handleRtTfSingleEventError(event, error, reqMetadata),
      };
    }
  });

  const successfulEvents = processedEvents
    .filter((result) => result.success)
    .map((result) => result.data as IterableAudienceRequestBuildResult);

  const transformedOrErrorEvents = processedEvents
    .filter((result) => !result.success)
    .map((result) => result.transformedEvent);

  const unsubscribeRespList = successfulEvents
    .filter((event) => event.endpointPath === UNSUBSCRIBE_PATH)
    .map(({ payload, metadata }) => ({
      payload: { subscribers: [payload] },
      metadata,
    }));

  const subscribeRespList = successfulEvents
    .filter((event) => event.endpointPath !== UNSUBSCRIBE_PATH)
    .map(({ payload, metadata }) => ({
      payload: { subscribers: [payload] },
      metadata,
    }));

  const batchedResponses = batchResponseBuilder(
    subscribeRespList,
    unsubscribeRespList,
    destination,
  );

  return [...batchedResponses, ...transformedOrErrorEvents];
};

export { processRouterDest };
