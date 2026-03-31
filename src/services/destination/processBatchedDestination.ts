import type { Destination } from '../../types/controlPlaneConfig';
import type { Metadata } from '../../types/rudderEvents';
import type {
  RouterTransformationRequestData,
  RouterTransformationResponse,
} from '../../types/destinationTransformation';
import {
  BatchDestination,
  BatchDestinationConstructor,
  TransformedEvent,
  TransformResult,
  ChunkStrategy,
  groupByDontBatchDirective,
  groupPayloadsByCompositeKey,
  resolveMetadata,
  parseSizeToBytes,
} from './routerIntegration';
import { combineBatchRequestsWithSameJobIds } from '../../v0/util';

// ---------------------------------------------------------------------------
// Chunk strategy application
// ---------------------------------------------------------------------------

function applyChunkStrategy<TBody extends Record<string, unknown>>(
  payloads: TransformedEvent<TBody>[],
  strategy: ChunkStrategy<TBody>,
): { body: Record<string, unknown>; jobIds: Set<number> }[] {
  const maxItems = strategy.maxItems ?? Infinity;
  const maxPayloadSize = strategy.maxPayloadSize
    ? parseSizeToBytes(strategy.maxPayloadSize)
    : Infinity;
  const results: { body: Record<string, unknown>; jobIds: Set<number> }[] = [];

  let currentBodies: TBody[] = [];
  let currentJobIds = new Set<number>();

  const flush = () => {
    if (currentBodies.length > 0) {
      results.push({
        body: strategy.wrapBody(currentBodies),
        jobIds: new Set(currentJobIds),
      });
      currentBodies = [];
      currentJobIds = new Set();
    }
  };

  for (const payload of payloads) {
    // Check maxItems before adding
    if (currentBodies.length > 0 && currentBodies.length >= maxItems) {
      flush();
    }

    // Check maxPayloadSize by measuring the prospective wrapped body size
    if (maxPayloadSize < Infinity && currentBodies.length > 0) {
      const prospectiveBytes = Buffer.byteLength(
        JSON.stringify(strategy.wrapBody([...currentBodies, payload.body])),
      );
      if (prospectiveBytes > maxPayloadSize) {
        flush();
      }
    }

    currentBodies.push(payload.body);
    currentJobIds.add(payload.jobId);
  }

  flush();
  return results;
}

// ---------------------------------------------------------------------------
// Server format conversion
// ---------------------------------------------------------------------------

