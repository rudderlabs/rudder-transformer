import stableStringify from 'fast-json-stable-stringify';
import type { Connection, Destination } from '../../../types/controlPlaneConfig';
import type { Metadata } from '../../../types/rudderEvents';
import type {
  RouterTransformationRequestData,
  RouterTransformationResponse,
} from '../../../types/destinationTransformation';
import { BatchDestination, BatchDestinationConstructor, TransformResult } from './batchDestination';
import type { TransformError } from './types';
import { BodyFormat } from './types';
import tags from '../../../v0/util/tags';
import stats from '../../../util/stats';
import { combineBatchRequestsWithSameJobIds } from '../../../v0/util';

// ---------------------------------------------------------------------------
// Base Zod schema for input validation
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export function validateInputs<
  TBody extends Record<string, unknown>,
  TConfig = Record<string, unknown>,
  TConnectionConfig = Record<string, unknown>,
>(
  inputs: RouterTransformationRequestData[],
  integration: BatchDestination<TBody, TConfig, TConnectionConfig>,
): { valid: RouterTransformationRequestData[]; errors: (TransformError & { jobId: number })[] } {
  const schema = integration.getInputSchema();

  const valid: RouterTransformationRequestData[] = [];
  const errors: (TransformError & { jobId: number })[] = [];

  for (const input of inputs) {
    const parseResult = schema.safeParse(input);
    if (!parseResult.success) {
      const errorMessage = [
        ...new Set(
          parseResult.error.issues.map((issue) => {
            const path = issue.path.length > 0 ? `${issue.path.join('.')}: ` : '';
            return `${path}${issue.message}`;
          }),
        ),
      ].join('; ');
      errors.push({
        jobId: input.metadata.jobId ?? 0,
        error: errorMessage,
        statusCode: 400,
        statTags: {
          errorCategory: tags.ERROR_CATEGORIES.DATA_VALIDATION,
          errorType: tags.ERROR_TYPES.INSTRUMENTATION,
        },
      });
    } else {
      valid.push(input);
    }
  }

  return { valid, errors };
}

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

export function groupByDontBatchDirective(inputs: RouterTransformationRequestData[]): {
  batchableEvents: RouterTransformationRequestData[];
  nonBatchableEvents: RouterTransformationRequestData[];
} {
  const batchableEvents: RouterTransformationRequestData[] = [];
  const nonBatchableEvents: RouterTransformationRequestData[] = [];
  for (const input of inputs) {
    if (input.metadata?.dontBatch === true) {
      nonBatchableEvents.push(input);
    } else {
      batchableEvents.push(input);
    }
  }
  return { batchableEvents, nonBatchableEvents };
}

export function resolveMetadata(
  jobIds: Set<number>,
  metadataMap: Map<number, Metadata>,
): Metadata[] {
  return Array.from(jobIds).map((id) => {
    const metadata = metadataMap.get(id);
    if (!metadata) {
      throw new Error(`Missing metadata for jobId ${id}`);
    }
    return metadata;
  });
}

type RequestGroup<TBody extends Record<string, unknown>> = {
  endpoint: string;
  method: string;
  headers: Record<string, unknown> | undefined;
  params: Record<string, unknown> | undefined;
  payloads: TransformResult<TBody>['successPayloads'];
};

export function groupPayloadsByCompositeKey<
  TBody extends Record<string, unknown> = Record<string, unknown>,
>(payloads: TransformResult<TBody>['successPayloads']): RequestGroup<TBody>[] {
  const map = new Map<string, RequestGroup<TBody>>();

  for (const payload of payloads) {
    const key = stableStringify({
      endpoint: payload.endpoint,
      method: payload.method,
      headers: payload.headers ?? {},
      params: payload.params ?? {},
      internalGroupKey: payload.internalGroupKey ?? '',
    });

    let group = map.get(key);
    if (!group) {
      group = {
        endpoint: payload.endpoint,
        method: payload.method,
        headers: payload.headers,
        params: payload.params,
        payloads: [],
      };
      map.set(key, group);
    }
    group.payloads.push(payload);
  }

  return Array.from(map.values());
}

// ---------------------------------------------------------------------------
// Server format conversion
// ---------------------------------------------------------------------------

function mapSuccessPayloadToServerFormat(
  batchResult: { body: Record<string, unknown>; jobIds: Set<number> },
  endpoint: string,
  method: string,
  headers: Record<string, unknown> | undefined,
  params: Record<string, unknown> | undefined,
  metadataMap: Map<number, Metadata>,
  destination: Destination,
  bodyFormat: BodyFormat,
): RouterTransformationResponse {
  return {
    batchedRequest: {
      version: '1',
      type: 'REST',
      method,
      endpoint,
      headers: headers ?? {},
      params: params ?? {},
      body: {
        JSON: bodyFormat === BodyFormat.JSON ? batchResult.body : {},
        JSON_ARRAY: bodyFormat === BodyFormat.JSON_ARRAY ? batchResult.body : {},
        XML: bodyFormat === BodyFormat.XML ? batchResult.body : {},
        FORM: bodyFormat === BodyFormat.FORM ? batchResult.body : {},
      },
      files: {},
    },
    metadata: resolveMetadata(batchResult.jobIds, metadataMap),
    destination,
    batched: true,
    statusCode: 200,
  };
}

// ---------------------------------------------------------------------------
// Error event conversion
// ---------------------------------------------------------------------------

