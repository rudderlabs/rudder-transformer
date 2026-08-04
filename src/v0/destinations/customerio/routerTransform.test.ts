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

const makeEventStreamInput = (message: Record<string, unknown>): CIOInput =>
  ({
    message,
    metadata: { jobId: 1, userId: 'u1', workspaceId: 'ws-1' },
    destination: baseDestination,
  }) as unknown as CIOInput;

describe('CustomerIOIntegration — event-stream person identifiers', () => {
  const emailUserIdCases = [
    {
      name: 'identify',
      message: {
        type: 'identify',
        userId: 'alice@example.com',
        traits: { email: 'alice@example.com', plan: 'pro' },
      },
    },
    {
      name: 'track',
      message: {
        type: 'track',
        userId: 'alice@example.com',
        event: 'Order Completed',
        properties: { orderId: 'abc-123' },
      },
    },
    {
      name: 'page',
      message: {
        type: 'page',
        userId: 'alice@example.com',
        name: 'Checkout',
        properties: { url: '/checkout' },
      },
    },
    {
      name: 'screen',
      message: {
        type: 'screen',
        userId: 'alice@example.com',
        event: 'Checkout',
        properties: { step: 2 },
      },
    },
    {
      name: 'device',
      message: {
        type: 'track',
        userId: 'alice@example.com',
        event: 'Application Installed',
        context: { device: { token: 'device-token', type: 'ios' } },
      },
    },
  ];

  const regressionCases = [
    {
      name: 'non-email userId stays an id identifier',
      message: { type: 'track', userId: 'user-123', event: 'Signed Up' },
      expectedIdentifiers: { id: 'user-123' },
    },
    {
      name: 'email fallback is still used when userId is empty',
      message: {
        type: 'track',
        userId: '',
        context: { traits: { email: 'fallback@example.com' } },
        event: 'Signed Up',
      },
      expectedIdentifiers: { email: 'fallback@example.com' },
    },
    {
      name: 'anonymous-only event keeps anonymous_id identifier',
      message: { type: 'track', anonymousId: 'anon-123', event: 'Signed Up' },
      expectedIdentifiers: { anonymous_id: 'anon-123' },
    },
  ];

  it.each(emailUserIdCases)(
    'classifies email userId as email identifier for $name',
    async ({ message }) => {
      const integration = new Integration(baseDestination);
      const { successPayloads } = await integration.transformEvents([
        makeEventStreamInput(message),
      ]);

      expect(successPayloads).toHaveLength(1);
      expect(successPayloads[0].body.identifiers).toEqual({ email: 'alice@example.com' });
    },
  );

  it.each(regressionCases)('$name', async ({ message, expectedIdentifiers }) => {
    const integration = new Integration(baseDestination);
    const { successPayloads } = await integration.transformEvents([makeEventStreamInput(message)]);

    expect(successPayloads).toHaveLength(1);
    expect(successPayloads[0].body.identifiers).toEqual(expectedIdentifiers);
  });
});

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

    const strategy = integration.getBatchStrategy();
    const batches = await strategy.batch(successPayloads);
    expect(batches).toHaveLength(1);
    const batchBody = batches[0].body as { batch: CustomerIOV2Payload[] };
    expect(batchBody.batch).toHaveLength(3);
    expect(batchBody.batch[0]).toMatchObject({ type: 'person', action: 'identify' });
    expect(batchBody.batch[2]).toMatchObject({ type: 'person', action: 'delete' });
  });
});
