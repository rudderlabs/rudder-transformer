import type { Destination } from '../../types/controlPlaneConfig';
import type { Metadata } from '../../types/rudderEvents';
import type {
  RouterTransformationRequestData,
  RouterTransformationResponse,
} from '../../types/destinationTransformation';
import {
  RouterIntegration,
  RouterIntegrationConstructor,
  TransformedPayload,
  TransformResult,
  ChunkStrategy,
  groupByDontBatchDirective,
  groupPayloadsByCompositeKey,
  resolveMetadatas,
  parseSizeToBytes,
} from './routerIntegration';
import { combineBatchRequestsWithSameJobIds } from '../../v0/util';

// ---------------------------------------------------------------------------
// Chunk strategy application
// ---------------------------------------------------------------------------

function applyChunkStrategy<TBody extends Record<string, unknown>>(
  payloads: TransformedPayload<TBody>[],
  strategy: ChunkStrategy<TBody>,
): { body: Record<string, unknown>; jobIds: Set<number> }[] {
  const maxSize = strategy.maxSize ?? Infinity;
  const maxBytes = strategy.maxBytes ? parseSizeToBytes(strategy.maxBytes) : Infinity;
  const results: { body: Record<string, unknown>; jobIds: Set<number> }[] = [];

  let currentBodies: TBody[] = [];
  let currentJobIds = new Set<number>();
  let currentBytes = 0;

  const flush = () => {
    if (currentBodies.length > 0) {
      results.push({
        body: strategy.wrapBody(currentBodies),
        jobIds: new Set(currentJobIds),
      });
      currentBodies = [];
      currentJobIds = new Set();
      currentBytes = 0;
    }
  };

  for (const payload of payloads) {
    const itemBytes = Buffer.byteLength(JSON.stringify(payload.body));

    if (
      currentBodies.length > 0 &&
      (currentBodies.length >= maxSize || currentBytes + itemBytes > maxBytes)
    ) {
      flush();
    }

    currentBodies.push(payload.body);
    currentJobIds.add(payload.jobId);
    currentBytes += itemBytes;
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
  integration: RouterIntegration<TBody>,
): RouterTransformationResponse {
  return {
    batchedRequest: {
      version: '1',
      type: 'REST',
      method,
      endpoint,
      headers: headers ?? {},
      params: params ?? {},
      body: integration.buildRequestBody(batchResult.body),
      files: {},
    },
    metadata: resolveMetadatas(batchResult.jobIds, metadataMap),
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
    metadata: resolveMetadatas(new Set([err.jobId]), metadataMap),
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
  IntegrationClass: RouterIntegrationConstructor<TBody>,
  reqMetadata?: NonNullable<unknown>,
): Promise<RouterTransformationResponse[]> {
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
  const validInputs = integration.validate(events, results);
  if (validInputs.length === 0) {
    return results;
  }

  // 3. Split on dontBatch flag
  const { batchable, nonBatchable } = groupByDontBatchDirective(validInputs);

  // 4. Transform
  const allPayloads: TransformedPayload<TBody>[] = [];
  const allErrors: TransformResult<TBody>['errorEvents'] = [];

  if (batchable.length > 0) {
    const batchResult = await integration.batchTransform(batchable, reqMetadata);
    allPayloads.push(...batchResult.payloads);
    allErrors.push(...batchResult.errorEvents);
  }

  for (const single of nonBatchable) {
    // eslint-disable-next-line no-await-in-loop
    const singleResult = await integration.batchTransform([single], reqMetadata);
    allPayloads.push(...singleResult.payloads);
    allErrors.push(...singleResult.errorEvents);
  }

  // 5. Convert error events to responses
  if (allErrors.length > 0) {
    results.push(...convertErrorEventsToResponses(allErrors, metadataMap, destination));
  }

  if (allPayloads.length === 0) {
    return results;
  }

  // 6. Group payloads by composite key
  const groups = groupPayloadsByCompositeKey(allPayloads);

  // 7. Apply batch strategy to each group
  for (const group of groups) {
    const strategy = integration.getBatchStrategy(group.endpoint);

    let batchResults: { body: Record<string, unknown>; jobIds: Set<number> }[];

    if (strategy.type === 'chunk') {
      batchResults = applyChunkStrategy(group.payloads, strategy);
    } else {
      batchResults = strategy.batch(group.payloads);
    }

    // 8. Convert to server format
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

  // 9. Merge responses that share jobIds (multiplexed events across groups)
  return combineBatchRequestsWithSameJobIds(results);
}