function mapErrorPayloadToServerFormat(
  errorPayloads: TransformResult['errorPayloads'],
  metadataMap: Map<number, Metadata>,
  destination: Destination,
): RouterTransformationResponse[] {
  return errorPayloads.map((err) => ({
    metadata: resolveMetadata(new Set([err.jobId]), metadataMap),
    destination,
    batched: false,
    statusCode: err.statusCode,
    error: err.error,
    statTags: err.statTags,
  }));
}

// ---------------------------------------------------------------------------
// Main orchestration function
// ---------------------------------------------------------------------------

export async function processBatchedDestination<
  TBody extends Record<string, unknown> = Record<string, unknown>,
  TConfig = Record<string, unknown>,
  TConnectionConfig = Record<string, unknown>,
>(
  events: RouterTransformationRequestData[],
  IntegrationClass: BatchDestinationConstructor<TBody, TConfig, TConnectionConfig>,
  reqMetadata: NonNullable<unknown>,
): Promise<RouterTransformationResponse[]> {
  if (events.length === 0) {
    return [];
  }
  const { destination } = events[0];
  const connection = events.find((event) => event.connection)?.connection as
    | Connection<TConnectionConfig>
    | undefined;
  const integration = new IntegrationClass(destination as Destination<TConfig>, connection);
  const destType = destination.DestinationDefinition?.Name?.toUpperCase() ?? 'unknown';
  const { workspaceId } = events[0].metadata;
  const metricTags = { destType, workspaceId, destinationId: destination.ID };

  // 1. Build metadata map
  const metadataMap = new Map<number, Metadata>();
  for (const event of events) {
    const { metadata } = event;
    metadataMap.set(metadata.jobId!, metadata);
  }

  // 2. Validate inputs
  const { valid: validInputs, errors: validationErrors } = validateInputs(events, integration);
  const allErrors: TransformResult<TBody>['errorPayloads'] = [...validationErrors];

  if (validInputs.length === 0) {
    return mapErrorPayloadToServerFormat(allErrors, metadataMap, destination);
  }

  // 3. Split on dontBatch flag
  const { batchableEvents, nonBatchableEvents } = groupByDontBatchDirective(validInputs);

  // Metric: dontBatch overhead
  if (nonBatchableEvents.length > 0) {
    stats.counter('dont_batch_events', nonBatchableEvents.length, metricTags);
  }

  // 4. Transform all events (batchable + nonBatchable)
  const batchablePayloads: TransformResult<TBody>['successPayloads'] = [];
  const nonBatchablePayloads: TransformResult<TBody>['successPayloads'] = [];

  if (batchableEvents.length > 0) {
    const batchResult = await integration.transformEvents(batchableEvents, reqMetadata);
    batchablePayloads.push(...batchResult.successPayloads);
    allErrors.push(...batchResult.errorPayloads);
  }

  for (const nonBatchableEvent of nonBatchableEvents) {
    // eslint-disable-next-line no-await-in-loop
    const singleResult = await integration.transformEvents([nonBatchableEvent], reqMetadata);
    nonBatchablePayloads.push(...singleResult.successPayloads);
    allErrors.push(...singleResult.errorPayloads);
  }

  // 5. Convert all errors to responses
  const errorResponses = mapErrorPayloadToServerFormat(allErrors, metadataMap, destination);

  // 6. Remove failed jobIds from payloads before building success responses.
  // This handles the multiplexing case: if transformEvent for jobId=1 produces
  // payloads for both /track and /identify endpoints, and the /identify payload
  // fails, jobId=1 must be removed from the /track payloads too — a partially
  // delivered multiplexed event is invalid. Without this filter, the failed
  // event's body would still appear in the batched request for the other endpoint.
  const failedJobIds = new Set(allErrors.map((e) => e.jobId));
  const successBatchablePayloads = batchablePayloads.filter((p) => !failedJobIds.has(p.jobId));
  const successNonBatchablePayloads = nonBatchablePayloads.filter(
    (p) => !failedJobIds.has(p.jobId),
  );

  // 7. Build request groups:
  // - Batchable payloads are grouped by composite key (endpoint, method, headers, params)
  // - NonBatchable payloads each form their own group to prevent merging with other events
  const batchableGroups = groupPayloadsByCompositeKey(successBatchablePayloads);
  const nonBatchableGroups = successNonBatchablePayloads.flatMap((payload) =>
    groupPayloadsByCompositeKey([payload]),
  );
  const allGroups = [...batchableGroups, ...nonBatchableGroups];

  // 8. Apply batch strategy to each group and convert to server format
  const successResponses: RouterTransformationResponse[] = [];
  for (const group of allGroups) {
    const strategy = integration.getBatchStrategy(group.endpoint);
    // eslint-disable-next-line no-await-in-loop
    const batchResults = await strategy.batch(group.payloads);

    for (const batchResult of batchResults) {
      stats.histogram('output_batch_size', batchResult.jobIds.size, metricTags);

      successResponses.push(
        mapSuccessPayloadToServerFormat(
          batchResult,
          group.endpoint,
          group.method,
          group.headers,
          group.params,
          metadataMap,
          destination,
          strategy.bodyFormat,
        ),
      );
    }
  }

  // 9. Merge success responses that share jobIds (multiplexed events across groups)

  return [...combineBatchRequestsWithSameJobIds(successResponses), ...errorResponses];
}
