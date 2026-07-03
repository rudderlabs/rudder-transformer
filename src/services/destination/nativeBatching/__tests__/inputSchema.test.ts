import { z } from 'zod';
import { makeRouterInputSchema } from '../inputSchema';

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const destinationConfig = z.object({ apiKey: z.string() });

const recordMessage = z
  .object({ type: z.literal('record'), identifiers: z.record(z.unknown()) })
  .passthrough();

const eventStreamMessage = z
  .object({ type: z.enum(['track', 'identify']), userId: z.string() })
  .passthrough();

const connectionConfig = z.object({ destination: z.object({ object: z.string() }) }).passthrough();

const validDestination = { Config: { apiKey: 'key-1' } };

// ---------------------------------------------------------------------------
// Single variant — parity with a non-hybrid destination
// ---------------------------------------------------------------------------

describe('makeRouterInputSchema — single variant', () => {
  const schema = makeRouterInputSchema({
    destinationConfig,
    variants: [{ message: recordMessage, connectionConfig }],
  });

  const validCases = [
    {
      name: 'a valid input, passing through unvalidated envelope keys',
      input: {
        message: { type: 'record', identifiers: { id: 'u1' }, extra: 'kept' },
        destination: validDestination,
        connection: { config: { destination: { object: 'person' } } },
        metadata: { jobId: 1 },
      },
    },
    {
      name: 'input without a connection (connection is optional)',
      input: {
        message: { type: 'record', identifiers: { id: 'u1' } },
        destination: validDestination,
      },
    },
  ];

  const invalidCases = [
    {
      name: 'a message that does not match the variant',
      input: {
        message: { type: 'track', userId: 'u1' },
        destination: validDestination,
      },
    },
  ];

  const pathErrorCases = [
    {
      name: 'a bad shared config',
      input: {
        message: { type: 'record', identifiers: { id: 'u1' } },
        destination: { Config: {} },
      },
      errorPath: 'destination.Config.apiKey',
    },
  ];

  it.each(validCases)('accepts $name', ({ input }) => {
    expect(schema.safeParse(input).success).toBe(true);
  });

  it.each(invalidCases)('rejects $name', ({ input }) => {
    expect(schema.safeParse(input).success).toBe(false);
  });

  it.each(pathErrorCases)('rejects $name and reports a precise path', ({ input, errorPath }) => {
    const result = schema.safeParse(input);
    expect(result.success).toBe(false);
    expect(!result.success && result.error.issues.some((i) => i.path.join('.') === errorPath)).toBe(
      true,
    );
  });
});

// ---------------------------------------------------------------------------
// Multiple variants — hybrid destination (record + event-stream)
// ---------------------------------------------------------------------------

describe('makeRouterInputSchema — multiple variants', () => {
  const schema = makeRouterInputSchema({
    destinationConfig,
    variants: [{ message: recordMessage, connectionConfig }, { message: eventStreamMessage }],
  });

  const validCases = [
    {
      name: 'a record message with a valid connection',
      input: {
        message: { type: 'record', identifiers: { id: 'u1' } },
        destination: validDestination,
        connection: { config: { destination: { object: 'person' } } },
      },
    },
    {
      name: 'an event-stream message with no connection',
      input: {
        message: { type: 'track', userId: 'u1' },
        destination: validDestination,
      },
    },
    {
      // The record connection schema requires `object`; it must not be applied to
      // event-stream events (the bug #5331 fixed).
      name: 'an event-stream message whose connection lacks record-only fields',
      input: {
        message: { type: 'identify', userId: 'u1' },
        destination: validDestination,
        connection: { config: { destination: {} } },
      },
    },
  ];

  const invalidCases = [
    {
      name: 'a record message whose connection fails the record schema',
      input: {
        message: { type: 'record', identifiers: { id: 'u1' } },
        destination: validDestination,
        connection: { config: { destination: {} } },
      },
    },
    {
      name: 'a message matching neither variant',
      input: {
        message: { type: 'group', groupId: 'g1' },
        destination: validDestination,
      },
    },
  ];

  const pathErrorCases = [
    {
      name: 'a bad shared config',
      input: {
        message: { type: 'track', userId: 'u1' },
        destination: { Config: {} },
      },
      errorPath: 'destination.Config.apiKey',
    },
  ];

  it.each(validCases)('accepts $name', ({ input }) => {
    expect(schema.safeParse(input).success).toBe(true);
  });

  it.each(invalidCases)('rejects $name', ({ input }) => {
    expect(schema.safeParse(input).success).toBe(false);
  });

  it.each(pathErrorCases)('rejects $name and reports a precise path', ({ input, errorPath }) => {
    const result = schema.safeParse(input);
    expect(result.success).toBe(false);
    expect(!result.success && result.error.issues.some((i) => i.path.join('.') === errorPath)).toBe(
      true,
    );
  });
});

// ---------------------------------------------------------------------------
// No destination config (e.g. GAEC)
// ---------------------------------------------------------------------------

describe('makeRouterInputSchema — no destinationConfig', () => {
  const schema = makeRouterInputSchema({ variants: [{ message: recordMessage }] });

  it('validates only the message and passes destination through', () => {
    const result = schema.safeParse({
      message: { type: 'record', identifiers: { id: 'u1' } },
      destination: { Config: { anything: true } },
    });
    expect(result.success).toBe(true);
  });
});
