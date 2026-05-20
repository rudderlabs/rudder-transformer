import { mapInBatches } from '@rudderstack/integrations-lib';
import { RecordAction } from '../../../types/rudderEvents';
import { handleRtTfSingleEventError } from '../../util';
import { batchResponseBuilder, createEventChunk } from './utils';
import {
  IterableAudienceConnection,
  IterableAudienceDestination,
  IterableAudienceRouterRequest,
  RespList,
} from './type';

const processRouterDest = async (inputs: IterableAudienceRouterRequest[], reqMetadata: any) => {
  if (!inputs?.length) return [];

  const { destination, connection } = inputs[0];
  const iterableDestination = destination as IterableAudienceDestination;
  const iterableConnection = connection as IterableAudienceConnection;

  const processedEvents = await mapInBatches(inputs, (event) => {
    try {
      return {
        success: true,
        data: createEventChunk(event),
      };
    } catch (error) {
      return {
        success: false,
        error: handleRtTfSingleEventError(event, error, reqMetadata),
      };
    }
  });

  const successfulEvents = processedEvents
    .filter((result) => result.success)
    .map((result) => result.data as RespList & { eventAction: RecordAction });

  const errorEvents = processedEvents
    .filter((result) => !result.success)
    .map((result) => result.error);

  const deleteRows = successfulEvents
    .filter((event) => event.eventAction === RecordAction.DELETE)
    .map(({ payload, metadata }) => ({ payload, metadata }));

  const upsertRows = successfulEvents
    .filter((event) => event.eventAction !== RecordAction.DELETE)
    .map(({ payload, metadata }) => ({ payload, metadata }));

  const batchedResponses = batchResponseBuilder(
    upsertRows,
    deleteRows,
    iterableDestination,
    iterableConnection,
  );

  return [...batchedResponses, ...errorEvents];
};

export { processRouterDest };
