import { ConfigurationError, InstrumentationError } from '@rudderstack/integrations-lib';
import { Integration } from './routerTransform';

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
};

const baseConnection = {
  sourceId: 'src-1',
  destinationId: 'dest-1',
  enabled: true,
  config: {
    destination: {},
  },
};

const makeInput = (overrides: Record<string, unknown>) => ({
  message: {
    type: 'record',
    action: 'insert',
    identifiers: { id: 'user-1', plan: 'pro' },
    ...overrides,
  },
  metadata: { jobId: 1, userId: 'u1', workspaceId: 'ws-1' },
  destination: baseDestination,
});

describe('CustomerIOIntegration — record event routing', () => {
  it('transforms insert record into identify person payload', () => {
    const integration = new Integration(baseDestination as any, baseConnection as any);
    const result = integration.transformEvent(makeInput({}) as any);
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

  it('transforms delete record into delete person payload without attributes', () => {
    const integration = new Integration(baseDestination as any, baseConnection as any);
    const result = integration.transformEvent(makeInput({ action: 'delete' }) as any);
    expect(result.body).toMatchObject({
      type: 'person',
      action: 'delete',
      identifiers: { id: 'user-1' },
    });
    expect((result.body as any).attributes).toBeUndefined();
  });

  it('throws InstrumentationError for unsupported action', () => {
    const integration = new Integration(baseDestination as any, baseConnection as any);
    expect(() => integration.transformEvent(makeInput({ action: 'upsert' }) as any)).toThrow(
      InstrumentationError,
    );
  });

  it('succeeds when connection is absent (no connection config needed for record events)', () => {
    const integration = new Integration(baseDestination as any, undefined);
    const result = integration.transformEvent(makeInput({}) as any);
    expect(result.body).toMatchObject({
      type: 'person',
      action: 'identify',
      identifiers: { id: 'user-1' },
    });
  });

  it('batches multiple record events into one { batch: [...] } body', async () => {
    const integration = new Integration(baseDestination as any, baseConnection as any);
    const inputs = [
      makeInput({ identifiers: { id: 'u1', plan: 'pro' } }),
      makeInput({ action: 'update', identifiers: { id: 'u2', plan: 'starter' } }),
      makeInput({ action: 'delete', identifiers: { id: 'u3' } }),
    ];
    const { successPayloads } = await integration.transformEvents(inputs as any);
    expect(successPayloads).toHaveLength(3);

    const strategy = (integration as any).getBatchStrategy();
    const batches = await strategy.batch(successPayloads);
    expect(batches).toHaveLength(1);
    const batchBody = batches[0].body as any;
    expect(batchBody.batch).toHaveLength(3);
    expect(batchBody.batch[0]).toMatchObject({ type: 'person', action: 'identify' });
    expect(batchBody.batch[2]).toMatchObject({ type: 'person', action: 'delete' });
  });
});
