import get from 'get-value';
import { ConfigurationError } from '@rudderstack/integrations-lib';
import type { RouterTransformationRequestData } from '../../../types/destinationTransformation';
import { MappedToDestinationKey } from '../../../constants';
import { addExternalIdToTraits, adduserIdFromExternalId } from '../../../v0/util';
import { BatchDestination } from './batchDestination';
import type { TransformedEvent } from './types';

// Record message shape known to the framework after schema validation
export type RecordMessage = {
  type: 'record';
  action: 'insert' | 'update' | 'delete';
  identifiers: Record<string, unknown>;
  [key: string]: unknown;
};

export type RecordInput = RouterTransformationRequestData<RecordMessage>;

function isRecordInput(input: RouterTransformationRequestData): input is RecordInput {
  return input.message?.type === 'record';
}

// ---------------------------------------------------------------------------
// VDMV2ObjectDestination — object-based record dispatch
// ---------------------------------------------------------------------------

type ObjectConnectionConfig = { destination: { object: string } };

export abstract class VDMV2ObjectDestination<
  TBody extends Record<string, unknown> = Record<string, unknown>,
  TConfig = Record<string, unknown>,
  TConnectionConfig extends ObjectConnectionConfig = ObjectConnectionConfig,
> extends BatchDestination<TBody, TConfig, TConnectionConfig> {
  // Returns a map of object type → { action → handler }.
  // Missing object types or actions are rejected automatically by the framework.
  abstract transformObjectRecord(
    input: RecordInput,
  ): Record<
    string,
    Partial<
      Record<
        'insert' | 'update' | 'delete',
        () => TransformedEvent<TBody> | TransformedEvent<TBody>[]
      >
    >
  >;

  // Override to return event-stream handlers.
  // Default returns undefined (event-stream not supported).
  /* eslint-disable @typescript-eslint/no-unused-vars */
  transformEventStream(
    _input: RouterTransformationRequestData,
  ):
    | Partial<Record<string, () => TransformedEvent<TBody> | TransformedEvent<TBody>[]>>
    | undefined {
    return undefined;
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */

  transformEvent(
    input: RouterTransformationRequestData,
  ): TransformedEvent<TBody> | TransformedEvent<TBody>[] {
    if (isRecordInput(input)) {
      const { action } = input.message;
      if (!this.connection) {
        throw new ConfigurationError('Missing connection config');
      }
      const { object: objectType } = this.connection.config.destination;

      const objectHandlers = this.transformObjectRecord(input);
      const actionHandlers = objectHandlers[objectType];
      if (!actionHandlers) {
        throw new ConfigurationError(`Unsupported object type: "${objectType}"`);
      }
      const handler = actionHandlers[action];
      if (!handler) {
        throw new ConfigurationError(
          `"${action}" is not supported for object type "${objectType}"`,
        );
      }
      return handler();
    }

    const messageType = (input.message?.type as string | undefined)?.toLowerCase();
    if (!messageType) {
      throw new ConfigurationError('Missing message type');
    }

    if (get(input.message, MappedToDestinationKey)) {
      addExternalIdToTraits(input.message);
      adduserIdFromExternalId(input.message);
    }

    const eventHandlers = this.transformEventStream(input);
    if (!eventHandlers) {
      throw new ConfigurationError('Event-stream events are not supported by this destination');
    }
    const handler = eventHandlers[messageType];
    if (!handler) {
      throw new ConfigurationError(`Event type "${messageType}" is not supported`);
    }
    return handler();
  }
}
