import { Integration as GaecIntegration } from './routerTransform';
import {
  firstJobIdentity,
  handleDeliveryResponse,
  toDeliveryV1Response,
} from '../../../services/destination/destinationIntegration/delivery';
import type { DeliveryContext } from '../../../services/destination/destinationIntegration/delivery';
import type { ProxyMetdata, ProxyV1Request } from '../../../types';

const DEST = 'GOOGLE_ADWORDS_ENHANCED_CONVERSIONS';

const job = (jobId: number): ProxyMetdata =>
  ({
    jobId,
    attemptNum: 0,
    userId: `u${jobId}`,
    sourceId: 's1',
    destinationId: 'd1',
    workspaceId: 'w1',
    secret: {},
    dontBatch: false,
  }) as ProxyMetdata;

/**
 * `adjustments` defaults to one posted adjustment per job, which is what routerTransform emits.
 * Pass it explicitly to build a body the framework cannot line up with the job list.
 */
const ctxFor = (
  status: number,
  response: unknown,
  jobCount = 2,
  adjustments: unknown = Array.from({ length: jobCount }, (_, i) => ({ adjustment: i })),
): DeliveryContext => {
  const jobs = Array.from({ length: jobCount }, (_, i) => job(i + 1));
  return {
    status,
    response,
    jobs,
    request: {
      body: { JSON: { conversionAdjustments: adjustments, partialFailure: true } },
      endpoint: 'https://googleads.googleapis.com/v25/customers/123:uploadConversionAdjustments',
    } as unknown as ProxyV1Request,
    destinationConfig: {},
    ...firstJobIdentity(jobs),
  };
};

const viaFramework = (ctx: DeliveryContext) => {
  try {
    const response = toDeliveryV1Response(handleDeliveryResponse(GaecIntegration, ctx), ctx, DEST);
    return {
      threw: false,
      status: response.status,
      codes: response.response.map((r) => r.statusCode),
      errors: response.response.map((r) => r.error),
    };
  } catch (e: any) {
    return {
      threw: true,
      status: e.status,
      errorType: e.statTags?.errorType,
      authErrorCategory: e.authErrorCategory,
    };
  }
};

const twoStepAuthError = {
  error: {
    message: 'auth problem',
    details: [
      { errors: [{ errorCode: { authenticationError: 'TWO_STEP_VERIFICATION_NOT_ENROLLED' } }] },
    ],
  },
};

describe('gaec delivery — default status handling', () => {
  const statusCases = [
    {
      name: 'returns success for 2xx without a partial failure',
      status: 200,
      response: { results: [{ a: 1 }, { b: 2 }] },
      expected: {
        threw: false,
        status: 200,
        codes: [200, 200],
        errors: ['success', 'success'],
      },
    },
    {
      name: 'returns success when partialFailureError code is 0',
      status: 200,
      response: { partialFailureError: { code: 0 }, results: [{ a: 1 }, { b: 2 }] },
      expected: {
        threw: false,
        status: 200,
        codes: [200, 200],
        errors: ['success', 'success'],
      },
    },
    {
      name: 'aborts a non-auth 400 response',
      status: 400,
      response: { error: { message: 'bad request' } },
      expected: { threw: true, status: 400, errorType: 'aborted' },
    },
    {
      name: 'retries a 500 response',
      status: 500,
      response: { error: { message: 'internal' } },
      expected: { threw: true, status: 500, errorType: 'retryable' },
    },
  ];

  it.each(statusCases)('$name', ({ status, response, expected }) => {
    expect(viaFramework(ctxFor(status, response))).toMatchObject(expected);
  });
});

