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
import type { DeliverySpec } from './delivery';

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
export { makeRouterInputSchema } from './inputSchema';
export { ChunkBatchStrategy } from './chunkBatchStrategy';
export { CustomBatchStrategy } from './customBatchStrategy';
export type {
  Verdict,
  ItemVerdict,
  PerItemVerdicts,
  HandleResponseResult,
  DeliveryContext,
  DeliverySpec,
  ResolvedDeliverySpec,
  StatusOverride,
  StatusKey,
  StatusOverrideMap,
} from './delivery';
export {
  success,
  abort,
  retry,
  throttled,
  authExpired,
  authRevoked,
  perItem,
  reasonOf,
  defaultFailureReason,
  resolveDeliverySpec,
  handleDeliveryResponse,
} from './delivery';

// ---------------------------------------------------------------------------
// Abstract class: DestinationIntegration<TBody, TInputSchema>
// ---------------------------------------------------------------------------

// Constructor type for DestinationIntegration subclasses — used by the framework to instantiate per request.
// Only TBody is needed; TInputSchema is an internal concern of the concrete class.
// The delivery spec is part of the contract, so the constructor type carries it: the delivery path
// resolves a class through this type and reads `delivery` off it without ever instantiating (the
// proxy payload has no `destination` or `connection` to construct one with).
export type DestinationIntegrationConstructor<
  TBody extends Record<string, unknown> = Record<string, unknown>,
> = (new (destination: Destination, connection?: Connection) => DestinationIntegration<TBody>) & {
  readonly delivery: DeliverySpec;
};

export abstract class DestinationIntegration<
  TBody extends Record<string, unknown> = Record<string, unknown>,
  TInputSchema extends ZodType = ZodType<Record<string, unknown>>,
> {
  /**
   * What this destination does with a delivery *response* — `statusOverrides` and `failureReason`,
   * grouped so that they read as delivery rather than as more transform surface. Everything else
   * on this class is about transforming an event; this one property is not.
   *
   * A static, and read as one, because the proxy payload carries `destinationConfig` and
   * `metadata` but no `destination` object and no `connection` (see zodTypes.ts): no instance can
   * be constructed on the delivery path, and for the audience destinations, whose constructors
   * require a connection, it must not be. `resolveDeliverySpec` merges this down the prototype
   * chain, so a subclass declaring its own spec does not drop what an ancestor declared.
   *
   * The framework applies it via `handleDeliveryResponse`; there is nothing here to override.
   */
  static readonly delivery: DeliverySpec = {};

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
