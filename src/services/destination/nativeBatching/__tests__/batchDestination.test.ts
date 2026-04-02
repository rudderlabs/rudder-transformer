import { z } from 'zod';
import {
  BatchDestination,
  TransformedEvent,
  ChunkBatchStrategy,
  CustomBatchStrategy,
  parseSizeToBytes,
} from '../batchDestination';
import type { BatchStrategy } from '../batchDestination';
import {
  validateInputs,
  groupByDontBatchDirective,
  resolveMetadata,
  groupPayloadsByCompositeKey,
} from '../processBatchedDestination';
import type { TransformResult } from '../batchDestination';
import type { RouterTransformationRequestData } from '../../../../types/destinationTransformation';
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

class TestIntegration extends BatchDestination<TestBody> {
  transformEvent(input: RouterTransformationRequestData<TestMessage>): TransformedEvent<TestBody> {
    return {
      body: { value: input.message.data ?? '' },
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

class FailingIntegration extends BatchDestination<TestBody> {
  transformEvent(input: RouterTransformationRequestData<TestMessage>): TransformedEvent<TestBody> {
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
    return new ChunkBatchStrategy({ wrapBody: (bodies) => ({ events: bodies }) });
  }

  getInputSchema() {
    return z.object({}).passthrough();
  }
}

function makeInput(
  jobId: number,
  data: string,
  dontBatch?: boolean,
): RouterTransformationRequestData {
  const message: TestMessage = { data, type: 'track' };
  const metadata: Metadata = {
    jobId,
    workspaceId: 'ws-1',
    sourceId: 'src-1',
    sourceType: 'web',
    sourceCategory: 'cloud',
    destinationId: 'dest-1',
    destinationType: 'TEST',
    messageId: `msg-${jobId}`,
    dontBatch,
  };
  return { message, metadata, destination: mockDestination };
}

function makeMetadataMap(
  entries: Array<{ jobId: number; [key: string]: unknown }>,
): Map<number, Metadata> {
  const map = new Map<number, Metadata>();
  for (const { jobId, ...rest } of entries) {
    map.set(jobId, {
      jobId,
      sourceId: 'src-1',
      workspaceId: 'ws-1',
      sourceType: 'web',
      sourceCategory: 'cloud',
      destinationId: 'dest-1',
      destinationType: 'TEST',
      messageId: `msg-${jobId}`,
      ...rest,
    });
  }
  return map;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('parseSizeToBytes', () => {
  it.each([
    { input: '4MB', expected: 4 * 1024 * 1024 },
    { input: '512KB', expected: 512 * 1024 },
    { input: '1GB', expected: 1024 * 1024 * 1024 },
    { input: '100B', expected: 100 },
  ])('parses $input', ({ input, expected }) => {
    expect(parseSizeToBytes(input)).toBe(expected);
  });

  it('throws on invalid format', () => {
    expect(() => parseSizeToBytes('abc')).toThrow('Invalid size format');
  });
});

describe('groupByDontBatchDirective', () => {
  it('separates batchable and nonBatchable', () => {
    const inputs = [makeInput(1, 'a'), makeInput(2, 'b', true), makeInput(3, 'c')];
    const { batchableEvents, nonBatchableEvents } = groupByDontBatchDirective(inputs);
    expect(batchableEvents).toHaveLength(2);
    expect(nonBatchableEvents).toHaveLength(1);
    expect(nonBatchableEvents[0].metadata.jobId).toBe(2);
  });

  it('returns all batchable when no dontBatch flag', () => {
    const inputs = [makeInput(1, 'a'), makeInput(2, 'b')];
    const { batchableEvents, nonBatchableEvents } = groupByDontBatchDirective(inputs);
    expect(batchableEvents).toHaveLength(2);
    expect(nonBatchableEvents).toHaveLength(0);
  });
});

describe('resolveMetadata', () => {
  it('resolves jobIds to metadata objects', () => {
    const map = makeMetadataMap([
      { jobId: 1, userId: 'u1' },
      { jobId: 2, userId: 'u2' },
    ]);
    const result = resolveMetadata(new Set([1, 2]), map);
    expect(result).toHaveLength(2);
    expect(result[0].jobId).toBe(1);
  });

  it('throws on unknown jobId', () => {
    const map = makeMetadataMap([{ jobId: 1 }]);
    expect(() => resolveMetadata(new Set([1, 999]), map)).toThrow('Missing metadata for jobId 999');
  });
});

describe('groupPayloadsByCompositeKey', () => {
  it('groups payloads with same endpoint/method/headers/params', () => {
    const payloads: TransformResult<TestBody>['successPayloads'] = [
      {
        body: { value: 'a' },
        endpoint: 'https://a.com',
        method: 'POST',
        headers: { h: '1' },
        jobId: 1,
      },
      {
        body: { value: 'b' },
        endpoint: 'https://a.com',
        method: 'POST',
        headers: { h: '1' },
        jobId: 2,
      },
      {
        body: { value: 'c' },
        endpoint: 'https://b.com',
        method: 'POST',
        headers: { h: '1' },
        jobId: 3,
      },
    ];
    const groups = groupPayloadsByCompositeKey(payloads);
    expect(groups).toHaveLength(2);
    expect(groups[0].payloads).toHaveLength(2);
    expect(groups[1].payloads).toHaveLength(1);
  });

  it('separates payloads with different headers', () => {
    const payloads: TransformResult<TestBody>['successPayloads'] = [
      {
        body: { value: 'a' },
        endpoint: 'https://a.com',
        method: 'POST',
        headers: { h: '1' },
        jobId: 1,
      },
      {
        body: { value: 'b' },
        endpoint: 'https://a.com',
        method: 'POST',
        headers: { h: '2' },
        jobId: 2,
      },
    ];
    const groups = groupPayloadsByCompositeKey(payloads);
    expect(groups).toHaveLength(2);
  });
});

describe('BatchDestination.transformEvents', () => {
  it('iterates inputs and calls transformEvent', async () => {
    const integration = new TestIntegration(mockDestination);
    const inputs = [makeInput(1, 'hello'), makeInput(2, 'world')];
    const result = await integration.transformEvents(inputs, {});
    expect(result.successPayloads).toHaveLength(2);
    expect(result.errorPayloads).toHaveLength(0);
    expect(result.successPayloads[0].body.value).toBe('hello');
    expect(result.successPayloads[0].jobId).toBe(1);
    expect(result.successPayloads[1].jobId).toBe(2);
  });

  it('catches errors and adds to errorPayloads', async () => {
    const integration = new FailingIntegration(mockDestination);
    const successInput = makeInput(1, 'ok');
    successInput.message.shouldFail = false;
    const failInput = makeInput(2, 'fail');
    failInput.message.shouldFail = true;

    const result = await integration.transformEvents([successInput, failInput], {});
    expect(result.successPayloads).toHaveLength(1);
    expect(result.errorPayloads).toHaveLength(1);
    expect(result.errorPayloads[0].error).toBe('Transform failed');
    expect(result.errorPayloads[0].jobId).toBe(2);
  });
});

describe('validateInputs', () => {
  it('passes valid inputs', () => {
    const integration = new TestIntegration(mockDestination);
    const inputs = [makeInput(1, 'hello')];
    const { valid, errors } = validateInputs(inputs, integration);
    expect(valid).toHaveLength(1);
    expect(errors).toHaveLength(0);
  });
});

describe('strategy classes', () => {
  it('ChunkBatchStrategy creates a strategy with batch method', () => {
    const strategy = new ChunkBatchStrategy<TestBody>({
      maxItems: 10,
      wrapBody: (bodies) => ({ events: bodies }),
    });
    expect(strategy).toHaveProperty('batch');
  });

  it('CustomBatchStrategy creates a strategy with batch method', () => {
    const strategy = new CustomBatchStrategy<TestBody>((payloads) => [
      { body: { merged: true }, jobIds: new Set(payloads.map((p) => p.jobId)) },
    ]);
    expect(strategy).toHaveProperty('batch');
  });
});
