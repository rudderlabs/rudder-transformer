import { z } from 'zod';
import { VDMV2ObjectDestination } from '../vdmV2ObjectDestination';
import { makeRouterInputSchema, TransformedEvent, ChunkBatchStrategy } from '../batchDestination';
import type { BatchStrategy } from '../types';
import type { Destination } from '../../../../types/controlPlaneConfig';

type Body = { value: string };

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

const mockDestination = { Config: { apiKey: 'k' } } as unknown as Destination;

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