function convertToServerFormat<TBody extends Record<string, unknown>>(
  batchResult: { body: Record<string, unknown>; jobIds: Set<number> },
  endpoint: string,
  method: string,
  headers: Record<string, unknown> | undefined,
  params: Record<string, unknown> | undefined,
  metadataMap: Map<number, Partial<Metadata>>,
  destination: Destination,
  integration: BatchDestination<TBody>,
): RouterTransformationResponse {
  return {
    batchedRequest: {
      version: '1',
      type: 'REST',
      method,
      endpoint,
      headers: headers ?? {},
      params: params ?? {},
      body: integration.wrapRequestBody(batchResult.body),
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

function convertErrorEventsToResponses(
  errorEvents: TransformResult['errorEvents'],
  metadataMap: Map<number, Partial<Metadata>>,
  destination: Destination,
): RouterTransformationResponse[] {
  return errorEvents.map((err) => ({
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
>(
  events: RouterTransformationRequestData[],
  IntegrationClass: BatchDestinationConstructor<TBody>,
  reqMetadata?: NonNullable<unknown>,
): Promise<RouterTransformationResponse[]> {
  if (events.length === 0) {
    return [];
  }
  const { destination } = events[0];
  const integration = new IntegrationClass(destination);
  const results: RouterTransformationResponse[] = [];

  // 1. Build metadata map
  const metadataMap = new Map<number, Partial<Metadata>>();
  for (const event of events) {
    const metadata = event.metadata as Partial<Metadata>;
    metadataMap.set(metadata.jobId!, metadata);
  }

  // 2. Validate inputs
  const { valid: validInputs, errors: validationErrors } = integration.validate(events);
  results.push(...validationErrors);
  if (validInputs.length === 0) {
    return results;
  }

  // 3. Split on dontBatch flag
  const { batchable, nonBatchable } = groupByDontBatchDirective(validInputs);

  // 4. Transform batchable events
  const batchablePayloads: TransformedEvent<TBody>[] = [];
  const allErrors: TransformResult<TBody>['errorEvents'] = [];

  if (batchable.length > 0) {
    const batchResult = await integration.transformEvents(batchable, reqMetadata);
    batchablePayloads.push(...batchResult.payloads);
    allErrors.push(...batchResult.errorEvents);
  }

  // 5. Transform nonBatchable events individually and convert each to its own response
  for (const single of nonBatchable) {
    // eslint-disable-next-line no-await-in-loop
    const singleResult = await integration.transformEvents([single], reqMetadata);
    allErrors.push(...singleResult.errorEvents);

    for (const payload of singleResult.payloads) {
      const strategy = integration.getBatchStrategy(payload.endpoint);
      const wrappedBody =
        strategy.type === 'chunk' ? strategy.wrapBody([payload.body]) : { ...payload.body };
      results.push(
        convertToServerFormat(
          { body: wrappedBody, jobIds: new Set([payload.jobId]) },
          payload.endpoint,
          payload.method,
          payload.headers,
          payload.params,
          metadataMap,
          destination,
          integration,
        ),
      );
    }
  }

  // 6. Convert error events to responses
  if (allErrors.length > 0) {
    results.push(...convertErrorEventsToResponses(allErrors, metadataMap, destination));
  }

  if (batchablePayloads.length === 0) {
    return results;
  }

  // 7. Group batchable payloads by composite key
  const groups = groupPayloadsByCompositeKey(batchablePayloads);

  // 8. Apply batch strategy to each group
  for (const group of groups) {
    const strategy = integration.getBatchStrategy(group.endpoint);

    let batchResults: { body: Record<string, unknown>; jobIds: Set<number> }[];

    if (strategy.type === 'chunk') {
      batchResults = applyChunkStrategy(group.payloads, strategy);
    } else {
      batchResults = strategy.batch(group.payloads);
    }

    // 9. Convert to server format
    for (const batchResult of batchResults) {
      results.push(
        convertToServerFormat(
          batchResult,
          group.endpoint,
          group.method,
          group.headers,
          group.params,
          metadataMap,
          destination,
          integration,
        ),
      );
    }
  }

  // 10. Separate success and error responses
  const successResults = results.filter((r) => !('error' in r));
  const errorResults = results.filter((r) => 'error' in r);

  // 11. For multiplexed events: if any output failed, the entire event should fail.
  // Collect all jobIds that appear in error responses.
  const failedJobIds = new Set<number>();
  for (const errResp of errorResults) {
    for (const meta of errResp.metadata) {
      if (meta.jobId != null) {
        failedJobIds.add(meta.jobId);
      }
    }
  }

  // Remove failed jobIds from success responses. If a success response loses
  // all its metadata entries, drop it entirely.
  const cleanedSuccessResults: RouterTransformationResponse[] = [];
  if (failedJobIds.size > 0) {
    for (const resp of successResults) {
      const cleanedMetadata = resp.metadata.filter((m) => !failedJobIds.has(m.jobId!));
      if (cleanedMetadata.length > 0) {
        cleanedSuccessResults.push({ ...resp, metadata: cleanedMetadata });
      }
    }
  } else {
    cleanedSuccessResults.push(...successResults);
  }

  // 12. Merge success responses that share jobIds (multiplexed events across groups)
  return [...combineBatchRequestsWithSameJobIds(cleanedSuccessResults), ...errorResults];
}
