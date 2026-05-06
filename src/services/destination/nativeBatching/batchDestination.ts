import { ZodType } from 'zod';
import type { Connection, Destination } from '../../../types/controlPlaneConfig';
import type { RouterTransformationRequestData } from '../../../types/destinationTransformation';
import { generateErrorObject } from '../../../v0/util';
import type { BatchStrategy, TransformedEvent, TransformResult } from './types';

export type {
  TransformedEvent,
  TransformError,
  TransformResult,
  BatchGroup,
  BatchStrategy,
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

  abstract transformEvent(
    input: RouterTransformationRequestData,
    reqMetadata?: NonNullable<unknown>,
  ): TransformedEvent<TBody> | TransformedEvent<TBody>[];

  abstract getBatchStrategy(endpoint: string): BatchStrategy<TBody>;

  abstract getInputSchema(): ZodType;

  // --- MAY override ---

  async transformEvents(
    inputs: RouterTransformationRequestData[],
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
