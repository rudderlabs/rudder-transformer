import { ZodType } from 'zod';
import type { Destination } from '../../../types/controlPlaneConfig';
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
// Abstract class: BatchDestination<TBody>
// ---------------------------------------------------------------------------

// Constructor type for BatchDestination subclasses — used by the framework to instantiate per request
export type BatchDestinationConstructor<
  TBody extends Record<string, unknown> = Record<string, unknown>,
> = new (destination: Destination) => BatchDestination<TBody>;

export abstract class BatchDestination<
  TBody extends Record<string, unknown> = Record<string, unknown>,
> {
  protected destination: Destination;

  constructor(destination: Destination) {
    this.destination = destination;
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
