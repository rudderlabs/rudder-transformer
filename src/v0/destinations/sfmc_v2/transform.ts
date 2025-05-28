import { SFMCRouterRequest, ProcessedEvent } from './type';
import { createEventChunk } from './utils';
import { handleRtTfSingleEventError } from '../../util';
import { MessageTypeSchema } from '../../../types';
import { recordEventsHandler } from './recordEventsHandler';

const processRouterDest = async (inputs: SFMCRouterRequest[], reqMetadata: any) => {
  if (!inputs?.length) return [];

  const { destination, connection } = inputs[0];
  if (!connection) {
    throw new Error('Connection configuration is required');
  }

  // Process events and separate valid and error cases
  const processedEvents = inputs
    .filter((event) => event.message.type === MessageTypeSchema.Enum.record)
    .map((event) => {
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

  const { dataExtensionKey } = connection.config.destination;

  const recordResponses = await recordEventsHandler(
    successfulEvents,
    dataExtensionKey,
    destination,
  );
  const responseList = [...recordResponses, ...errorEvents];
  return responseList;
};

export { processRouterDest };
