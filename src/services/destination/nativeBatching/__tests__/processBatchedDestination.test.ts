import { z } from 'zod';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import { processBatchedDestination } from '../processBatchedDestination';
import {
  BatchDestination,
  TransformedEvent,
  ChunkBatchStrategy,
  CustomBatchStrategy,
} from '../batchDestination';
import type { BatchStrategy } from '../batchDestination';
import type {
  ProcessorTransformationOutput,
  RouterTransformationRequestData,
} from '../../../../types/destinationTransformation';
import type { Destination } from '../../../../types/controlPlaneConfig';
import type { Metadata, RudderMessage } from '../../../../types/rudderEvents';

// ---------------------------------------------------------------------------
// Test types
// ---------------------------------------------------------------------------

type TestBody = { value: string };

interface TestMessage extends RudderMessage {
  data?: string;
  shouldFail?: boolean;
}

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

const mockDestination: Destination = {
  ID: 'dest-1',
  Config: { apiKey: 'test-key' },
  DestinationDefinition: { ID: 'destDef-1', Name: 'TEST', DisplayName: 'Test', Config: {} },
  Name: 'test-dest',
  Enabled: true,
  WorkspaceID: 'ws-1',
  Transformations: [],
};

class SimpleIntegration extends BatchDestination<TestBody> {
  transformEvent(input: RouterTransformationRequestData): TransformedEvent<TestBody> {
    const message = input.message as TestMessage;
    return {
      body: { value: message.data ?? '' },
      endpoint: 'https://api.test.com/events',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };
  }

  getBatchStrategy(): BatchStrategy<TestBody> {
    return new ChunkBatchStrategy({
      maxItems: 3,
      wrapBody: (bodies) => ({ events: bodies }),
    });
  }

  getInputSchema() {
    return z.object({}).passthrough();
  }
}

class MultiEndpointIntegration extends BatchDestination<TestBody> {
  transformEvent(input: RouterTransformationRequestData): TransformedEvent<TestBody> {
    const message = input.message as TestMessage;
    return {
      body: { value: message.data ?? '' },
      endpoint:
        message.type === 'track' ? 'https://api.test.com/track' : 'https://api.test.com/identify',
      method: 'POST',
    };
  }

  getBatchStrategy(endpoint: string): BatchStrategy<TestBody> {
    if (endpoint.includes('/track')) {
      return new ChunkBatchStrategy({ maxItems: 2, wrapBody: (bodies) => ({ tracks: bodies }) });
    }
    return new ChunkBatchStrategy({ maxItems: 2, wrapBody: (bodies) => ({ identifies: bodies }) });
  }

  getInputSchema() {
    return z.object({}).passthrough();
  }
}

class PartialFailIntegration extends BatchDestination<TestBody> {
  transformEvent(input: RouterTransformationRequestData): TransformedEvent<TestBody> {
    const message = input.message as TestMessage;
    if (message.shouldFail) {
      throw new Error('Transform failed');
    }
    return {
      body: { value: 'ok' },
      endpoint: 'https://api.test.com/events',
      method: 'POST',
    };
  }

  getBatchStrategy(): BatchStrategy<TestBody> {
    return new ChunkBatchStrategy({ wrapBody: (bodies) => ({ events: bodies }) });
  }

  getInputSchema() {
    return z.object({}).passthrough();
  }
}

class CustomBatchIntegration extends BatchDestination<TestBody> {
  transformEvent(input: RouterTransformationRequestData): TransformedEvent<TestBody> {
    const message = input.message as TestMessage;
    return {
      body: { value: message.data ?? '' },
      endpoint: 'https://api.test.com/merge',
      method: 'POST',
    };
  }

  getBatchStrategy(): BatchStrategy<TestBody> {
    return new CustomBatchStrategy((payloads) => {
      const merged = payloads.map((p) => p.body.value).join(',');
      return [
        {
          body: { merged },
          jobIds: new Set(payloads.map((p) => p.jobId)),
        },
      ];
    });
  }

  getInputSchema() {
    return z.object({}).passthrough();
  }
}

class TypedErrorIntegration extends BatchDestination<TestBody> {
  transformEvent(input: RouterTransformationRequestData): TransformedEvent<TestBody> {
    const message = input.message as TestMessage;
    if (message.shouldFail) {
      throw new InstrumentationError('missing required field');
    }
    return {
      body: { value: 'ok' },
      endpoint: 'https://api.test.com/events',
      method: 'POST',
    };
  }