describe('gaec delivery — auth categories come from the response body', () => {
  const authCases = [
    {
      name: '401 with TWO_STEP_VERIFICATION_NOT_ENROLLED -> revoked, aborts',
      status: 401,
      response: twoStepAuthError,
      authErrorCategory: 'AUTH_STATUS_INACTIVE',
      errorType: 'aborted',
    },
    {
      name: '401 with CUSTOMER_NOT_FOUND -> revoked, aborts',
      status: 401,
      response: {
        error: {
          message: 'no customer',
          details: [{ errors: [{ errorCode: { authenticationError: 'CUSTOMER_NOT_FOUND' } }] }],
        },
      },
      authErrorCategory: 'AUTH_STATUS_INACTIVE',
      errorType: 'aborted',
    },
    {
      name: '401 otherwise -> expired, retries after refresh',
      status: 401,
      response: { error: { message: 'token stale' } },
      authErrorCategory: 'REFRESH_TOKEN',
      errorType: 'retryable',
    },
    {
      name: '403 -> revoked, aborts',
      status: 403,
      response: { error: { message: 'access denied' } },
      authErrorCategory: 'AUTH_STATUS_INACTIVE',
      errorType: 'aborted',
    },
    {
      name: '400 -> no auth category at all',
      status: 400,
      response: { error: { message: 'bad request' } },
      authErrorCategory: '',
      errorType: 'aborted',
    },
  ];

  it.each(authCases)('$name', ({ status, response, authErrorCategory, errorType }) => {
    const result = viaFramework(ctxFor(status, response));
    expect(result.threw).toBe(true);
    expect(result.authErrorCategory).toBe(authErrorCategory);
    expect(result.errorType).toBe(errorType);
  });

  it('uses the destination error message as the failure reason', () => {
    const ctx = ctxFor(400, { error: { message: 'INVALID_GCLID' } });
    expect(() =>
      toDeliveryV1Response(handleDeliveryResponse(GaecIntegration, ctx), ctx, DEST),
    ).toThrow('INVALID_GCLID');
  });
});

describe('gaec delivery — partial failure on a 2xx', () => {
  it('maps empty results positionally, keeping the destination status', () => {
    const ctx = ctxFor(
      200,
      {
        partialFailureError: { code: 3, message: 'duplicate enhancement' },
        results: [{ ok: 1 }, {}, { ok: 1 }],
      },
      3,
    );
    const result = toDeliveryV1Response(handleDeliveryResponse(GaecIntegration, ctx), ctx, DEST);
    // Google answered 200; the bridge passes that through rather than relabelling the batch 207.
    expect(result.status).toBe(200);
    expect(result.response.map((r) => r.statusCode)).toEqual([200, 400, 200]);
    expect(result.response[1].error).toBe('duplicate enhancement');
    // The batch-level message keeps Google's reason, which used to be lost to a fixed string.
    expect(result.message).toBe(`[${DEST}] duplicate enhancement`);
  });

  it('does not echo the 200 into per-job codes when every adjustment failed', () => {
    const ctx = ctxFor(200, {
      partialFailureError: { code: 3, message: 'all bad' },
      results: [{}, {}],
    });
    const result = toDeliveryV1Response(handleDeliveryResponse(GaecIntegration, ctx), ctx, DEST);
    expect(result.response.map((r) => r.statusCode)).toEqual([400, 400]);
  });

  it('aborts every adjustment when results is absent despite partialFailureError being set', () => {
    // Indexing off the posted adjustments keeps the list job-aligned, so a missing `results` reads
    // as "no adjustment confirmed" — the same conclusion `results?.[i] ?? {}` reached in the legacy
    // handler, rather than a lost-attribution retry that would re-upload accepted adjustments.
    const ctx = ctxFor(200, { partialFailureError: { code: 3, message: 'no results' } });
    const result = toDeliveryV1Response(handleDeliveryResponse(GaecIntegration, ctx), ctx, DEST);
    expect(result.response).toHaveLength(2);
    expect(result.response.map((r) => r.statusCode)).toEqual([400, 400]);
    expect(result.response.map((r) => r.error)).toEqual(['no results', 'no results']);
  });

  it('aborts only the tail when results is shorter than the posted adjustments', () => {
    const ctx = ctxFor(200, {
      partialFailureError: { code: 3, message: 'partial' },
      results: [{ adjustment: 'ok' }],
    });
    const result = toDeliveryV1Response(handleDeliveryResponse(GaecIntegration, ctx), ctx, DEST);
    expect(result.response.map((r) => r.statusCode)).toEqual([200, 400]);
  });

  it('falls back to the bridge retry when the posted adjustments cannot be read', () => {
    // Nothing job-aligned to index, so the framework's attribution guard takes over rather than
    // reporting jobs Google flagged as failed delivered.
    // `null` rather than `undefined`: an omitted argument would take the default body.
    const ctx = ctxFor(200, { partialFailureError: { code: 3, message: 'unreadable' } }, 2, null);
    const result = toDeliveryV1Response(handleDeliveryResponse(GaecIntegration, ctx), ctx, DEST);
    expect(result.response.every((r) => r.metadata !== undefined)).toBe(true);
    expect(result.response.map((r) => r.statusCode)).toEqual([500, 500]);
  });
});
