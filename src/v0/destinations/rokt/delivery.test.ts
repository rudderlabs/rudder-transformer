import {
  firstJobIdentity,
  handleDeliveryResponse,
  reasonOf,
} from '../../../services/destination/destinationIntegration/delivery';
import type { DeliveryContext } from '../../../services/destination/destinationIntegration/delivery';
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

const context = (status: number, response: unknown = {}, jobCount = 1): DeliveryContext => {
  const jobs = Array.from({ length: jobCount }, (_, index) => ({ ...job, jobId: index + 1 }));

  return {
    status,
    response,
    jobs,
    request: { body: { JSON_ARRAY: { batch: '[]' } } } as unknown as ProxyV1Request,
    destinationConfig: {},
    ...firstJobIdentity(jobs),
  };
};

describe('ROKT delivery', () => {
  it('treats HTTP 202 with an empty response body as successful', () => {
    expect(handleDeliveryResponse(Integration, context(202))).toEqual({ kind: 'success' });
  });

  it('retries HTTP 202 partial failures as individual events', () => {
    expect(
      handleDeliveryResponse(
        Integration,
        context(202, { errors: [{ code: 'BAD_REQUEST', message: 'invalid event' }] }, 2),
      ),
    ).toEqual({
      kind: 'retry',
      reason: 'Rokt partially rejected the bulk request; retrying each event individually.',
      dontBatch: true,
    });
  });

  it('aborts every event when HTTP 202 reports one error per job', () => {
    expect(
      handleDeliveryResponse(
        Integration,
        context(
          202,
          {
            errors: [
              { code: 'BAD_REQUEST', message: 'invalid event 1' },
              { code: 'BAD_REQUEST', message: 'invalid event 2' },
            ],
          },
          2,
        ),
      ),
    ).toEqual({
      kind: 'abort',
      reason: 'Rokt rejected every event in the bulk request.',
    });
  });

  it('aborts HTTP 400 responses', () => {
    expect(handleDeliveryResponse(Integration, context(400))).toMatchObject({ kind: 'abort' });
  });

  it('preserves framework success, throttle, and retry semantics for other responses', () => {
    expect(handleDeliveryResponse(Integration, context(200))).toEqual({ kind: 'success' });
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
      'Rokt rejected the bulk request (status 400); no safe error detail returned.',
    );
    expect(reason).not.toContain(unsafe);
  });
});
