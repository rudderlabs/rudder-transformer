import { InstrumentationError } from '@rudderstack/integrations-lib';
import { processBatchedDestination } from '../processBatchedDestination';
import {
  BatchDestination,
  TransformedEvent,
  BatchStrategy,
  chunk,
  customBatch,
} from '../routerIntegration';
import type { RouterTransformationRequestData } from '../../../../types/destinationTransformation';
import type { Destination } from '../../../../types/controlPlaneConfig';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

type TestBody = { value: string };

const mockDestination = {
  ID: 'dest-1',
  Config: { apiKey: 'test-key' },
  DestinationDefinition: { Name: 'TEST' },
} as unknown as Destination;

class SimpleIntegration extends BatchDestination<TestBody> {
  transformEvent(
    input: RouterTransformationRequestData,
  ): Omit<TransformedEvent<TestBody>, 'jobId'> {
    return {
      body: { value: (input.message as any).data },
      endpoint: 'https://api.test.com/events',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };
  }

  getBatchStrategy(): BatchStrategy<TestBody> {
    return chunk({
      maxItems: 3,
      wrapBody: (bodies) => ({ events: bodies }),
    });
  }
}

class MultiEndpointIntegration extends BatchDestination<TestBody> {
  transformEvent(
    input: RouterTransformationRequestData,
  ): Omit<TransformedEvent<TestBody>, 'jobId'> {
    const type = (input.message as any).type;
    return {
      body: { value: (input.message as any).data },
      endpoint: type === 'track' ? 'https://api.test.com/track' : 'https://api.test.com/identify',
      method: 'POST',
    };
  }

  getBatchStrategy(endpoint: string): BatchStrategy<TestBody> {
    if (endpoint.includes('/track')) {
      return chunk({ maxItems: 2, wrapBody: (bodies) => ({ tracks: bodies }) });
    }
    return chunk({ maxItems: 2, wrapBody: (bodies) => ({ identifies: bodies }) });
  }
}

class PartialFailIntegration extends BatchDestination<TestBody> {
  transformEvent(
    input: RouterTransformationRequestData,
  ): Omit<TransformedEvent<TestBody>, 'jobId'> {
    if (input.message.shouldFail) {
      throw new Error('Transform failed');
    }
    return {
      body: { value: 'ok' },
      endpoint: 'https://api.test.com/events',
      method: 'POST',
    };
  }

  getBatchStrategy(): BatchStrategy<TestBody> {
    return chunk({ wrapBody: (bodies) => ({ events: bodies }) });
  }
}

class CustomBatchIntegration extends BatchDestination<TestBody> {
  transformEvent(
    input: RouterTransformationRequestData,
  ): Omit<TransformedEvent<TestBody>, 'jobId'> {
    return {
      body: { value: (input.message as any).data },
      endpoint: 'https://api.test.com/merge',
      method: 'POST',
    };
  }

  getBatchStrategy(): BatchStrategy<TestBody> {
    return customBatch((payloads) => {
      const merged = payloads.map((p) => p.body.value).join(',');
      return [
        {
          body: { merged },
          jobIds: new Set(payloads.map((p) => p.jobId)),
        },
      ];
    });
  }
}

