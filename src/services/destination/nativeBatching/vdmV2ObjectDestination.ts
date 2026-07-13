import { z, ZodType } from 'zod';
import get from 'get-value';
import { ConfigurationError } from '@rudderstack/integrations-lib';
import type { RouterTransformationRequestData } from '../../../types/destinationTransformation';
import type { RudderRecordV2 } from '../../../types/rudderEvents';
import { MappedToDestinationKey } from '../../../constants';
import { addExternalIdToTraits, adduserIdFromExternalId } from '../../../v0/util';
import { BatchDestination } from './batchDestination';
import { makeHybridInputSchema } from './inputSchema';
import type { TransformedEvent } from './types';

// Record message shape known to the framework after schema validation
type RecordMessage = Pick<RudderRecordV2, 'type' | 'action' | 'identifiers'>;

type RecordInput = RouterTransformationRequestData<RecordMessage>;

function isRecordInput(input: RouterTransformationRequestData): input is RecordInput {
  return input.message?.type === 'record';
}

// The schema-driven connection type is only as precise as the destination's input
// schema, so the framework reads the record-dispatch `object` through this shape.
type ObjectConnectionConfig = { destination: { object: string } };

// The router-input type the framework validates against: the union of the record and
// event-stream schemas the subclass declares.
type ObjectRouterInput<
  TRecordSchema extends ZodType,
  TEventStreamSchema extends ZodType,
> = z.ZodType<z.infer<TRecordSchema> | z.infer<TEventStreamSchema>>;

export abstract class VDMV2ObjectDestination<
  TBody extends Record<string, unknown> = Record<string, unknown>,
  TRecordSchema extends ZodType = ZodType,
  TEventStreamSchema extends ZodType = ZodType,
> extends BatchDestination<TBody, ObjectRouterInput<TRecordSchema, TEventStreamSchema>> {
  // Subclasses declare the two variant schemas (built via makeRouterInputSchema, each
  // carrying the shared destinationConfig via a common constant). The framework owns the
  // union — subclasses do not implement getInputSchema.
  protected abstract readonly recordSchema: TRecordSchema;

  protected abstract readonly eventStreamSchema: TEventStreamSchema;

  getInputSchema(): ObjectRouterInput<TRecordSchema, TEventStreamSchema> {
    // The framework calls this once per instance (processBatchedDestination validates the
    // whole batch in a single validateInputs pass), so the schema is built once — no cache
    // needed. Discriminating on `message.type` (rather than a plain z.union) means a bad
    // `destination.Config` — which both variants declare — is reported against the one
    // branch the message actually selected, with its real path, instead of collapsing into
    // an opaque `invalid_union`.
    return makeHybridInputSchema(
      this.recordSchema,
      this.eventStreamSchema,
    ) as unknown as ObjectRouterInput<TRecordSchema, TEventStreamSchema>;
  }

  // Returns a map of object type → { action → handler }. Missing object types or actions
  // are rejected automatically by the framework.
  abstract transformObjectRecord(
    input: z.infer<TRecordSchema>,
  ): Record<
    string,
    Partial<
      Record<
        'insert' | 'update' | 'delete',
        () => TransformedEvent<TBody> | TransformedEvent<TBody>[]
      >
    >
  >;

  // Override to return event-stream handlers. Default returns undefined.
  /* eslint-disable @typescript-eslint/no-unused-vars */
  transformEventStream(
    _input: z.infer<TEventStreamSchema>,
  ):
    | Partial<Record<string, () => TransformedEvent<TBody> | TransformedEvent<TBody>[]>>
    | undefined {
    return undefined;
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */

  transformEvent(
    input: z.infer<ObjectRouterInput<TRecordSchema, TEventStreamSchema>>,
  ): TransformedEvent<TBody> | TransformedEvent<TBody>[] {
    // Routing operates on the framework envelope; cast at the boundary since the
    // schema-inferred union is structurally narrower than RouterTransformationRequestData.
    const envelope = input as unknown as RouterTransformationRequestData;

    if (isRecordInput(envelope)) {
      const { action } = envelope.message;
      if (!this.connection) {
        throw new ConfigurationError('Missing connection config');
      }
      const { object: objectType } = (this.connection.config as ObjectConnectionConfig).destination;

      const objectHandlers = this.transformObjectRecord(input as z.infer<TRecordSchema>);
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

    const messageType = (envelope.message?.type as string | undefined)?.toLowerCase();
    if (!messageType) {
      throw new ConfigurationError('Missing message type');
    }

    if (get(envelope.message, MappedToDestinationKey)) {
      addExternalIdToTraits(envelope.message);
      adduserIdFromExternalId(envelope.message);
    }

    const eventHandlers = this.transformEventStream(input as z.infer<TEventStreamSchema>);
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
