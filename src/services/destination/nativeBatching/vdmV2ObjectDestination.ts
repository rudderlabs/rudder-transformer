import { InstrumentationError } from '@rudderstack/integrations-lib';
import { BatchDestination } from './batchDestination';
import type { RecordContext, TransformedEvent } from './types';

// ---------------------------------------------------------------------------
// VDMV2ObjectDestination — object-based record dispatch
// ---------------------------------------------------------------------------

export abstract class VDMV2ObjectDestination<
  TBody extends Record<string, unknown> = Record<string, unknown>,
  TConfig = Record<string, unknown>,
  TConnectionConfig = Record<string, unknown>,
> extends BatchDestination<TBody, TConfig, TConnectionConfig> {
  // Returns a map of object type → { action → handler }.
  // Missing object types or actions are rejected automatically by transformRecord.
  abstract transformObjectRecord(): Record<
    string,
    Partial<
      Record<
        'insert' | 'update' | 'delete',
        (
          context: RecordContext<TConnectionConfig>,
        ) => TransformedEvent<TBody> | TransformedEvent<TBody>[]
      >
    >
  >;

  transformRecord(
    context: RecordContext<TConnectionConfig>,
  ): TransformedEvent<TBody> | TransformedEvent<TBody>[] {
    const objectHandlers = this.transformObjectRecord();
    const actionHandlers = objectHandlers[context.objectType];
    if (!actionHandlers) {
      throw new InstrumentationError(`Unsupported object type: "${context.objectType}"`);
    }
    const handler = actionHandlers[context.action];
    if (!handler) {
      throw new InstrumentationError(
        `"${context.action}" is not supported for object type "${context.objectType}"`,
      );
    }
    return handler(context);
  }
}
