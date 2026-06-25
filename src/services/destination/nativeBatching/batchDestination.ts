import { z, ZodType } from 'zod';
import type { Connection, Destination } from '../../../types/controlPlaneConfig';
import { generateErrorObject } from '../../../v0/util';
import type {
  BatchStrategy,
  TransformedEvent,
  TransformResult,
  ExtractDestinationConfig,
  ExtractConnectionConfig,
} from './types';

export type {
  TransformedEvent,
  TransformError,
  TransformResult,
  BatchGroup,
  BatchStrategy,
  ExtractDestinationConfig,
  ExtractConnectionConfig,
} from './types';
export { BodyFormat, parseSizeToBytes } from './types';
export { ChunkBatchStrategy } from './chunkBatchStrategy';
export { CustomBatchStrategy } from './customBatchStrategy';

// ---------------------------------------------------------------------------
// Abstract class: BatchDestination<TBody, TInputSchema>
// ---------------------------------------------------------------------------

// Constructor type for BatchDestination subclasses — used by the framework to instantiate per request.
// Only TBody is needed; TInputSchema is an internal concern of the concrete class.
export type BatchDestinationConstructor<
  TBody extends Record<string, unknown> = Record<string, unknown>,
> = new (destination: Destination, connection?: Connection) => BatchDestination<TBody>;

export abstract class BatchDestination<
  TBody extends Record<string, unknown> = Record<string, unknown>,
  TInputSchema extends ZodType = ZodType<Record<string, unknown>>,
> {
  protected destination: Destination<ExtractDestinationConfig<z.infer<TInputSchema>>>;

  // All inputs in a single router-transform call share the same (source, destination)
  // connection because rudder-server groups events that way before dispatching, so
  // it's safe for the framework to inject the connection at construction time.
  protected connection?: Connection<ExtractConnectionConfig<z.infer<TInputSchema>>>;

  constructor(destination: Destination, connection?: Connection) {
    this.destination = destination as Destination<ExtractDestinationConfig<z.infer<TInputSchema>>>;
    this.connection = connection as
      | Connection<ExtractConnectionConfig<z.infer<TInputSchema>>>
      | undefined;
  }

  // --- MUST implement ---

  abstract transformEvent(
    input: z.infer<TInputSchema>,
    reqMetadata?: NonNullable<unknown>,
  ): TransformedEvent<TBody> | TransformedEvent<TBody>[];

  abstract getBatchStrategy(endpoint: string): BatchStrategy<TBody>;

  abstract getInputSchema(): TInputSchema;

  // --- MAY override ---

  async transformEvents(
    inputs: z.infer<TInputSchema>[],
    reqMetadata?: NonNullable<unknown>,
  ): Promise<TransformResult<TBody>> {
    const successPayloads: TransformResult<TBody>['successPayloads'] = [];
    const errorPayloads: TransformResult<TBody>['errorPayloads'] = [];

    for (const input of inputs) {
      const jobId = input.metadata?.jobId;
      try {
        const transformedPayload = this.transformEvent(input, reqMetadata);
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
