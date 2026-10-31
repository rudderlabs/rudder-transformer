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

const DEST = 'AIRSHIP_AUDIENCE';
const NAMED_USER = 'secret-named-user-id';
const TOKEN = 'secret-airship-token';
const LONG_TAG = 't'.repeat(129);

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

const ctxFor = (status: number, response: unknown, jobCount = 3): DeliveryContext => {
  const jobs = Array.from({ length: jobCount }, (_, i) => job(i + 1));
  return {
    status,
    response,
    jobs,
    request: {
      method: 'POST',
      endpoint: 'https://go.urbanairship.com/api/named_users/tags',
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: {
        JSON: {
          audience: { named_user_id: jobs.map(() => NAMED_USER) },
          add: { rudderstack_audiences: ['rs_air_e2e'] },
        },
      },
    } as unknown as ProxyV1Request,
    destinationConfig: { apiKey: TOKEN, dataCenter: 'US', tagGroup: 'rudderstack_audiences' },
    ...firstJobIdentity(jobs),
  };
};

type Outcome = {
  status: number;
  codes: number[];
  message: string;
  dontBatch?: boolean[];
  errorType?: string;
};

/** The real framework path: handleDeliveryResponse → toDeliveryV1Response. */
const deliver = (ctx: DeliveryContext): Outcome => {
  try {
    const response = toDeliveryV1Response(handleDeliveryResponse(Integration, ctx), ctx, DEST);
    return {
      status: response.status,
      codes: response.response.map((r) => r.statusCode),
      message: response.message,
      dontBatch: response.response.map((r) => Boolean(r.metadata.dontBatch)),
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

const MISSING_GROUP = {
  ok: false,
  error:
    'No valid tag groups were contained in the request: The following tag groups do not exist: rs_air_missing_group',
  error_code: 40090,
};
const INVALID_TAG = {
  ok: false,
  error: 'Could not parse request body.',
  error_code: 40006,
  details: { error: `Invalid Tag '${LONG_TAG}' is greater than 128 characters.` },
};
const UNAUTHORIZED = { ok: false, error: 'Unauthorized', error_code: 40101 };
const HTML = '<html><body><h1>502 Bad Gateway</h1></body></html>';

describe('airship_audience delivery — spec', () => {
  it('overrides only 400; every other status takes the default classification', () => {
    expect(Object.keys(resolveDeliverySpec(Integration).statusOverrides)).toEqual(['400']);
  });

  it('declares no prepareRequest: the transform already set the headers', () => {
    expect(resolveDeliverySpec(Integration).prepareRequest).toBeUndefined();
  });
});

describe('airship_audience delivery — through the framework', () => {
  const thrown = (status: number, reason: string, errorType: string, n = 3): Outcome => ({
    status,
    codes: Array(n).fill(status),
    message: `[${DEST}] ${reason}`,
    errorType,
  });

  const cases: [string, number, unknown, number, Outcome][] = [
    [
      '200 → success for all',
      200,
      { ok: true },
      3,
      {
        status: 200,
        codes: [200, 200, 200],
        message: `[${DEST}] Request processed successfully`,
        dontBatch: [false, false, false],
      },
    ],
    [
      '400 40090 on three jobs → abort all, no dontBatch',
      400,
      MISSING_GROUP,
      3,
      thrown(400, `Airship 40090: ${MISSING_GROUP.error}`, 'aborted'),
    ],
    [
      '400 40006 on three jobs → retry with dontBatch',
      400,
      INVALID_TAG,
      3,
      {
        status: 400,
        codes: [500, 500, 500],
        message: `[${DEST}] Airship 40006: Could not parse request body.`,
        dontBatch: [true, true, true],
      },
    ],
    [
      '400 40006 on a single job → abort',
      400,
      INVALID_TAG,
      1,
      {
        status: 400,
        codes: [400],
        message: `[${DEST}] Airship 40006: Could not parse request body.`,
        dontBatch: [false],
      },
    ],
    [
      '401 40101 → abort',
      401,
      UNAUTHORIZED,
      3,
      thrown(401, 'Airship 40101: Unauthorized', 'aborted'),
    ],
    [
      '403 without error_code → abort with Airship: <error>',
      403,
      { ok: false, error: 'Forbidden' },
      1,
      thrown(403, 'Airship: Forbidden', 'aborted', 1),
    ],
    [
      '429 → throttled',
      429,
      '',
      3,
      thrown(429, 'Airship request failed with status 429', 'throttled'),
    ],
    ['503 → retry', 503, '', 3, thrown(503, 'Airship request failed with status 503', 'retryable')],
    [
      '502 with an HTML body → retry with the static fallback',
      502,
      HTML,
      3,
      thrown(502, 'Airship request failed with status 502', 'retryable'),
    ],
    [
      '400 with an empty body → dontBatch retry with the static fallback',
      400,
      '',
      3,
      {
        status: 400,
        codes: [500, 500, 500],
        message: `[${DEST}] Airship request failed with status 400`,
        dontBatch: [true, true, true],
      },
    ],
  ];

  it.each(cases)('%s', (_name, status, response, jobCount, expected) => {
    expect(deliver(ctxFor(status, response, jobCount))).toEqual(expected);
  });

  it('never copies details, named user IDs or the token into the reason', () => {
    const { message } = deliver(ctxFor(400, INVALID_TAG));
    expect(message).not.toContain('greater than 128');
    expect(message).not.toContain(LONG_TAG);
    expect(message).not.toContain(NAMED_USER);
    expect(message).not.toContain(TOKEN);
  });
});
