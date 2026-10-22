import { Integration } from '../routerTransform';
import { isLeave } from '../delivery';
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

const ctxWithAttributes = (
  status: number,
  response: unknown,
  customAttributes: unknown,
): DeliveryContext => {
  const base = ctxFor(status, response);
  return {
    ...base,
    request: {
      ...base.request,
      body: { JSON: { identifyId: 'secret-user-id', customAttributes } },
    } as unknown as ProxyV1Request,
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

const MULTI_SUBERROR_BODY = {
  externalapierror: {
    status: 'BAD_REQUEST',
    subErrors: [{ message: 'first problem' }, { message: 'second problem' }],
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
      '404 on true → abort with PX message',
      404,
      { message: 'User not found' },
      true,
      failed(404, 'User not found', 'aborted'),
    ],
    [
      '404 with an unreadable body value → abort, never a silent success',
      404,
      {},
      'false',
      failed(404, 'Gainsight PX request failed with status 404', 'aborted'),
    ],
    [
      '400 disabled/unknown attribute → abort with the PX subError message',
      400,
      ATTRIBUTE_MISSING_BODY,
      true,
      failed(
        400,
        "User custom attribute api name 'rs_gpx_e2e' does not exist or not enabled",
        'aborted',
      ),
    ],
    [
      '400 with several subErrors → abort with all of them joined',
      400,
      MULTI_SUBERROR_BODY,
      true,
      failed(400, 'first problem; second problem', 'aborted'),
    ],
    [
      '401 → abort with PX message',
      401,
      { message: 'Unauthorized' },
      true,
      failed(401, 'Unauthorized', 'aborted'),
    ],
    [
      '403 → abort with PX message',
      403,
      { message: 'Forbidden' },
      false,
      failed(403, 'Forbidden', 'aborted'),
    ],
    [
      '409 with no message → abort with the fallback',
      409,
      {},
      true,
      failed(409, 'Gainsight PX request failed with status 409', 'aborted'),
    ],
    [
      '429 → throttled with PX message',
      429,
      { message: 'Too many requests' },
      true,
      failed(429, 'Too many requests', 'throttled'),
    ],
    [
      '500 → retry with PX message',
      500,
      { message: 'boom' },
      true,
      failed(500, 'boom', 'retryable'),
    ],
    [
      '503 with an empty body → retry with the fallback',
      503,
      '',
      false,
      failed(503, 'Gainsight PX request failed with status 503', 'retryable'),
    ],
  ])('%s', (_name, status, response, value, expected) => {
    expect(deliver(ctxFor(status, response, value))).toEqual(expected);
  });

  it('never copies the identifyId into the reason', () => {
    const { message } = deliver(ctxFor(400, TYPE_MISMATCH_BODY));
    expect(message).toBe(`[${DEST}] value 'yes' does not match the type BOOLEAN`);
    expect(message).not.toContain('secret-user-id');
  });
});

describe('gainsight_px_audience delivery — no send-time request rewrite', () => {
  it('declares no prepareRequest: the transform already set the API key header', () => {
    expect(resolveDeliverySpec(Integration).prepareRequest).toBeUndefined();
  });
});

describe('gainsight_px_audience delivery — leave detection (trait-mappings D24)', () => {
  it.each<[string, unknown, boolean]>([
    ['exactly one key, false', { rs_gpx_e2e: false }, true],
    ['one key, true', { rs_gpx_e2e: true }, false],
    ['flag true plus traits', { rs_gpx_e2e: true, rs_gpx_string: 'a' }, false],
    ['false plus another key', { rs_gpx_e2e: false, rs_gpx_string: 'a' }, false],
    ['one key, the string "false"', { rs_gpx_e2e: 'false' }, false],
    ['one key, 0', { rs_gpx_e2e: 0 }, false],
    ['no keys', {}, false],
    ['null', null, false],
    ['an array', [false], false],
  ])('%s → isLeave %p', (_name, customAttributes, expected) => {
    expect(isLeave(ctxWithAttributes(404, {}, customAttributes))).toBe(expected);
  });

  it('404 on a member write with traits aborts with the PX message', () => {
    expect(
      deliver(
        ctxWithAttributes(
          404,
          { message: 'User not found' },
          { rs_gpx_e2e: true, rs_gpx_number: 42 },
        ),
      ),
    ).toEqual({
      status: 404,
      codes: [404],
      message: `[${DEST}] User not found`,
      errorType: 'aborted',
    });
  });

  it('404 on a leave succeeds', () => {
    expect(
      deliver(ctxWithAttributes(404, { message: 'User not found' }, { rs_gpx_e2e: false })),
    ).toEqual({
      status: 404,
      codes: [200],
      message: `[${DEST}] Request processed successfully`,
    });
  });

  it('a type-mismatch 400 on a trait aborts with the PX message naming the attribute', () => {
    const body = {
      externalapierror: {
        status: 'BAD_REQUEST',
        subErrors: [
          {
            message: 'User custom attribute rs_gpx_number value abc does not match the type NUMBER',
            rejectedValue: { rs_gpx_e2e: true, rs_gpx_number: 'abc' },
          },
        ],
      },
    };
    const { message } = deliver(
      ctxWithAttributes(400, body, { rs_gpx_e2e: true, rs_gpx_number: 'abc' }),
    );
    expect(message).toBe(
      `[${DEST}] User custom attribute rs_gpx_number value abc does not match the type NUMBER`,
    );
    expect(message).not.toContain('secret-user-id');
  });
});
