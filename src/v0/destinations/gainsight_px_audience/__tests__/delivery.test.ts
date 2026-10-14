import { Integration } from '../routerTransform';
import {
  firstJobIdentity,
  handleDeliveryResponse,
  resolveDeliverySpec,
  toDeliveryV1Response,
} from '../../../../services/destination/destinationIntegration/delivery';
import type { DeliveryContext } from '../../../../services/destination/destinationIntegration/delivery';
import type { ProxyMetdata, ProxyV1Request } from '../../../../types';
import { TransformerProxyError } from '../../../util/errorTypes';

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

type Outcome = { status: number; codes: number[]; message: string; errorType?: string };

/**
 * The real framework path: handleDeliveryResponse → toDeliveryV1Response. A uniform failure leaves
 * the bridge as a TransformerProxyError carrying ctx.status, which is what rudder-server sees.
 */
const deliver = (ctx: DeliveryContext): Outcome => {
  try {
    const response = toDeliveryV1Response(handleDeliveryResponse(Integration, ctx), ctx, DEST);
    return {
      status: response.status,
      codes: response.response.map((r) => r.statusCode),
      message: response.message,
    };
  } catch (error) {
    if (!(error instanceof TransformerProxyError)) throw error;
    return {
      status: error.status,
      codes: ctx.jobs.map(() => error.status),
      message: error.message,
      errorType: (error.statTags as { errorType?: string }).errorType,
    };
  }
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

describe('gainsight_px_audience delivery — spec', () => {
  it('overrides only 404; every other status takes the default classification', () => {
    expect(Object.keys(resolveDeliverySpec(Integration).statusOverrides)).toEqual(['404']);
  });
});

describe('gainsight_px_audience delivery — through the framework', () => {
  const failed = (status: number, reason: string, errorType: string): Outcome => ({
    status,
    codes: [status],
    message: `[${DEST}] ${reason}`,
    errorType,
  });
  const delivered = (status: number): Outcome => ({
    status,
    codes: [200],
    message: `[${DEST}] Request processed successfully`,
  });

  it.each<[string, number, unknown, unknown, Outcome]>([
    ['204 → success', 204, '', true, delivered(204)],
    [
      '404 on false → success (an absent user is not a member)',
      404,
      { message: 'User not found' },
      false,
      delivered(404),
    ],
    [
      '404 on true → abort, user not found',
      404,
      { message: 'User not found' },
      true,
      failed(404, 'Gainsight PX user not found', 'aborted'),
    ],
    [
      '404 with an unreadable body value → abort, never a silent success',
      404,
      {},
      'false',
      failed(404, 'Gainsight PX user not found', 'aborted'),
    ],
    [
      '400 disabled/unknown attribute → abort, attribute missing',
      400,
      ATTRIBUTE_MISSING_BODY,
      true,
      failed(400, 'Gainsight PX attribute is missing or disabled', 'aborted'),
    ],
    [
      '400 type mismatch → abort, generic 400',
      400,
      TYPE_MISMATCH_BODY,
      true,
      failed(400, 'Gainsight PX rejected the request (400)', 'aborted'),
    ],
    [
      '401 → abort, key or data center',
      401,
      { message: 'Unauthorized' },
      true,
      failed(401, 'Gainsight PX rejected the API key or data center', 'aborted'),
    ],
    [
      '403 → abort, lacks Write',
      403,
      { message: 'Forbidden' },
      false,
      failed(403, 'Gainsight PX API key lacks Write permission', 'aborted'),
    ],
    [
      '409 → abort, other 4xx',
      409,
      {},
      true,
      failed(409, 'Gainsight PX rejected the request (409)', 'aborted'),
    ],
    [
      '429 → throttled',
      429,
      { message: 'Too many requests' },
      true,
      failed(429, 'Gainsight PX rate limit exceeded', 'throttled'),
    ],
    [
      '500 → retry',
      500,
      { message: 'boom' },
      true,
      failed(500, 'Gainsight PX server error (500)', 'retryable'),
    ],
    ['503 → retry', 503, '', false, failed(503, 'Gainsight PX server error (503)', 'retryable')],
  ])('%s', (_name, status, response, value, expected) => {
    expect(deliver(ctxFor(status, response, value))).toEqual(expected);
  });

  it('never copies PX text or the identifyId into the reason', () => {
    const { message } = deliver(ctxFor(400, TYPE_MISMATCH_BODY));
    expect(message).not.toContain('yes');
    expect(message).not.toContain('secret-user-id');
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