  getBatchStrategy(): BatchStrategy<TestBody> {
    return new ChunkBatchStrategy({ wrapBody: (bodies) => ({ events: bodies }) });
  }

  getInputSchema() {
    return z.object({}).passthrough();
  }
}

function makeInput(
  jobId: number,
  data: string,
  opts?: { type?: string; dontBatch?: boolean; shouldFail?: boolean },
): RouterTransformationRequestData {
  const message: TestMessage = {
    data,
    type: (opts?.type || 'track') as TestMessage['type'],
    shouldFail: opts?.shouldFail,
  };
  const metadata: Metadata = {
    jobId,
    workspaceId: 'ws-1',
    sourceId: 'src-1',
    sourceType: 'web',
    sourceCategory: 'cloud',
    destinationId: 'dest-1',
    destinationType: 'TEST',
    messageId: `msg-${jobId}`,
    dontBatch: opts?.dontBatch,
  };
  return { message, metadata, destination: mockDestination };
}

function getBatchedRequestBody(result: {
  batchedRequest?: ProcessorTransformationOutput | ProcessorTransformationOutput[];
}) {
  const req = result.batchedRequest as ProcessorTransformationOutput;
  return req?.body?.JSON;
}

function getBatchedRequestEndpoint(result: {
  batchedRequest?: ProcessorTransformationOutput | ProcessorTransformationOutput[];
}) {
  const req = result.batchedRequest as ProcessorTransformationOutput;
  return req?.endpoint;
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
      expect(getBatchedRequestBody(chunk1)!.events).toHaveLength(3);
      expect(chunk1.metadata).toHaveLength(3);

      const chunk2 = results[1];
      expect(getBatchedRequestBody(chunk2)!.events).toHaveLength(2);
      expect(chunk2.metadata).toHaveLength(2);
    });

    it('produces correct server format envelope', async () => {
      const inputs = [makeInput(1, 'hello')];
      const results = await processBatchedDestination(inputs, SimpleIntegration, {});

      expect(results).toHaveLength(1);
      const resp = results[0];
      const req = resp.batchedRequest as ProcessorTransformationOutput;
      expect(req.version).toBe('1');
      expect(req.type).toBe('REST');
      expect(req.method).toBe('POST');
      expect(req.endpoint).toBe('https://api.test.com/events');
      expect(req.headers).toEqual({ 'Content-Type': 'application/json' });
      expect(req.body?.JSON).toEqual({ events: [{ value: 'hello' }] });
      expect(req.body?.JSON_ARRAY).toEqual({});
      expect(req.body?.XML).toEqual({});
      expect(req.body?.FORM).toEqual({});
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

      const trackResults = results.filter((r) => getBatchedRequestEndpoint(r)?.includes('/track'));
      const identifyResults = results.filter((r) =>
        getBatchedRequestEndpoint(r)?.includes('/identify'),
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
      expect(getBatchedRequestBody(results[0])).toEqual({ merged: 'a,b,c' });
      expect(results[0].metadata).toHaveLength(3);
    });
  });

  describe('dontBatch flag', () => {
    it('processes dontBatch events individually', async () => {
      const inputs = [makeInput(1, 'a'), makeInput(2, 'b', { dontBatch: true }), makeInput(3, 'c')];

      const results = await processBatchedDestination(inputs, SimpleIntegration, {});

      const allJobIds = results.flatMap((r) => r.metadata.map((m) => m.jobId));
      expect(allJobIds).toContain(1);
      expect(allJobIds).toContain(2);
      expect(allJobIds).toContain(3);
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
          message: {},
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
      const inputs = [
        makeInput(1, 'ok'),
        makeInput(2, 'fail', { shouldFail: true }),
        makeInput(3, 'ok2'),
      ];

      const results = await processBatchedDestination(inputs, PartialFailIntegration, {});

      const successes = results.filter((r) => r.statusCode === 200);
      const errors = results.filter((r) => r.statusCode !== 200);

      expect(errors).toHaveLength(1);
      expect(errors[0].metadata[0].jobId).toBe(2);

      const successJobIds = successes.flatMap((r) => r.metadata.map((m) => m.jobId));
      expect(successJobIds).not.toContain(2);
      expect(successJobIds).toContain(1);
      expect(successJobIds).toContain(3);
    });
  });
});
