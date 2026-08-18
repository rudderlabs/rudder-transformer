import { Integration } from './routerTransform';
import type { CustomerIORouterRequest } from './types';
import type { CustomerIOV2Payload } from './v2/types';

type CIOInput = Parameters<InstanceType<typeof Integration>['transformEvent']>[0];

const siteID = 'test-site-id';
const apiKey = 'test-api-key';

const baseDestination = {
  ID: 'dest-1',
  Name: 'CUSTOMERIO',
  DestinationDefinition: { ID: 'd1', Name: 'CUSTOMERIO', DisplayName: 'CustomerIO', Config: {} },
  Config: { siteID, apiKey },
  Enabled: true,
  WorkspaceID: 'ws-1',
  Transformations: [],
} as CustomerIORouterRequest['destination'];

const baseConnection = {
  sourceId: 'src-1',
  destinationId: 'dest-1',
  enabled: true,
  config: { destination: { object: 'person' } },
} as CustomerIORouterRequest['connection'];

const makeInput = (overrides: Record<string, unknown>, connection = baseConnection): CIOInput =>
  ({
    message: {
      type: 'record' as const,
      action: 'insert' as const,
      identifiers: { id: 'user-1', plan: 'pro' },
      ...overrides,
    },
    metadata: { jobId: 1, userId: 'u1', workspaceId: 'ws-1' },
    destination: baseDestination,
    connection,
  }) as unknown as CIOInput;

const eventConnection = {
  ...baseConnection,
  config: { destination: { object: 'event' } },
} as CustomerIORouterRequest['connection'];

