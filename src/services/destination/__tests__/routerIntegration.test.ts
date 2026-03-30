import {
  RouterIntegration,
  TransformedPayload,
  BatchStrategy,
  chunk,
  customBatch,
  parseSizeToBytes,
  groupByDontBatchDirective,
  resolveMetadatas,
  groupPayloadsByCompositeKey,
} from '../routerIntegration';
import type {
  RouterTransformationRequestData,
  RouterTransformationResponse,
} from '../../../types/destinationTransformation';
import type { Destination } from '../../../types/controlPlaneConfig';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

type TestBody = { value: string };

const mockDestination = {
  ID: 'dest-1',
  Config: { apiKey: 'test-key' },
  DestinationDefinition: { Name: 'TEST' },
} as unknown as Destination;

class TestIntegration extends RouterIntegration<TestBody> {
  transformEvent(
    input: RouterTransformationRequestData,
  ): Omit<TransformedPayload<TestBody>, 'jobId'> {
    return {
      body: { value: (input.message as any).data },
      endpoint: 'https://api.test.com/events',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };
  }

  getBatchStrategy(): BatchStrategy<TestBody> {
    return chunk({
      maxSize: 3,
      wrapBody: (bodies) => ({ events: bodies }),
    });
  }
}

class FailingIntegration extends RouterIntegration<TestBody> {
  transformEvent(
    input: RouterTransformationRequestData,
  ): Omit<TransformedPayload<TestBody>, 'jobId'> {
    if ((input.message as any).shouldFail) {
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

function makeInput(
  jobId: number,
  data: string,
  dontBatch?: boolean,
): RouterTransformationRequestData {
  return {
    message: { data, type: 'track' } as any,
    metadata: {
      jobId,
      workspaceId: 'ws-1',
      sourceId: 'src-1',
      sourceType: 'web',
      sourceCategory: 'cloud',
      destinationId: 'dest-1',
      destinationType: 'TEST',
      messageId: `msg-${jobId}`,
      dontBatch,
    } as any,
    destination: mockDestination,
  } as RouterTransformationRequestData;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('parseSizeToBytes', () => {
  it('parses MB', () => {
    expect(parseSizeToBytes('4MB')).toBe(4 * 1024 * 1024);
  });

  it('parses KB', () => {
    expect(parseSizeToBytes('512KB')).toBe(512 * 1024);
  });

  it('parses GB', () => {
    expect(parseSizeToBytes('1GB')).toBe(1024 * 1024 * 1024);
  });

  it('parses B', () => {
    expect(parseSizeToBytes('100B')).toBe(100);
  });

  it('throws on invalid format', () => {
    expect(() => parseSizeToBytes('abc')).toThrow('Invalid size format');
  });
});

describe('groupByDontBatchDirective', () => {
  it('separates batchable and nonBatchable', () => {
    const inputs = [makeInput(1, 'a'), makeInput(2, 'b', true), makeInput(3, 'c')];
    const { batchable, nonBatchable } = groupByDontBatchDirective(inputs);
    expect(batchable).toHaveLength(2);
    expect(nonBatchable).toHaveLength(1);
    expect((nonBatchable[0].metadata as any).jobId).toBe(2);
  });

  it('returns all batchable when no dontBatch flag', () => {
    const inputs = [makeInput(1, 'a'), makeInput(2, 'b')];
    const { batchable, nonBatchable } = groupByDontBatchDirective(inputs);
    expect(batchable).toHaveLength(2);
    expect(nonBatchable).toHaveLength(0);
  });
});

describe('resolveMetadatas', () => {
  it('resolves jobIds to metadata objects', () => {
    const map = new Map<number, any>();
    map.set(1, { jobId: 1, userId: 'u1' });
    map.set(2, { jobId: 2, userId: 'u2' });
    const result = resolveMetadatas(new Set([1, 2]), map);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ jobId: 1, userId: 'u1' });
  });

  it('filters out missing entries', () => {
    const map = new Map<number, any>();
    map.set(1, { jobId: 1 });
    const result = resolveMetadatas(new Set([1, 999]), map);
    expect(result).toHaveLength(1);
  });
});

describe('groupPayloadsByCompositeKey', () => {
  it('groups payloads with same endpoint/method/headers/params', () => {
    const payloads: TransformedPayload<TestBody>[] = [
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
    const payloads: TransformedPayload<TestBody>[] = [
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

describe('RouterIntegration.batchTransform', () => {
  it('iterates inputs and calls transformEvent', async () => {
    const integration = new TestIntegration(mockDestination);
    const inputs = [makeInput(1, 'hello'), makeInput(2, 'world')];
    const result = await integration.batchTransform(inputs);
    expect(result.payloads).toHaveLength(2);
    expect(result.errorEvents).toHaveLength(0);
    expect(result.payloads[0].body.value).toBe('hello');
    expect(result.payloads[0].jobId).toBe(1);
    expect(result.payloads[1].jobId).toBe(2);
  });

  it('catches errors and adds to errorEvents', async () => {
    const integration = new FailingIntegration(mockDestination);
    const inputs = [
      {
        message: { shouldFail: false } as any,
        metadata: { jobId: 1 } as any,
        destination: mockDestination,
      } as RouterTransformationRequestData,
      {
        message: { shouldFail: true } as any,
        metadata: { jobId: 2 } as any,
        destination: mockDestination,
      } as RouterTransformationRequestData,
    ];
    const result = await integration.batchTransform(inputs);
    expect(result.payloads).toHaveLength(1);
    expect(result.errorEvents).toHaveLength(1);
    expect(result.errorEvents[0].error).toBe('Transform failed');
    expect(result.errorEvents[0].jobId).toBe(2);
  });
});

describe('RouterIntegration.validate', () => {
  it('passes valid inputs', () => {
    const integration = new TestIntegration(mockDestination);
    const inputs = [makeInput(1, 'hello')];
    const errors: RouterTransformationResponse[] = [];
    const valid = integration.validate(inputs, errors);
    expect(valid).toHaveLength(1);
    expect(errors).toHaveLength(0);
  });

  it('rejects inputs missing metadata.jobId', () => {
    const integration = new TestIntegration(mockDestination);
    const inputs = [
      {
        message: { type: 'track' },
        metadata: {},
        destination: mockDestination,
      } as unknown as RouterTransformationRequestData,
    ];
    const errors: RouterTransformationResponse[] = [];
    const valid = integration.validate(inputs, errors);
    expect(valid).toHaveLength(0);
    expect(errors).toHaveLength(1);
    expect(errors[0].statusCode).toBe(400);
    expect(errors[0].statTags).toMatchObject({
      errorCategory: 'dataValidation',
      errorType: 'instrumentation',
    });
  });

  it('rejects inputs missing message.type', () => {
    const integration = new TestIntegration(mockDestination);
    const inputs = [
      {
        message: {},
        metadata: { jobId: 1 },
        destination: mockDestination,
      } as unknown as RouterTransformationRequestData,
    ];
    const errors: RouterTransformationResponse[] = [];
    const valid = integration.validate(inputs, errors);
    expect(valid).toHaveLength(0);
    expect(errors).toHaveLength(1);
  });
});

describe('chunk and customBatch factories', () => {
  it('chunk creates a ChunkStrategy', () => {
    const strategy = chunk<TestBody>({
      maxSize: 10,
      wrapBody: (bodies) => ({ events: bodies }),
    });
    expect(strategy.type).toBe('chunk');
    expect(strategy.maxSize).toBe(10);
  });

  it('customBatch creates a CustomBatchStrategy', () => {
    const strategy = customBatch<TestBody>((payloads) => [
      { body: { merged: true }, jobIds: new Set(payloads.map((p) => p.jobId)) },
    ]);
    expect(strategy.type).toBe('customBatch');
  });
});
