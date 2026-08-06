import { Integration as GaecIntegration } from './routerTransform';
import { toDeliveryV1Response } from '../../../services/destination/nativeBatching/delivery';
import type { DeliveryContext } from '../../../services/destination/nativeBatching/delivery';
import { gaecResponseHandler } from '../../../v1/destinations/google_adwords_enhanced_conversions/networkHandler';
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
): DeliveryContext => ({
  status,
  response,
  jobs: Array.from({ length: jobCount }, (_, i) => job(i + 1)),
  request: {
    body: { JSON: { conversionAdjustments: adjustments, partialFailure: true } },
    endpoint: '',
  } as unknown as ProxyV1Request,
  destinationConfig: {},
});

const viaFramework = (ctx: DeliveryContext) => {
  try {
    const response = toDeliveryV1Response(GaecIntegration.handleResponse(ctx), ctx, DEST);
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

const viaLegacy = (ctx: DeliveryContext) => {
  try {
    const response = gaecResponseHandler({
      destinationResponse: { status: ctx.status, response: ctx.response },
      rudderJobMetadata: ctx.jobs,
    });
    return {
      threw: false,
      status: response.status,
      // `response` is optional on ResponseProxyObject; a missing one would make the parity
      // assertion fail loudly against the framework's populated list, which is what we want.
      codes: response.response?.map((r) => r.statusCode) ?? [],
      errors: response.response?.map((r) => r.error) ?? [],
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

describe('gaec delivery — parity with the existing response handler', () => {
  const parityCases = [
    {
      name: '2xx, no partialFailureError',
      status: 200,
      response: { results: [{ a: 1 }, { b: 2 }] },
    },
    {
      name: '2xx, partialFailureError code 0 means no error',
      status: 200,
      response: { partialFailureError: { code: 0 }, results: [{ a: 1 }, { b: 2 }] },
    },
    {
      name: '2xx, one empty result means that adjustment failed',
      status: 200,
      response: {
        partialFailureError: { code: 3, message: 'duplicate enhancement' },
        results: [{ a: 1 }, {}],
      },
    },
    { name: '400 abort', status: 400, response: { error: { message: 'bad request' } } },
    { name: '500 retry', status: 500, response: { error: { message: 'internal' } } },
    { name: '403 access denied', status: 403, response: { error: { message: 'denied' } } },
    { name: '401 stale token', status: 401, response: { error: { message: 'unauthorized' } } },
    { name: '401 two-step not enrolled', status: 401, response: twoStepAuthError },
  ];

  it.each(parityCases)('per-job codes match: $name', ({ status, response }) => {
    const ctx = ctxFor(status, response);
    const next = viaFramework(ctx);
    const prev = viaLegacy(ctx);

    expect(next.threw).toBe(prev.threw);
    if (prev.threw) {
      expect(next.status).toBe(prev.status);
      expect(next.authErrorCategory ?? '').toBe(prev.authErrorCategory ?? '');
      return;
    }
    expect(next.codes).toEqual(prev.codes);
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
    expect(() => toDeliveryV1Response(GaecIntegration.handleResponse(ctx), ctx, DEST)).toThrow(
      'INVALID_GCLID',
    );
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
    const result = toDeliveryV1Response(GaecIntegration.handleResponse(ctx), ctx, DEST);
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
    const result = toDeliveryV1Response(GaecIntegration.handleResponse(ctx), ctx, DEST);
    expect(result.response.map((r) => r.statusCode)).toEqual([400, 400]);
  });

  it('aborts every adjustment when results is absent despite partialFailureError being set', () => {
    // Indexing off the posted adjustments keeps the list job-aligned, so a missing `results` reads
    // as "no adjustment confirmed" — the same conclusion `results?.[i] ?? {}` reached in the legacy
    // handler, rather than a lost-attribution retry that would re-upload accepted adjustments.
    const ctx = ctxFor(200, { partialFailureError: { code: 3, message: 'no results' } });
    const result = toDeliveryV1Response(GaecIntegration.handleResponse(ctx), ctx, DEST);
    expect(result.response).toHaveLength(2);
    expect(result.response.map((r) => r.statusCode)).toEqual([400, 400]);
    expect(result.response.map((r) => r.error)).toEqual(['no results', 'no results']);
  });

  it('aborts only the tail when results is shorter than the posted adjustments', () => {
    const ctx = ctxFor(200, {
      partialFailureError: { code: 3, message: 'partial' },
      results: [{ adjustment: 'ok' }],
    });
    const result = toDeliveryV1Response(GaecIntegration.handleResponse(ctx), ctx, DEST);
    expect(result.response.map((r) => r.statusCode)).toEqual([200, 400]);
  });

  it('falls back to the bridge retry when the posted adjustments cannot be read', () => {
    // Nothing job-aligned to index, so the framework's attribution guard takes over rather than
    // reporting jobs Google flagged as failed delivered.
    // `null` rather than `undefined`: an omitted argument would take the default body.
    const ctx = ctxFor(200, { partialFailureError: { code: 3, message: 'unreadable' } }, 2, null);
    const result = toDeliveryV1Response(GaecIntegration.handleResponse(ctx), ctx, DEST);
    expect(result.response.every((r) => r.metadata !== undefined)).toBe(true);
    expect(result.response.map((r) => r.statusCode)).toEqual([500, 500]);
  });
});
