import type { Destination } from '../../../types/controlPlaneConfig';
import type { Metadata } from '../../../types/rudderEvents';
import type {
  RouterTransformationRequestData,
  RouterTransformationResponse,
} from '../../../types/destinationTransformation';
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
import { combineBatchRequestsWithSameJobIds } from '../../../v0/util';

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
  reqMetadata: NonNullable<unknown>,
): Promise<RouterTransformationResponse[]> {
  if (events.length === 0) {
    return [];
  }
  const { destination } = events[0];
  const integration = new IntegrationClass(destination);

  // 1. Build metadata map
  const metadataMap = new Map<number, Partial<Metadata>>();
  for (const event of events) {
    const metadata = event.metadata as Partial<Metadata>;
    metadataMap.set(metadata.jobId!, metadata);
  }

  // 2. Validate inputs
  const { valid: validInputs, errors: validationErrors } = integration.validate(events);
  const allErrors: TransformResult<TBody>['errorEvents'] = [...validationErrors];

  if (validInputs.length === 0) {
    return convertErrorEventsToResponses(allErrors, metadataMap, destination);
  }

  // 3. Split on dontBatch flag
  const { batchableEvents, nonBatchableEvents } = groupByDontBatchDirective(validInputs);

  // 4. Transform all events (batchable + nonBatchable)
  let batchablePayloads: TransformedEvent<TBody>[] = [];
  let nonBatchablePayloads: TransformedEvent<TBody>[] = [];

  if (batchableEvents.length > 0) {
    const batchResult = await integration.transformEvents(batchableEvents, reqMetadata);
    batchablePayloads.push(...batchResult.payloads);
    allErrors.push(...batchResult.errorEvents);
  }

  for (const nonBatchableEvent of nonBatchableEvents) {
    // eslint-disable-next-line no-await-in-loop
    const singleResult = await integration.transformEvents([nonBatchableEvent], reqMetadata);
    nonBatchablePayloads.push(...singleResult.payloads);
    allErrors.push(...singleResult.errorEvents);
  }

  // 5. Convert all errors to responses
  const errorResponses = convertErrorEventsToResponses(allErrors, metadataMap, destination);

  // 6. Remove failed jobIds from payloads before building success responses.
  // This handles the multiplexing case: if transformEvent for jobId=1 produces
  // payloads for both /track and /identify endpoints, and the /identify payload
  // fails, jobId=1 must be removed from the /track payloads too — a partially
  // delivered multiplexed event is invalid. Without this filter, the failed
  // event's body would still appear in the batched request for the other endpoint.
  const failedJobIds = new Set(allErrors.map((e) => e.jobId));
  if (failedJobIds.size > 0) {
    batchablePayloads = batchablePayloads.filter((p) => !failedJobIds.has(p.jobId));
    nonBatchablePayloads = nonBatchablePayloads.filter((p) => !failedJobIds.has(p.jobId));
  }

  // 7. Convert nonBatchable payloads to individual responses
  const successResponses: RouterTransformationResponse[] = [];
  for (const payload of nonBatchablePayloads) {
    const strategy = integration.getBatchStrategy(payload.endpoint);
    let wrappedBody: Record<string, unknown>;
    if (strategy.type === 'chunk') {
      wrappedBody = strategy.wrapBody([payload.body]);
    } else {
      const [result] = strategy.batch([payload]);
      wrappedBody = result.body;
    }
    successResponses.push(
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

  // 8. Group batchable payloads by composite key and apply batch strategy
  if (batchablePayloads.length > 0) {
    const groups = groupPayloadsByCompositeKey(batchablePayloads);

    for (const group of groups) {
      const strategy = integration.getBatchStrategy(group.endpoint);

      const batchResults =
        strategy.type === 'chunk'
          ? applyChunkStrategy(group.payloads, strategy)
          : strategy.batch(group.payloads);

      for (const batchResult of batchResults) {
        successResponses.push(
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
  }

  // 9. Merge success responses that share jobIds (multiplexed events across groups)
  return [...combineBatchRequestsWithSameJobIds(successResponses), ...errorResponses];
}
