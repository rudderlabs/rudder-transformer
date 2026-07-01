import { z } from 'zod';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import {
  BatchDestination,
  TransformedEvent,
  ChunkBatchStrategy,
  CustomBatchStrategy,
  parseSizeToBytes,
} from '../batchDestination';
import { VDMV2ObjectDestination, type RecordInput } from '../vdmV2ObjectDestination';
import type { BatchStrategy } from '../batchDestination';
import type { RouterTransformationRequestData } from '../../../../types/destinationTransformation';
import type { Destination, Connection } from '../../../../types/controlPlaneConfig';
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

class FailingIntegration extends BatchDestination<TestBody> {
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

type TestConnectionConfig = { destination: { object: string } };

class RecordIntegration extends VDMV2ObjectDestination<
  TestBody,
  Record<string, unknown>,
  TestConnectionConfig
> {
  private upsertUser(): TransformedEvent<TestBody> {
    return {
      body: { value: 'upsert:user' },
      endpoint: 'https://api.test.com/records',
      endpointPath: '/records',
      method: 'POST',
    };
  }

  private removeUser(): TransformedEvent<TestBody> {
    return {
      body: { value: 'remove:user' },
      endpoint: 'https://api.test.com/records',
      endpointPath: '/records',
      method: 'POST',
    };
  }

  private createEvent(): TransformedEvent<TestBody> {
    return {
      body: { value: 'create:event' },
      endpoint: 'https://api.test.com/records',
      endpointPath: '/records',
      method: 'POST',
    };
  }

  transformObjectRecord(_input: RecordInput) {
    return {
      user: {
        insert: () => this.upsertUser(),
        update: () => this.upsertUser(),
        delete: () => this.removeUser(),
      },
      event: {
        insert: () => this.createEvent(),
        update: () => this.createEvent(),
        // delete not listed — framework rejects automatically
      },
    };
  }

  getBatchStrategy(): BatchStrategy<TestBody> {
    return new ChunkBatchStrategy({ maxItems: 10, wrapBody: (bodies) => ({ records: bodies }) });
  }

  getInputSchema() {
    return z.object({}).passthrough();
  }
}

const mockConnection: Connection<TestConnectionConfig> = {
  sourceId: 'src-1',
  destinationId: 'dest-1',
  enabled: true,
  config: { destination: { object: 'user' } },
};

function makeRecordInput(
  jobId: number,
  action: string,
  identifiers: Record<string, string | number>,
  connection?: Connection<TestConnectionConfig>,
): RouterTransformationRequestData {
  return {
    message: { type: 'record', action, identifiers },
    metadata: {
      jobId,
      workspaceId: 'ws-1',
      sourceId: 'src-1',
      sourceType: 'web',
      sourceCategory: 'cloud',
      destinationId: 'dest-1',
      destinationType: 'TEST',
      messageId: `msg-${jobId}`,
    },
    destination: mockDestination,
    connection: connection ?? mockConnection,
  } as RouterTransformationRequestData;
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

describe('VDMV2ObjectDestination — record dispatch', () => {
  it('dispatches record events via handler map', async () => {
    const integration = new RecordIntegration(mockDestination, mockConnection);
    const input = makeRecordInput(1, 'insert', { id: 'u1' });
    const result = await integration.transformEvents([input]);
    expect(result.successPayloads).toHaveLength(1);
    expect(result.successPayloads[0].body.value).toBe('upsert:user');
    expect(result.successPayloads[0].jobId).toBe(1);
  });

  it('falls through to transformStreamEvent for event-stream events', async () => {
    const integration = new RecordIntegration(mockDestination, mockConnection);
    // RecordIntegration doesn't override transformStreamEvent → default throws
    const eventInput = makeInput(2, 'hello');
    const result = await integration.transformEvents([eventInput]);
    expect(result.errorPayloads).toHaveLength(1);
    expect(result.errorPayloads[0].error).toContain('Event-stream events are not supported');
  });

  it('rejects unsupported action for object type', async () => {
    const eventConn: Connection<TestConnectionConfig> = {
      ...mockConnection,
      config: { destination: { object: 'event' } },
    };
    const integration = new RecordIntegration(mockDestination, eventConn);
    const input = makeRecordInput(1, 'delete', { id: 'u1' }, eventConn);
    const result = await integration.transformEvents([input]);
    expect(result.errorPayloads).toHaveLength(1);
    expect(result.errorPayloads[0].error).toContain(
      '"delete" is not supported for object type "event"',
    );
  });

  it('rejects unsupported object type', async () => {
    const badConn: Connection<TestConnectionConfig> = {
      ...mockConnection,
      config: { destination: { object: 'unknown_type' } },
    };
    const integration = new RecordIntegration(mockDestination, badConn);
    const input = makeRecordInput(1, 'insert', { id: 'u1' }, badConn);
    const result = await integration.transformEvents([input]);
    expect(result.errorPayloads).toHaveLength(1);
    expect(result.errorPayloads[0].error).toContain('Unsupported object type: "unknown_type"');
  });

  it('passes standard input to handler', async () => {
    // Create an integration that echoes message fields into the body for assertion
    class EchoIntegration extends VDMV2ObjectDestination<
      Record<string, unknown>,
      Record<string, unknown>,
      TestConnectionConfig
    > {
      transformObjectRecord(input: RecordInput) {
        const handler = () => ({
          body: { ids: input.message.identifiers, action: input.message.action },
          endpoint: 'https://api.test.com',
          endpointPath: '/test',
          method: 'POST',
        });
        return {
          user: { insert: handler, update: handler, delete: handler },
        };
      }
      getBatchStrategy() {
        return new ChunkBatchStrategy({ wrapBody: (b) => ({ batch: b }) });
      }
      getInputSchema() {
        return z.object({}).passthrough();
      }
    }

    const integration = new EchoIntegration(mockDestination, mockConnection);
    const input = makeRecordInput(1, 'insert', { email: 'a@b.com', plan: 'pro' });
    const result = await integration.transformEvents([input]);
    expect(result.successPayloads[0].body).toEqual({
      ids: { email: 'a@b.com', plan: 'pro' },
      action: 'insert',
    });
  });
});
