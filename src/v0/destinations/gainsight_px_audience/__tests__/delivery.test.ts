import { Integration } from '../routerTransform';
import {
  firstJobIdentity,
  handleDeliveryResponse,
  resolveDeliverySpec,
  toDeliveryV1Response,
} from '../../../../services/destination/destinationIntegration/delivery';
import type { DeliveryContext } from '../../../../services/destination/destinationIntegration/delivery';
import type { ProxyMetdata, ProxyV1Request } from '../../../../types';

const DEST = 'GAINSIGHT_PX_AUDIENCE';
const ENDPOINT = 'https://api.aptrinsic.com/v1/users/update';

const job = (jobId: number): ProxyMetdata =>
  ({
    jobId,
    attemptNum: 0,
    userId: `u${jobId}`,
    sourceId: 's1',
    destinationId: 'dest-1',
    workspaceId: 'workspace-1',
    secret: {},
    dontBatch: false,
  }) as ProxyMetdata;

const ctxFor = (status: number, response: unknown, value: unknown = true): DeliveryContext => {
  const jobs = [job(1)];
  return {
    status,
    response,
    jobs,
    request: {
      method: 'PUT',
      endpoint: ENDPOINT,
      headers: { 'Content-Type': 'application/json' },
      body: { JSON: { identifyId: 'secret-user-id', customAttributes: { rs_gpx_e2e: value } } },
    } as unknown as ProxyV1Request,
    destinationConfig: { apiKey: '  live-key  ', dataCenter: 'US' },
    ...firstJobIdentity(jobs),
  };
};

/** The real framework path: handleDeliveryResponse → toDeliveryV1Response; a throw is a failure here. */
const deliver = (ctx: DeliveryContext) => {
  const response = toDeliveryV1Response(handleDeliveryResponse(Integration, ctx), ctx, DEST);
  return {
    codes: response.response.map((r) => r.statusCode),
    errors: response.response.map((r) => r.error),
  };
};

const ATTRIBUTE_MISSING_BODY = {
  externalapierror: {
    status: 'BAD_REQUEST',
    subErrors: [
      { message: "User custom attribute api name 'rs_gpx_e2e' does not exist or not enabled" },
    ],
  },
};
const TYPE_MISMATCH_BODY = {
  externalapierror: {
    status: 'BAD_REQUEST',
    subErrors: [{ message: "value 'yes' does not match the type BOOLEAN", rejectedValue: 'yes' }],
  },
};

describe('gainsight_px_audience delivery — per-item verdicts for every response', () => {
  it.each([
    ['204 → success', 204, '', true, 200, 'success'],
    [
      '404 on false → success (an absent user is not a member)',
      404,
      { message: 'User not found' },
      false,
      200,
      'success',
    ],
    [
      '404 on true → abort, user not found',
      404,
      { message: 'User not found' },
      true,
      400,
      'Gainsight PX user not found',
    ],
    [
      '404 with an unreadable body value → abort, never a silent success',
      404,
      {},
      'false',
      400,
      'Gainsight PX user not found',
    ],
    [
      '400 disabled/unknown attribute → attribute missing',
      400,
      ATTRIBUTE_MISSING_BODY,
      true,
      400,
      'Gainsight PX attribute is missing or disabled',
    ],
    [
      '400 type mismatch → generic 400 abort',
      400,
      TYPE_MISMATCH_BODY,
      true,
      400,
      'Gainsight PX rejected the request (400)',
    ],
    [
      '401 → abort, key or data center',
      401,
      { message: 'Unauthorized' },
      true,
      400,
      'Gainsight PX rejected the API key or data center',
    ],
    [
      '403 → abort, lacks Write',
      403,
      { message: 'Forbidden' },
      false,
      400,
      'Gainsight PX API key lacks Write permission',
    ],
    ['409 → abort, other 4xx', 409, {}, true, 400, 'Gainsight PX rejected the request (409)'],
    [
      '429 → throttled',
      429,
      { message: 'Too many requests' },
      true,
      429,
      'Gainsight PX rate limit exceeded',
    ],
    ['500 → retry', 500, { message: 'boom' }, true, 500, 'Gainsight PX server error (500)'],
    ['503 → retry', 503, '', false, 500, 'Gainsight PX server error (503)'],
  ])('%s', (_name, status, response, value, code, error) => {
    expect(deliver(ctxFor(status, response, value))).toEqual({ codes: [code], errors: [error] });
  });

  it('never copies PX text or the identifyId into a reason', () => {
    const { errors } = deliver(ctxFor(400, TYPE_MISMATCH_BODY));
    expect(errors[0]).not.toContain('yes');
    expect(errors[0]).not.toContain('secret-user-id');
  });
});

describe('gainsight_px_audience delivery — prepareRequest', () => {
  const { prepareRequest } = resolveDeliverySpec(Integration);
  const reqCtx = (apiKey: unknown) => {
    const ctx = ctxFor(204, '');
    return { ...ctx, destinationConfig: { apiKey, dataCenter: 'US' } };
  };

  it('adds the trimmed key from destinationConfig and keeps the other headers', () => {
    const ctx = reqCtx('  live-key  ');
    const sent = prepareRequest!(ctx.request, ctx);
    expect(sent.headers).toEqual({
      'Content-Type': 'application/json',
      'X-APTRINSIC-API-KEY': 'live-key',
    });
    // The persisted request is untouched — the key never reaches the job.
    expect(ctx.request.headers).toEqual({ 'Content-Type': 'application/json' });
  });

  it.each([[''], ['   '], [undefined]])('refuses to send without a key (%p)', (apiKey) => {
    const ctx = reqCtx(apiKey);
    expect(() => prepareRequest!(ctx.request, ctx)).toThrow('Gainsight PX API key is missing');
  });
});
