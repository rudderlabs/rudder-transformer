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
import type { DeliveryContext, HandleResponseResult, StatusOverrideMap, Verdict } from './delivery';
import {
  classifyByStatus,
  defaultFailureReason,
  resolveStatusOverrides,
  statusClassOf,
} from './delivery';

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
} from './delivery';

// ---------------------------------------------------------------------------
// Abstract class: BatchDestination<TBody, TInputSchema>
// ---------------------------------------------------------------------------

// Constructor type for BatchDestination subclasses — used by the framework to instantiate per request.
// Only TBody is needed; TInputSchema is an internal concern of the concrete class.
// The delivery statics are part of the contract, so the constructor type carries them: the
// delivery path resolves a class through this type and calls `handleResponse` on it without ever
// instantiating (the proxy payload has no `destination` or `connection` to construct one with).
export type BatchDestinationConstructor<
  TBody extends Record<string, unknown> = Record<string, unknown>,
> = (new (destination: Destination, connection?: Connection) => BatchDestination<TBody>) & {
  handleResponse(ctx: DeliveryContext): HandleResponseResult;
  failureReason(ctx: DeliveryContext): string;
  readonly statusOverrides: StatusOverrideMap;
};

export abstract class BatchDestination<
  TBody extends Record<string, unknown> = Record<string, unknown>,
  TInputSchema extends ZodType = ZodType<Record<string, unknown>>,
> {
  // --- Delivery (statics) ---
  //
  // The proxy payload carries `destinationConfig` and `metadata` but no `destination` object and
  // no `connection` (see zodTypes.ts), so no instance can be constructed on the delivery path —
  // and for the audience destinations, whose constructors require a connection, it must not be.
  // Hence statics. TypeScript has no `abstract static`, so these are conventions with defaults
  // rather than enforced members.

  /**
   * Per-status behaviour, consulted before the framework's own classification. Exact status keys
   * take precedence over class keys ('2xx' / '4xx' / '5xx'). Merged down the prototype chain, so
   * declaring a map here does not drop entries an ancestor declared.
   */
  static readonly statusOverrides: StatusOverrideMap = {};

  /**
   * The reason carried by a failure verdict.
   *
   * The default is status-only and never reads the body: the framework has no general way to
   * find a message in an arbitrary destination's response, and guessing at common field names
   * generalises one destination's shape onto every other. An integration whose API returns
   * usable error text overrides this with an extractor written against that API.
   */
  static failureReason(ctx: DeliveryContext): string {
    return defaultFailureReason(ctx.status);
  }

  /** The framework's classification for this response. Passed to overrides as `fallback`. */
  static defaultVerdict(ctx: DeliveryContext): Verdict {
    return classifyByStatus(ctx.status, this.failureReason(ctx));
  }

  /**
   * Framework-owned. Integrations declare `statusOverrides` rather than overriding this.
   */
  static handleResponse(ctx: DeliveryContext): HandleResponseResult {
    const overrides = resolveStatusOverrides(this);
    const statusClass = statusClassOf(ctx.status);
    const override = overrides[ctx.status] ?? (statusClass ? overrides[statusClass] : undefined);
    const fallback = () => this.defaultVerdict(ctx);
    return override ? override(ctx, fallback) : fallback();
  }

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
