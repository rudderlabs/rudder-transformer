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
  const makeV2Destination = (
    config: Partial<CustomerIORouterRequest['destination']['Config']> = {},
  ): CustomerIORouterRequest['destination'] => ({
    ...baseDestination,
    Config: { ...baseDestination.Config, apiVersion: 'v2', userIdMapping: 'id', ...config },
  });

  const makeEventStreamInput = (
    message: Record<string, unknown>,
    destination = baseDestination,
  ): CIOInput =>
    ({
      message,
      metadata: { jobId: 1, userId: 'u1', workspaceId: 'ws-1' },
      destination,
    }) as unknown as CIOInput;

  it('uses the legacy (V1) request shape by default', async () => {
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

  it('uses the legacy (V1) request shape when apiVersion is v1', async () => {
    const v1Destination: CustomerIORouterRequest['destination'] = {
      ...baseDestination,
      Config: { ...baseDestination.Config, apiVersion: 'v1' },
    };
    const integration = new Integration(v1Destination);
    const input = makeEventStreamInput(
      {
        type: 'identify',
        userId: 'user-1',
        traits: { plan: 'pro' },
      },
      v1Destination,
    );
    const { successPayloads } = await integration.transformEvents([input]);
    expect(successPayloads).toHaveLength(1);
    const result = successPayloads[0];
    expect(result.method).toBe('PUT');
    expect(result.endpoint).toMatch(/track\.customer\.io\/api\/v1\/customers\/user-1/);
    expect((result.body as CustomerIOV2Payload).type).toBeUndefined();
  });

  it('uses the new V2 request shape when destination apiVersion is v2', async () => {
    const v2Destination = makeV2Destination();
    const integration = new Integration(v2Destination);
    const input = makeEventStreamInput(
      {
        type: 'identify',
        userId: 'user-1',
        traits: { plan: 'pro' },
      },
      v2Destination,
    );
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

  it.each([
    { userIdMapping: 'id' as const, expectedIdentifiers: { id: 'user-1' } },
    { userIdMapping: 'email' as const, expectedIdentifiers: { email: 'user-1' } },
    { userIdMapping: 'phone' as const, expectedIdentifiers: { phone: 'user-1' } },
    { userIdMapping: 'cio_id' as const, expectedIdentifiers: { cio_id: 'user-1' } },
  ])(
    'maps userId to $userIdMapping for V2 person event identifiers',
    async ({ userIdMapping, expectedIdentifiers }) => {
      const v2Destination = makeV2Destination({ userIdMapping });
      const integration = new Integration(v2Destination);
      const personEvents = [
        { type: 'identify', userId: 'user-1', traits: { plan: 'pro' } },
        { type: 'track', event: 'Order Completed', userId: 'user-1', properties: {} },
        { type: 'page', name: 'Docs', userId: 'user-1', properties: {} },
        { type: 'screen', event: 'Home', userId: 'user-1', properties: {} },
        {
          type: 'track',
          event: 'Application Installed',
          userId: 'user-1',
          properties: {},
          context: { device: { token: 'device-token', type: 'ios' } },
        },
      ].map((message) => makeEventStreamInput(message, v2Destination));

      const { successPayloads } = await integration.transformEvents(personEvents);
      expect(successPayloads).toHaveLength(personEvents.length);
      successPayloads.forEach((payload) =>
        expect(payload.body).toMatchObject({ identifiers: expectedIdentifiers }),
      );
    },
  );

  it.each([
    {
      name: 'userId maps to id',
      message: { type: 'identify', userId: 'user-1', traits: { plan: 'pro' } },
      expectedIdentifiers: { id: 'user-1' },
    },
    {
      name: 'email maps to email when userId is absent',
      message: { type: 'identify', traits: { email: 'test@example.com', plan: 'pro' } },
      expectedIdentifiers: { email: 'test@example.com' },
    },
    {
      name: 'anonymousId maps to anonymous_id when userId and email are absent',
      message: { type: 'track', event: 'Anonymous Event', anonymousId: 'anon-1', properties: {} },
      expectedIdentifiers: { anonymous_id: 'anon-1' },
    },
  ])(
    'falls back to legacy auto-detection for V2 identifiers without userIdMapping — $name',
    async ({ message, expectedIdentifiers }) => {
      const v2Destination = makeV2Destination({ userIdMapping: undefined });
      const integration = new Integration(v2Destination);
      const input = makeEventStreamInput(message, v2Destination);
      const { successPayloads } = await integration.transformEvents([input]);
      expect(successPayloads).toHaveLength(1);
      expect(successPayloads[0].body).toMatchObject({ identifiers: expectedIdentifiers });
    },
  );

  it('does not batch legacy (V1) event-stream requests — one request per event', async () => {
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
