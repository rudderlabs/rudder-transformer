import { z } from 'zod';
import { InstrumentationError, NetworkError } from '@rudderstack/integrations-lib';
import {
  DestinationIntegration,
  TransformedEvent,
  ChunkBatchStrategy,
  CustomBatchStrategy,
  parseSizeToBytes,
} from '../destinationIntegration';
import type { BatchStrategy, TransformResult } from '../destinationIntegration';
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

class TestIntegration extends DestinationIntegration<TestBody> {
  // Declared as the sync-or-async union so subclasses below can override it with an async
  // implementation; TypeScript will not let an async override narrow a sync base signature.
  transformEvent(
    input: RouterTransformationRequestData<TestMessage>,
  ): TransformedEvent<TestBody> | Promise<TransformedEvent<TestBody>> {
    return {
      body: { value: input.message.data ?? '' },
      endpoint: 'https://api.test.com/events',
      endpointPath: '/events',
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

class AsyncTransformIntegration extends TestIntegration {
  readonly seen: { input: unknown; reqMetadata?: NonNullable<unknown> }[] = [];

  async transformEvent(
    input: RouterTransformationRequestData<TestMessage>,
    reqMetadata?: NonNullable<unknown>,
  ): Promise<TransformedEvent<TestBody>> {
    this.seen.push({ input, reqMetadata });
    const base = await super.transformEvent(input);
    return { ...base, body: { value: `${base.body.value}-enriched` } };
  }
}

class RejectingTransformIntegration extends TestIntegration {
  async transformEvent(): Promise<TransformedEvent<TestBody>> {
    throw new NetworkError(
      'refresh me',
      401,
      {},
      { error: { message: 'expired' } },
      'REFRESH_TOKEN',
    );
  }
}

class FailingIntegration extends DestinationIntegration<TestBody> {
  transformEvent(input: RouterTransformationRequestData<TestMessage>): TransformedEvent<TestBody> {
    if (input.message.shouldFail) {
      throw new Error('Transform failed');
    }
    return {
      body: { value: 'ok' },
      endpoint: 'https://api.test.com/events',
      endpointPath: '/events',
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

describe('DestinationIntegration.transformEvents', () => {
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

  it('awaits an async transformEvent and passes each input with the request metadata', async () => {
    const integration = new AsyncTransformIntegration(mockDestination);
    const inputs = [makeInput(1, 'hello'), makeInput(2, 'world')];
    const reqMetadata = { requestId: 'req-1' };

    const result = await integration.transformEvents(inputs, reqMetadata);

    expect(integration.seen).toEqual([
      { input: inputs[0], reqMetadata },
      { input: inputs[1], reqMetadata },
    ]);
    expect(result).toEqual({
      successPayloads: [
        expect.objectContaining({ jobId: 1, body: { value: 'hello-enriched' } }),
        expect.objectContaining({ jobId: 2, body: { value: 'world-enriched' } }),
      ],
      errorPayloads: [],
    });
  });

  it('runs async transformEvent calls sequentially so a cache-backed lookup is not raced', async () => {
    const order: string[] = [];
    class OrderedIntegration extends TestIntegration {
      async transformEvent(
        input: RouterTransformationRequestData<TestMessage>,
      ): Promise<TransformedEvent<TestBody>> {
        order.push(`start-${input.metadata.jobId}`);
        await new Promise((resolve) => {
          setTimeout(resolve, 0);
        });
        order.push(`end-${input.metadata.jobId}`);
        return super.transformEvent(input);
      }
    }

    await new OrderedIntegration(mockDestination).transformEvents(
      [makeInput(1, 'a'), makeInput(2, 'b')],
      {},
    );

    expect(order).toEqual(['start-1', 'end-1', 'start-2', 'end-2']);
  });

  it('records an async transformEvent rejection against that job instead of failing the call', async () => {
    const integration = new RejectingTransformIntegration(mockDestination);

    const result = await integration.transformEvents([makeInput(1, 'hello')], {});

    expect(result.successPayloads).toHaveLength(0);
    expect(result.errorPayloads).toEqual([
      expect.objectContaining({
        jobId: 1,
        error: expect.stringContaining('refresh me'),
        statusCode: 401,
        // Carried off the rejection so rudder-server still refreshes the token for this job.
        authErrorCategory: 'REFRESH_TOKEN',
      }),
    ]);
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

  it('CustomBatchStrategy supports async batch functions', async () => {
    const strategy = new CustomBatchStrategy<TestBody>(async (payloads) => [
      { body: { merged: true }, jobIds: new Set(payloads.map((p) => p.jobId)) },
    ]);
    const payloads = [
      {
        body: { value: 'a' },
        endpoint: '/test',
        endpointPath: '/test',
        method: 'POST' as const,
        jobId: 1,
      },
      {
        body: { value: 'b' },
        endpoint: '/test',
        endpointPath: '/test',
        method: 'POST' as const,
        jobId: 2,
      },
    ];
    const result = await strategy.batch(payloads);
    expect(result).toHaveLength(1);
    expect(result[0].body).toEqual({ merged: true });
    expect(result[0].jobIds).toEqual(new Set([1, 2]));
  });
});