function makeInput(
  jobId: number,
  data: string,
  opts?: { type?: string; dontBatch?: boolean; shouldFail?: boolean },
): RouterTransformationRequestData {
  return {
    message: { data, type: opts?.type || 'track', shouldFail: opts?.shouldFail } as any,
    metadata: {
      jobId,
      workspaceId: 'ws-1',
      sourceId: 'src-1',
      sourceType: 'web',
      sourceCategory: 'cloud',
      destinationId: 'dest-1',
      destinationType: 'TEST',
      messageId: `msg-${jobId}`,
      dontBatch: opts?.dontBatch,
    } as any,
    destination: mockDestination,
  } as RouterTransformationRequestData;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('processBatchedDestination', () => {
  describe('chunk strategy', () => {
    it('batches events into chunks respecting maxItems', async () => {
      const inputs = [
        makeInput(1, 'a'),
        makeInput(2, 'b'),
        makeInput(3, 'c'),
        makeInput(4, 'd'),
        makeInput(5, 'e'),
      ];

      const results = await processBatchedDestination(inputs, SimpleIntegration, {});

      // maxItems=3 → 2 chunks: [a,b,c] and [d,e]
      expect(results).toHaveLength(2);

      const chunk1 = results[0];
      expect(chunk1.statusCode).toBe(200);
      expect(chunk1.batched).toBe(true);
      expect((chunk1.batchedRequest as any).body.JSON.events).toHaveLength(3);
      expect(chunk1.metadata).toHaveLength(3);

      const chunk2 = results[1];
      expect((chunk2.batchedRequest as any).body.JSON.events).toHaveLength(2);
      expect(chunk2.metadata).toHaveLength(2);
    });

    it('produces correct server format envelope', async () => {
      const inputs = [makeInput(1, 'hello')];
      const results = await processBatchedDestination(inputs, SimpleIntegration, {});

      expect(results).toHaveLength(1);
      const resp = results[0];
      const req = resp.batchedRequest as any;
      expect(req.version).toBe('1');
      expect(req.type).toBe('REST');
      expect(req.method).toBe('POST');
      expect(req.endpoint).toBe('https://api.test.com/events');
      expect(req.headers).toEqual({ 'Content-Type': 'application/json' });
      expect(req.body.JSON).toEqual({ events: [{ value: 'hello' }] });
      expect(req.body.JSON_ARRAY).toEqual({});
      expect(req.body.XML).toEqual({});
      expect(req.body.FORM).toEqual({});
      expect(req.files).toEqual({});
      expect(resp.destination).toBe(mockDestination);
    });
  });

  describe('multi-endpoint grouping', () => {
    it('groups payloads by endpoint and applies different strategies', async () => {
      const inputs = [
        makeInput(1, 'a', { type: 'track' }),
        makeInput(2, 'b', { type: 'identify' }),
        makeInput(3, 'c', { type: 'track' }),
        makeInput(4, 'd', { type: 'identify' }),
        makeInput(5, 'e', { type: 'track' }),
      ];

      const results = await processBatchedDestination(inputs, MultiEndpointIntegration, {});

      // track: 3 events, maxItems=2 → 2 chunks
      // identify: 2 events, maxItems=2 → 1 chunk
      expect(results).toHaveLength(3);

      const trackResults = results.filter((r) =>
        (r.batchedRequest as any)?.endpoint?.includes('/track'),
      );
      const identifyResults = results.filter((r) =>
        (r.batchedRequest as any)?.endpoint?.includes('/identify'),
      );

      expect(trackResults).toHaveLength(2);
      expect(identifyResults).toHaveLength(1);
    });
  });

  describe('customBatch strategy', () => {
    it('uses custom batch function for merging', async () => {
      const inputs = [makeInput(1, 'a'), makeInput(2, 'b'), makeInput(3, 'c')];
      const results = await processBatchedDestination(inputs, CustomBatchIntegration, {});

      expect(results).toHaveLength(1);
      expect((results[0].batchedRequest as any).body.JSON).toEqual({ merged: 'a,b,c' });
      expect(results[0].metadata).toHaveLength(3);
    });
  });

  describe('dontBatch flag', () => {
    it('processes dontBatch events via individual batchTransform calls', async () => {
      // dontBatch ensures each nonBatchable event gets its own batchTransform() call
      // (important for pre-batch operations like dedup), but after transformation
      // all payloads are grouped by composite key for final batching
      const inputs = [makeInput(1, 'a'), makeInput(2, 'b', { dontBatch: true }), makeInput(3, 'c')];

      const results = await processBatchedDestination(inputs, SimpleIntegration, {});

      // All 3 events share the same endpoint, and maxItems=3 fits them all
      const allJobIds = results.flatMap((r) => r.metadata.map((m) => m.jobId));
      expect(allJobIds).toContain(1);
      expect(allJobIds).toContain(2);
      expect(allJobIds).toContain(3);
      // All events are present in the output
      expect(allJobIds).toHaveLength(3);
    });
  });

  describe('error handling', () => {
    it('collects transform errors alongside successes', async () => {
      const inputs = [
        makeInput(1, 'ok'),
        makeInput(2, 'fail', { shouldFail: true }),
        makeInput(3, 'ok2'),
      ];

      const results = await processBatchedDestination(inputs, PartialFailIntegration, {});

      const successes = results.filter((r) => r.statusCode === 200);
      const errors = results.filter((r) => r.statusCode !== 200);

      expect(successes).toHaveLength(1);
      expect(errors).toHaveLength(1);
      expect(errors[0].error).toBe('Transform failed');
      expect(errors[0].metadata[0].jobId).toBe(2);
    });
  });

  describe('validation', () => {
    it('rejects events failing base schema and returns error responses', async () => {
      const inputs = [
        makeInput(1, 'valid'),
        {
          message: {}, // missing type
          metadata: { jobId: 2 },
          destination: mockDestination,
        } as unknown as RouterTransformationRequestData,
      ];

      const results = await processBatchedDestination(inputs, SimpleIntegration, {});

      const successes = results.filter((r) => r.statusCode === 200);
      const errors = results.filter((r) => r.statusCode === 400);

      expect(successes).toHaveLength(1);
      expect(errors).toHaveLength(1);
      expect(errors[0].statTags).toMatchObject({
        errorCategory: 'dataValidation',
        errorType: 'instrumentation',
      });
    });
  });

  describe('metadata resolution', () => {
    it('resolves correct metadata for each chunk', async () => {
      const inputs = [makeInput(10, 'a'), makeInput(20, 'b')];
      const results = await processBatchedDestination(inputs, SimpleIntegration, {});

      expect(results).toHaveLength(1);
      const jobIds = results[0].metadata.map((m) => m.jobId);
      expect(jobIds).toEqual([10, 20]);
    });
  });

  describe('empty input', () => {
    it('returns empty array for no events', async () => {
      const results = await processBatchedDestination([], SimpleIntegration, {});
      expect(results).toEqual([]);
    });
  });

  describe('error taxonomy with typed errors', () => {
    class TypedErrorIntegration extends BatchDestination<TestBody> {
      transformEvent(
        input: RouterTransformationRequestData,
      ): Omit<TransformedEvent<TestBody>, 'jobId'> {
        if ((input.message as any).shouldFail) {
          throw new InstrumentationError('missing required field');
        }
        return {
          body: { value: 'ok' },
          endpoint: 'https://api.test.com/events',
          method: 'POST',
        };
      }

      getBatchStrategy(): BatchStrategy<TestBody> {
        return chunk({ wrapBody: (bodies) => ({ events: bodies }) });
      }
    }

    it('produces proper statTags from InstrumentationError via generateErrorObject', async () => {
      const inputs = [makeInput(1, 'ok'), makeInput(2, 'fail', { shouldFail: true })];
      const results = await processBatchedDestination(inputs, TypedErrorIntegration, {});

      const errors = results.filter((r) => r.statusCode !== 200);
      expect(errors).toHaveLength(1);
      expect(errors[0].statusCode).toBe(400);
      expect(errors[0].error).toContain('missing required field');
      expect(errors[0].statTags).toMatchObject({
        errorCategory: 'dataValidation',
        errorType: 'instrumentation',
      });
    });
  });

  describe('failed jobIds removed from success responses', () => {
    it('excludes failed jobIds from success response metadata', async () => {
      // PartialFailIntegration throws for events with shouldFail=true
      // jobId 2 fails, jobIds 1 and 3 succeed
      const inputs = [
        makeInput(1, 'ok'),
        makeInput(2, 'fail', { shouldFail: true }),
        makeInput(3, 'ok2'),
      ];

      const results = await processBatchedDestination(inputs, PartialFailIntegration, {});

      const successes = results.filter((r) => r.statusCode === 200);
      const errors = results.filter((r) => r.statusCode !== 200);

      // jobId 2 failed — should only appear in error responses
      expect(errors).toHaveLength(1);
      expect(errors[0].metadata[0].jobId).toBe(2);

      // jobId 2 should NOT appear in any success response metadata
      const successJobIds = successes.flatMap((r) => r.metadata.map((m) => m.jobId));
      expect(successJobIds).not.toContain(2);
      expect(successJobIds).toContain(1);
      expect(successJobIds).toContain(3);
    });
  });
});
