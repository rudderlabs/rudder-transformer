import { mapInBatches } from '@rudderstack/integrations-lib';
import {
  CustomerIOConnection,
  CustomerIODestination,
  CustomerIORouterRequest,
  ProcessedEvent,
} from './type';
import { RecordAction } from '../../../types/rudderEvents';
import { batchResponseBuilder, createEventChunk } from './utils';
import { handleRtTfSingleEventError } from '../../util';

const processRouterDest = async (inputs: CustomerIORouterRequest[], reqMetadata: any) => {
  if (!inputs?.length) return [];

  const { destination, connection } = inputs[0];

  const customerIODestination = destination as CustomerIODestination;
  const customerIOConnection = connection as CustomerIOConnection;

  // Process events and separate valid and error cases
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

  // Separate successful and failed events
  const successfulEvents = processedEvents
    .filter((result) => result.success)
    .map((result) => result.data as ProcessedEvent);

  const errorEvents = processedEvents
    .filter((result) => !result.success)
    .map((result) => result.error);

  // Split successful events into delete and insert/update lists
  const deleteRespList = successfulEvents
    .filter((event) => event.eventAction === RecordAction.DELETE)
    .map(({ payload, metadata }) => ({ payload, metadata }));

  const insertOrUpdateRespList = successfulEvents
    .filter((event) => event.eventAction !== RecordAction.DELETE)
    .map(({ payload, metadata }) => ({ payload, metadata }));

  const batchSuccessfulRespList = batchResponseBuilder(
    insertOrUpdateRespList,
    deleteRespList,
    customerIODestination,
    customerIOConnection,
  );

  return [...batchSuccessfulRespList, ...errorEvents];
};

export { processRouterDest };
