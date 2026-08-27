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
    Config: { ...baseDestination.Config, apiVersion: 'v2', userIdIdentifierType: 'id', ...config },
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
    {
      userIdIdentifierType: 'id' as const,
      userId: 'user-1',
      expectedIdentifiers: { id: 'user-1' },
    },
    {
      userIdIdentifierType: 'email' as const,
      userId: 'user-1',
      expectedIdentifiers: { email: 'user-1' },
    },
    // phone mapping is E.164-validated, so this case needs a real phone number
    {
      userIdIdentifierType: 'phone' as const,
      userId: '+15551234567',
      expectedIdentifiers: { phone: '+15551234567' },
    },
    {
      userIdIdentifierType: 'cio_id' as const,
      userId: 'user-1',
      expectedIdentifiers: { cio_id: 'user-1' },
    },
  ])(
    'maps userId to $userIdIdentifierType for V2 person event identifiers',
    async ({ userIdIdentifierType, userId, expectedIdentifiers }) => {
      const v2Destination = makeV2Destination({ userIdIdentifierType });
      const integration = new Integration(v2Destination);
      const personEvents = [
        { type: 'identify', userId, traits: { plan: 'pro' } },
        { type: 'track', event: 'Order Completed', userId, properties: {} },
        { type: 'page', name: 'Docs', userId, properties: {} },
        { type: 'screen', event: 'Home', userId, properties: {} },
        {
          type: 'track',
          event: 'Application Installed',
          userId,
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
    { case: 'whitespace only', userId: '   ' },
    { case: 'boolean', userId: true },
    { case: 'object', userId: { id: 'user-1' } },
  ])('fails a V2 person event when userId is a $case', async ({ userId }) => {
    const v2Destination = makeV2Destination({ userIdIdentifierType: 'id' });
    const integration = new Integration(v2Destination);
    const input = makeEventStreamInput(
      { type: 'identify', userId, traits: { plan: 'pro' } },
      v2Destination,
    );

    const { successPayloads, errorPayloads } = await integration.transformEvents([input]);
    expect(successPayloads).toHaveLength(0);
    expect(errorPayloads).toHaveLength(1);
    expect(errorPayloads[0].error).toMatch(
      /a non-empty string or number userId is required when the userId identifier type is configured/,
    );
  });

  // CustomerIO accepts a numeric identifier, so it is forwarded unchanged (not stringified).
  it('accepts a numeric userId for a V2 person event', async () => {
    const v2Destination = makeV2Destination({ userIdIdentifierType: 'id' });
    const integration = new Integration(v2Destination);
    const input = makeEventStreamInput(
      { type: 'identify', userId: 12345, traits: { plan: 'pro' } },
      v2Destination,
    );

    const { successPayloads } = await integration.transformEvents([input]);
    expect(successPayloads).toHaveLength(1);
    expect(successPayloads[0].body).toMatchObject({ identifiers: { id: 12345 } });
  });

  // Strict userId mapping: when userIdIdentifierType is configured the userId is the only
  // accepted identifier — email/anonymousId no longer act as fallbacks.
  it.each(['id', 'email', 'phone', 'cio_id'] as const)(
    'fails a V2 person event with no userId when userIdIdentifierType is %s',
    async (userIdIdentifierType) => {
      const v2Destination = makeV2Destination({ userIdIdentifierType });
      const integration = new Integration(v2Destination);
      const input = makeEventStreamInput(
        {
          type: 'identify',
          anonymousId: 'anon-1',
          traits: { email: 'alice@example.com', plan: 'pro' },
        },
        v2Destination,
      );

      const { successPayloads, errorPayloads } = await integration.transformEvents([input]);
      expect(successPayloads).toHaveLength(0);
      expect(errorPayloads).toHaveLength(1);
      expect(errorPayloads[0].error).toMatch(
        /a non-empty string or number userId is required when the userId identifier type is configured/,
      );
    },
  );

  it.each([
    { case: 'no country code', userId: '5551234567' },
    { case: 'not a parseable number', userId: 'user-1' },
    { case: 'unknown country code', userId: '+999999999999999' },
  ])(
    'fails a V2 person event when phone-mapped userId is not E.164 ($case)',
    async ({ userId }) => {
      const v2Destination = makeV2Destination({ userIdIdentifierType: 'phone' });
      const integration = new Integration(v2Destination);
      const input = makeEventStreamInput(
        { type: 'identify', userId, traits: { plan: 'pro' } },
        v2Destination,
      );

      const { successPayloads, errorPayloads } = await integration.transformEvents([input]);
      expect(successPayloads).toHaveLength(0);
      expect(errorPayloads).toHaveLength(1);
      expect(errorPayloads[0].error).toMatch(/Phone number is not in E.164 format/);
    },
  );

  it('normalises a phone-mapped userId written with separators to E.164', async () => {
    const v2Destination = makeV2Destination({ userIdIdentifierType: 'phone' });
    const integration = new Integration(v2Destination);
    const input = makeEventStreamInput(
      { type: 'identify', userId: '+1 (555) 123-4567', traits: { plan: 'pro' } },
      v2Destination,
    );

    const { successPayloads } = await integration.transformEvents([input]);
    expect(successPayloads).toHaveLength(1);
    // We send the form we validated: separators are stripped before the number goes out,
    // so `+1 (555) 123-4567` and `+15551234567` resolve to the same CustomerIO profile.
    expect(successPayloads[0].body).toMatchObject({
      identifiers: { phone: '+15551234567' },
    });
  });

  it('writes every person identifier under the configured mapping key', async () => {
    const v2Destination = makeV2Destination({ userIdIdentifierType: 'cio_id' });
    const integration = new Integration(v2Destination);
    const inputs = [
      makeEventStreamInput(
        { type: 'alias', userId: 'cio_abc123', previousId: 'cio_old456' },
        v2Destination,
      ),
      makeEventStreamInput(
        { type: 'group', userId: 'cio_abc123', groupId: 'group-1', traits: { name: 'rs' } },
        v2Destination,
      ),
    ];

    const { successPayloads } = await integration.transformEvents(inputs);
    const bodies = successPayloads.flatMap((p) => p.body.batch ?? [p.body]);
    // A merge's primary/secondary and an object's relationship person side are person
    // identifiers, so they use cio_id like identify/track — not an auto-detected id/email.
    expect(bodies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          action: 'merge',
          primary: { cio_id: 'cio_abc123' },
          secondary: { cio_id: 'cio_old456' },
        }),
        expect.objectContaining({
          type: 'object',
          cio_relationships: [{ identifiers: { cio_id: 'cio_abc123' } }],
        }),
      ]),
    );
  });

  // There is no legacy auto-detection any more: userIdIdentifierType is required config for v2,
  // so without it the event fails rather than guessing id/email/anonymous_id.
  it.each([
    {
      name: 'userId is present',
      message: { type: 'identify', userId: 'user-1', traits: { plan: 'pro' } },
    },
    {
      name: 'only email is present',
      message: { type: 'identify', traits: { email: 'test@example.com', plan: 'pro' } },
    },
    {
      name: 'only anonymousId is present',
      message: { type: 'track', event: 'Anonymous Event', anonymousId: 'anon-1', properties: {} },
    },
  ])(
    'fails a V2 person event when userIdIdentifierType is not configured — $name',
    async ({ message }) => {
      const v2Destination = makeV2Destination({ userIdIdentifierType: undefined });
      const integration = new Integration(v2Destination);
      const input = makeEventStreamInput(message, v2Destination);

      const { successPayloads, errorPayloads } = await integration.transformEvents([input]);
      expect(successPayloads).toHaveLength(0);
      expect(errorPayloads).toHaveLength(1);
      expect(errorPayloads[0].error).toMatch(/userIdIdentifierType not found in Configs/);
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