describe('CustomerIOIntegration — record event routing', () => {
  it('transforms insert record into identify person payload', async () => {
    const integration = new Integration(baseDestination, baseConnection);
    const { successPayloads } = await integration.transformEvents([makeInput({})]);
    expect(successPayloads).toHaveLength(1);
    const result = successPayloads[0];
    expect(result).toMatchObject({
      body: {
        type: 'person',
        action: 'identify',
        identifiers: { id: 'user-1' },
        attributes: { plan: 'pro' },
      },
      method: 'POST',
      endpointPath: 'v2/batch',
    });
    expect(result.endpoint).toMatch(/track\.customer\.io\/api\/v2\/batch/);
  });

  it('transforms delete record into delete person payload without attributes', async () => {
    const integration = new Integration(baseDestination, baseConnection);
    const { successPayloads } = await integration.transformEvents([
      makeInput({ action: 'delete' }),
    ]);
    expect(successPayloads).toHaveLength(1);
    const result = successPayloads[0];
    expect(result.body).toMatchObject({
      type: 'person',
      action: 'delete',
      identifiers: { id: 'user-1' },
    });
    expect((result.body as CustomerIOV2Payload).attributes).toBeUndefined();
  });

  it('returns error payload for unsupported action', async () => {
    const integration = new Integration(baseDestination, baseConnection);
    const { successPayloads, errorPayloads } = await integration.transformEvents([
      makeInput({ action: 'upsert' }),
    ]);
    expect(successPayloads).toHaveLength(0);
    expect(errorPayloads).toHaveLength(1);
    expect(errorPayloads[0].error).toMatch(/"upsert" is not supported for object type "person"/);
  });

  it('transforms event object record into event person payload', async () => {
    const integration = new Integration(baseDestination, eventConnection);
    const input = makeInput(
      {
        action: 'update',
        identifiers: {
          id: 'user-1',
          name: 'Order Completed',
          plan: 'pro',
          created_at: '2024-06-25T14:00:00.000Z',
        },
      },
      eventConnection,
    );
    const { successPayloads } = await integration.transformEvents([input]);
    expect(successPayloads).toHaveLength(1);
    expect(successPayloads[0].body).toEqual({
      type: 'person',
      action: 'event',
      identifiers: { id: 'user-1' },
      name: 'Order Completed',
      timestamp: 1719324000,
      attributes: { plan: 'pro' },
    });
  });

  it('returns error payload for event object delete records', async () => {
    const integration = new Integration(baseDestination, eventConnection);
    const input = makeInput({ action: 'delete' }, eventConnection);
    const { successPayloads, errorPayloads } = await integration.transformEvents([input]);
    expect(successPayloads).toHaveLength(0);
    expect(errorPayloads).toHaveLength(1);
    expect(errorPayloads[0].error).toMatch(/"delete" is not supported for object type "event"/);
  });

  it.each([
    {
      name: 'no destination object (VDM v1)',
      connection: {
        sourceId: 'src-1',
        destinationId: 'dest-1',
        enabled: true,
        config: {},
      },
    },
    {
      name: 'connection with nil config',
      connection: {
        sourceId: 'src-1',
        destinationId: 'dest-1',
        enabled: true,
        config: null,
      },
    },
    {
      name: 'no connection at all',
      connection: undefined,
    },
  ])('input schema accepts non VDM v2 messages — $name', ({ connection }) => {
    const integration = new Integration(baseDestination);
    const schema = integration.getInputSchema();

    const input = {
      message: {
        type: 'identify',
        userId: 'user-1',
        traits: { email: 'test@example.com' },
      },
      metadata: { jobId: 1, userId: 'u1', workspaceId: 'ws-1' },
      destination: baseDestination,
      ...(connection !== undefined && { connection }),
    };

    const result = schema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('batches multiple record events into one { batch: [...] } body', async () => {
    const integration = new Integration(baseDestination, baseConnection);
    const inputs = [
      makeInput({ identifiers: { id: 'u1', plan: 'pro' } }),
      makeInput({ action: 'update', identifiers: { id: 'u2', plan: 'starter' } }),
      makeInput({ action: 'delete', identifiers: { id: 'u3' } }),
    ];
    const { successPayloads } = await integration.transformEvents(inputs);
    expect(successPayloads).toHaveLength(3);

    const strategy = integration.getBatchStrategy(successPayloads[0].endpoint);
    const batches = await strategy.batch(successPayloads);
    expect(batches).toHaveLength(1);
    const batchBody = batches[0].body as { batch: CustomerIOV2Payload[] };
    expect(batchBody.batch).toHaveLength(3);
    expect(batchBody.batch[0]).toMatchObject({ type: 'person', action: 'identify' });
    expect(batchBody.batch[2]).toMatchObject({ type: 'person', action: 'delete' });
  });
});

describe('CustomerIOIntegration — event-stream event routing', () => {
  const envKey = 'CUSTOMERIO_EVENT_STREAM_V2_API_ENABLED';
  const originalEnvValue = process.env[envKey];

  afterEach(() => {
    if (originalEnvValue === undefined) {
      delete process.env[envKey];
    } else {
      process.env[envKey] = originalEnvValue;
    }
  });

  const makeEventStreamInput = (message: Record<string, unknown>): CIOInput =>
    ({
      message,
      metadata: { jobId: 1, userId: 'u1', workspaceId: 'ws-1' },
      destination: baseDestination,
    }) as unknown as CIOInput;

  it('uses the legacy (V1) request shape by default', async () => {
    delete process.env[envKey];
    const integration = new Integration(baseDestination);
    const input = makeEventStreamInput({
      type: 'identify',
      userId: 'user-1',
      traits: { plan: 'pro' },
    });
    const { successPayloads } = await integration.transformEvents([input]);
    expect(successPayloads).toHaveLength(1);
    const result = successPayloads[0];
    expect(result.method).toBe('PUT');
    expect(result.endpoint).toMatch(/track\.customer\.io\/api\/v1\/customers\/user-1/);
    expect(result.body).toMatchObject({ plan: 'pro' });
    expect((result.body as CustomerIOV2Payload).type).toBeUndefined();
  });

  it('uses the new V2 request shape when the env var is enabled', async () => {
    process.env[envKey] = 'true';
    const integration = new Integration(baseDestination);
    const input = makeEventStreamInput({
      type: 'identify',
      userId: 'user-1',
      traits: { plan: 'pro' },
    });
    const { successPayloads } = await integration.transformEvents([input]);
    expect(successPayloads).toHaveLength(1);
    const result = successPayloads[0];
    expect(result.method).toBe('POST');
    expect(result.endpoint).toMatch(/track\.customer\.io\/api\/v2\/batch/);
    expect(result.body).toMatchObject({
      type: 'person',
      action: 'identify',
      identifiers: { id: 'user-1' },
      attributes: { plan: 'pro' },
    });
  });

  it('does not batch legacy (V1) event-stream requests — one request per event', async () => {
    delete process.env[envKey];
    const integration = new Integration(baseDestination);
    const input1 = makeEventStreamInput({ type: 'identify', userId: 'user-1', traits: {} });
    const input2 = makeEventStreamInput({ type: 'identify', userId: 'user-1', traits: {} });
    const { successPayloads } = await integration.transformEvents([input1, input2]);
    expect(successPayloads).toHaveLength(2);

    const strategy = integration.getBatchStrategy(successPayloads[0].endpoint);
    const batches = await strategy.batch(successPayloads);
    expect(batches).toHaveLength(2);
    expect(batches[0].body).not.toHaveProperty('batch');
  });

  it('still batches legacy group events via the shared V2 batch endpoint', async () => {
    delete process.env[envKey];
    const integration = new Integration(baseDestination);
    const input1 = makeEventStreamInput({
      type: 'group',
      userId: 'user-1',
      groupId: 'group-1',
      traits: {},
    });
    const input2 = makeEventStreamInput({
      type: 'group',
      userId: 'user-2',
      groupId: 'group-2',
      traits: {},
    });
    const { successPayloads } = await integration.transformEvents([input1, input2]);
    expect(successPayloads).toHaveLength(2);
    successPayloads.forEach((payload) =>
      expect(payload.endpoint).toMatch(/track\.customer\.io\/api\/v2\/batch/),
    );

    const strategy = integration.getBatchStrategy(successPayloads[0].endpoint);
    const batches = await strategy.batch(successPayloads);
    expect(batches).toHaveLength(1);
    expect((batches[0].body as { batch: unknown[] }).batch).toHaveLength(2);
  });
});
