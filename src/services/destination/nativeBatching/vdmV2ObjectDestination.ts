import { ConfigurationError } from '@rudderstack/integrations-lib';
import type { RouterTransformationRequestData } from '../../../types/destinationTransformation';
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

  // Override for event-stream events when the destination supports both
  // record and event-stream (e.g., CustomerIO). Default throws.
  /* eslint-disable @typescript-eslint/no-unused-vars */
  transformEventStream(
    _input: RouterTransformationRequestData,
    _reqMetadata?: NonNullable<unknown>,
  ): TransformedEvent<TBody> | TransformedEvent<TBody>[] {
    throw new ConfigurationError('Event-stream events are not supported by this destination');
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */

  transformEvent(
    input: RouterTransformationRequestData,
    reqMetadata?: NonNullable<unknown>,
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

    return this.transformEventStream(input, reqMetadata);
  }
}
