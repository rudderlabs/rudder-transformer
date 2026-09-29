import {
  firstJobIdentity,
  handleDeliveryResponse,
  reasonOf,
  resolveDeliverySpec,
} from '../../../services/destination/destinationIntegration/delivery';
import type {
  DeliveryContext,
  DeliveryRequestContext,
} from '../../../services/destination/destinationIntegration/delivery';
import type { ProxyMetdata, ProxyV1Request } from '../../../types';
import { Integration } from './routerTransform';

const job: ProxyMetdata = {
  jobId: 1,
  attemptNum: 1,
  userId: 'synthetic-user',
  sourceId: 'source-1',
  destinationId: 'rokt-dest-1',
  workspaceId: 'ws-1',
  secret: {},
  dontBatch: false,
};

const context = (status: number, response: unknown = {}): DeliveryContext => ({
  status,
  response,
  jobs: [job],
  request: { body: { JSON_ARRAY: { batch: '[]' } } } as unknown as ProxyV1Request,
  destinationConfig: {},
  ...firstJobIdentity([job]),
});

const deliveryRequest = (endpoint: string): ProxyV1Request =>
  ({
    endpoint,
    body: { JSON_ARRAY: { batch: '[]' } },
    metadata: [job],
  }) as unknown as ProxyV1Request;

const requestContext = (request: ProxyV1Request): DeliveryRequestContext => ({
  request,
  jobs: [job],
  destinationConfig: {
    apiEndpoint: 'https://s2s.mparticle.com/',
    serverToServerKey: 'server-key',
    serverToServerSecret: 'server-secret',
  },
  ...firstJobIdentity([job]),
});

describe('ROKT delivery', () => {
  it('rejects an outbound endpoint that does not exactly match the configured endpoint', () => {
    const { prepareRequest } = resolveDeliverySpec(Integration);
    const expected = deliveryRequest('https://s2s.mparticle.com/v2/bulkevents');
    expect(prepareRequest?.(expected, requestContext(expected))).toEqual({
      ...expected,
      headers: {
        Authorization: `Basic ${Buffer.from('server-key:server-secret').toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });
    expect(expected.headers).toBeUndefined();

    const forged = deliveryRequest('https://attacker.example/v2/bulkevents');
    expect(() => prepareRequest?.(forged, requestContext(forged))).toThrow(
      'ROKT delivery endpoint does not match the configured endpoint',
    );
  });

  it('classifies only HTTP 202 as successful', () => {
    expect(handleDeliveryResponse(Integration, context(202))).toEqual({ kind: 'success' });
    for (const status of [200, 201, 204, 206]) {
      expect(handleDeliveryResponse(Integration, context(status))).toEqual({
        kind: 'abort',
        reason: `mParticle rejected the bulk request (status ${status}); no safe error detail returned.`,
      });
    }
  });

  it('preserves framework abort, throttle, and retry semantics for non-2xx responses', () => {
    expect(handleDeliveryResponse(Integration, context(400))).toMatchObject({ kind: 'abort' });
    expect(handleDeliveryResponse(Integration, context(429))).toMatchObject({
      kind: 'retry',
      as: 'throttled',
    });
    expect(handleDeliveryResponse(Integration, context(503))).toMatchObject({ kind: 'retry' });
  });

  it('never copies partner response text or PII into failure reasons', () => {
    const unsafe = 'unsafe-response customer@example.test server-secret';
    const verdict = handleDeliveryResponse(Integration, context(400, { message: unsafe }));
    const reason = reasonOf(verdict.kind === 'perItem' ? { kind: 'abort', reason: '' } : verdict);

    expect(reason).toBe(
      'mParticle rejected the bulk request (status 400); no safe error detail returned.',
    );
    expect(reason).not.toContain(unsafe);
  });
});
