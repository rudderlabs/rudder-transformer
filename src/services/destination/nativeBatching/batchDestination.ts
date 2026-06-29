import { ZodType } from 'zod';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import type { Connection, Destination } from '../../../types/controlPlaneConfig';
import type { RouterTransformationRequestData } from '../../../types/destinationTransformation';
import { generateErrorObject } from '../../../v0/util';
import type { BatchStrategy, TransformedEvent, TransformResult, RecordContext } from './types';

export type {
  TransformedEvent,
  TransformError,
  TransformResult,
  BatchGroup,
  BatchStrategy,
  RecordContext,
} from './types';
export { BodyFormat, parseSizeToBytes } from './types';
export { ChunkBatchStrategy } from './chunkBatchStrategy';
export { CustomBatchStrategy } from './customBatchStrategy';

// ---------------------------------------------------------------------------
// Abstract class: BatchDestination<TBody, TConfig, TConnectionConfig>
// ---------------------------------------------------------------------------

// Constructor type for BatchDestination subclasses — used by the framework to instantiate per request
export type BatchDestinationConstructor<
  TBody extends Record<string, unknown> = Record<string, unknown>,
  TConfig = Record<string, unknown>,
  TConnectionConfig = Record<string, unknown>,
> = new (
  destination: Destination<TConfig>,
  connection?: Connection<TConnectionConfig>,
) => BatchDestination<TBody, TConfig, TConnectionConfig>;

export abstract class BatchDestination<
  TBody extends Record<string, unknown> = Record<string, unknown>,
  TConfig = Record<string, unknown>,
  TConnectionConfig = Record<string, unknown>,
> {
  protected destination: Destination<TConfig>;

  // All inputs in a single router-transform call share the same (source, destination)
  // connection because rudder-server groups events that way before dispatching, so
  // it's safe for the framework to inject the connection at construction time.
  protected connection?: Connection<TConnectionConfig>;

  constructor(destination: Destination<TConfig>, connection?: Connection<TConnectionConfig>) {
    this.destination = destination;
    this.connection = connection;
  }

  // --- MUST implement ---

  abstract getBatchStrategy(endpoint: string): BatchStrategy<TBody>;

  abstract getInputSchema(): ZodType;

  // --- MAY override ---

  // --- Event-stream events (identify, track, page, screen, alias, group) ---
  // Override in subclasses that handle event-stream events.
  /* eslint-disable @typescript-eslint/no-unused-vars */
  transformEvent(
    input: RouterTransformationRequestData,
    reqMetadata?: NonNullable<unknown>,
  ): TransformedEvent<TBody> | TransformedEvent<TBody>[] {
    throw new InstrumentationError('Event-stream events are not supported by this destination');
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */

  // --- Record events (insert, update, delete) ---
  // Override in subclasses that handle record events.
  /* eslint-disable @typescript-eslint/no-unused-vars */
  transformRecord(
    context: RecordContext<TConnectionConfig>,
  ): TransformedEvent<TBody> | TransformedEvent<TBody>[] {
    throw new InstrumentationError('Record events are not supported by this destination');
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */

  async transformEvents(
    inputs: RouterTransformationRequestData[],
    reqMetadata?: NonNullable<unknown>,
  ): Promise<TransformResult<TBody>> {
    const successPayloads: TransformResult<TBody>['successPayloads'] = [];
    const errorPayloads: TransformResult<TBody>['errorPayloads'] = [];

    for (const input of inputs) {
      const jobId = input.metadata?.jobId;
      try {
        let transformedPayload: TransformedEvent<TBody> | TransformedEvent<TBody>[];

        if (input.message?.type === 'record') {
          const msg = input.message as unknown as {
            action: string;
            identifiers?: Record<string, string | number>;
          };
          const context: RecordContext<TConnectionConfig> = {
            action: msg.action as RecordContext['action'],
            objectType:
              (input.connection?.config as Record<string, Record<string, string>>)?.destination
                ?.object ?? '',
            identifiers: msg.identifiers ?? {},
            connection: input.connection as Connection<TConnectionConfig>,
          };
          transformedPayload = this.transformRecord(context);
        } else {
          transformedPayload = this.transformEvent(input, reqMetadata);
        }

        const results = Array.isArray(transformedPayload)
          ? transformedPayload
          : [transformedPayload];
        for (const result of results) {
          successPayloads.push({ ...result, jobId });
        }
      } catch (error: any) {
        const errObj = generateErrorObject(error);
        errorPayloads.push({
          error: errObj.message || 'Unknown error during transformation',
          statusCode: errObj.status,
          jobId,
          statTags: errObj.statTags,
        });
      }
    }

    return { successPayloads, errorPayloads };
  }
}
