import { InstrumentationError } from '@rudderstack/integrations-lib';
import type { RouterTransformationRequestData } from '../../../types/destinationTransformation';
import { BatchDestination } from './batchDestination';
import type { TransformedEvent } from './types';

// ---------------------------------------------------------------------------
// VDMV2ObjectDestination — object-based record dispatch
// ---------------------------------------------------------------------------

export abstract class VDMV2ObjectDestination<
  TBody extends Record<string, unknown> = Record<string, unknown>,
  TConfig = Record<string, unknown>,
  TConnectionConfig = Record<string, unknown>,
> extends BatchDestination<TBody, TConfig, TConnectionConfig> {
  // Returns a map of object type → { action → handler }.
  // Missing object types or actions are rejected automatically.
  abstract transformObjectRecord(): Record<
    string,
    Partial<
      Record<
        'insert' | 'update' | 'delete',
        (
          input: RouterTransformationRequestData,
        ) => TransformedEvent<TBody> | TransformedEvent<TBody>[]
      >
    >
  >;

  // Override for event-stream events when the destination supports both
  // record and event-stream (e.g., CustomerIO). Default throws.
  /* eslint-disable @typescript-eslint/no-unused-vars */
  transformEventStream(
    input: RouterTransformationRequestData,
    reqMetadata?: NonNullable<unknown>,
  ): TransformedEvent<TBody> | TransformedEvent<TBody>[] {
    throw new InstrumentationError('Event-stream events are not supported by this destination');
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */

  transformEvent(
    input: RouterTransformationRequestData,
    reqMetadata?: NonNullable<unknown>,
  ): TransformedEvent<TBody> | TransformedEvent<TBody>[] {
    if (input.message?.type === 'record') {
      const action = (input.message as unknown as { action?: string }).action as
        | 'insert'
        | 'update'
        | 'delete'
        | undefined;
      const objectType =
        (this.connection?.config as Record<string, Record<string, string>>)?.destination?.object ??
        '';

      const objectHandlers = this.transformObjectRecord();
      const actionHandlers = objectHandlers[objectType];
      if (!actionHandlers) {
        throw new InstrumentationError(`Unsupported object type: "${objectType}"`);
      }
      if (!action || !actionHandlers[action]) {
        throw new InstrumentationError(
          `"${action}" is not supported for object type "${objectType}"`,
        );
      }
      return actionHandlers[action]!(input);
    }

    return this.transformEventStream(input, reqMetadata);
  }
}
