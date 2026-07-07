import { z } from 'zod';
import { VDMV2ObjectDestination, type RecordInput } from '../vdmV2ObjectDestination';
import { makeRouterInputSchema, TransformedEvent, ChunkBatchStrategy } from '../batchDestination';
import type { BatchStrategy } from '../types';
import type { Destination, Connection } from '../../../../types/controlPlaneConfig';
import type { RouterTransformationRequestData } from '../../../../types/destinationTransformation';
import type { Metadata, RudderMessage } from '../../../../types/rudderEvents';

type Body = { value: string };

interface TestMessage extends RudderMessage {
  data?: string;
}

const destConfig = z.object({ apiKey: z.string() });
const recordInputSchema = makeRouterInputSchema({
  message: z
    .object({
      type: z.literal('record'),
      action: z.enum(['insert', 'update', 'delete']),
      identifiers: z.record(z.unknown()),
    })
    .passthrough(),
  destinationConfig: destConfig,
  connectionConfig: z.object({ destination: z.object({ object: z.string() }) }).passthrough(),
});
const eventStreamInputSchema = makeRouterInputSchema({
  message: z.object({ type: z.enum(['track', 'identify']), userId: z.string() }).passthrough(),
  destinationConfig: destConfig,
});

class TestObjectDestination extends VDMV2ObjectDestination<
  Body,
  typeof recordInputSchema,
  typeof eventStreamInputSchema
> {
  protected readonly recordSchema = recordInputSchema;
  protected readonly eventStreamSchema = eventStreamInputSchema;
  transformObjectRecord() {
    const handler = () => ({
      body: { value: 'r' },
      endpoint: 'x',
      endpointPath: 'x',
      method: 'POST',
    });
    return { person: { insert: handler, update: handler, delete: handler } };
  }
  transformEventStream() {
    return {
      track: () => ({ body: { value: 'e' }, endpoint: 'x', endpointPath: 'x', method: 'POST' }),
    };
  }
  getBatchStrategy(): BatchStrategy<Body> {
    return new ChunkBatchStrategy({ maxItems: 3, wrapBody: (bodies) => ({ events: bodies }) });
  }
}

const mockDestination: Destination = {
  ID: 'dest-1',
  Config: { apiKey: 'k' },
  DestinationDefinition: { ID: 'destDef-1', Name: 'TEST', DisplayName: 'Test', Config: {} },
  Name: 'test-dest',
  Enabled: true,
  WorkspaceID: 'ws-1',
  Transformations: [],
};

describe('VDMV2ObjectDestination.getInputSchema', () => {
  const schema = new TestObjectDestination(mockDestination).getInputSchema();

  it('accepts a record input', () => {
    expect(
      schema.safeParse({
        message: { type: 'record', action: 'insert', identifiers: { id: 'u1' } },
        destination: { Config: { apiKey: 'k' } },
        connection: { config: { destination: { object: 'person' } } },
      }).success,
    ).toBe(true);
  });

  it('accepts an event-stream input', () => {
    expect(
      schema.safeParse({
        message: { type: 'track', userId: 'u1' },
        destination: { Config: { apiKey: 'k' } },
      }).success,
    ).toBe(true);
  });

  it('rejects a message matching neither variant', () => {
    expect(
      schema.safeParse({
        message: { type: 'group' },
        destination: { Config: { apiKey: 'k' } },
      }).success,
    ).toBe(false);
  });
});

type TestConnectionConfig = { destination: { object: string } };

class RecordIntegration extends VDMV2ObjectDestination<Body> {
  protected readonly recordSchema = z.object({}).passthrough();

  protected readonly eventStreamSchema = z.object({}).passthrough();

  private upsertUser(): TransformedEvent<Body> {
    return {
      body: { value: 'upsert:user' },
      endpoint: 'https://api.test.com/records',
      endpointPath: '/records',
      method: 'POST',
    };
  }

  private removeUser(): TransformedEvent<Body> {
    return {
      body: { value: 'remove:user' },
      endpoint: 'https://api.test.com/records',
      endpointPath: '/records',
      method: 'POST',
    };
  }

  private createEvent(): TransformedEvent<Body> {
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

  getBatchStrategy(): BatchStrategy<Body> {
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

function makeInput(jobId: number, data: string): RouterTransformationRequestData {
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
  };
  return { message, metadata, destination: mockDestination };
}

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
    class EchoIntegration extends VDMV2ObjectDestination<Record<string, unknown>> {
      protected readonly recordSchema = z.object({}).passthrough();

      protected readonly eventStreamSchema = z.object({}).passthrough();

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
