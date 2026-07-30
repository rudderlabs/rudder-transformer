import { Integration as IterableAudienceIntegration } from './routerTransform';
import { toDeliveryV1Response } from '../../../services/destination/nativeBatching/delivery';
import type { DeliveryContext } from '../../../services/destination/nativeBatching/delivery';
import { AudienceListStrategy } from '../../../v1/destinations/iterable_audience/strategies/audience-list';
import type { DeliveryV1Response, ProxyMetdata, ProxyV1Request } from '../../../types';

const DEST = 'ITERABLE_AUDIENCE';
const SUBSCRIBE = 'https://api.iterable.com/api/lists/subscribe';
const UNSUBSCRIBE = 'https://api.iterable.com/api/lists/unsubscribe';

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

type Subscriber = { email?: string; userId?: string };

const ctxFor = (
  status: number,
  response: unknown,
  subscribers: Subscriber[],
  endpoint = SUBSCRIBE,
): DeliveryContext => ({
  status,
  response,
  jobs: subscribers.map((_s, i) => job(i + 1)),
  request: {
    body: { JSON: { listId: 42, subscribers } },
    endpoint,
  } as unknown as ProxyV1Request,
  destinationConfig: {},
});

const viaFramework = (ctx: DeliveryContext) => {
  try {
    const response = toDeliveryV1Response(
      IterableAudienceIntegration.handleResponse(ctx),
      ctx,
      DEST,
    );
    return {
      threw: false,
      codes: response.response.map((r) => r.statusCode),
      errors: response.response.map((r) => r.error),
    };
  } catch (e: any) {
    return { threw: true, status: e.status, authErrorCategory: e.authErrorCategory };
  }
};

const viaLegacy = (ctx: DeliveryContext) => {
  const strategy = new AudienceListStrategy();
  try {
    // `BaseStrategy.handleResponse` is declared `void` even though every concrete `handleSuccess`
    // returns a DeliveryV1Response, so the result has to be re-stated rather than inferred.
    const response = strategy.handleResponse({
      destinationResponse: { status: ctx.status, response: ctx.response },
      rudderJobMetadata: ctx.jobs,
      destType: DEST,
      destinationRequest: ctx.request,
    }) as unknown as DeliveryV1Response;
    return {
      threw: false,
      codes: response.response.map((r) => r.statusCode),
      errors: response.response.map((r) => r.error),
    };
  } catch (e: any) {
    return { threw: true, status: e.status, authErrorCategory: e.authErrorCategory };
  }
};

const twoSubscribers: Subscriber[] = [{ email: 'a@x.com' }, { email: 'b@x.com' }];

describe('iterable_audience delivery — parity with the AudienceListStrategy', () => {
  const parityCases = [
    {
      name: '200 clean',
      status: 200,
      response: { successCount: 2, failCount: 0 },
      subscribers: twoSubscribers,
      endpoint: SUBSCRIBE,
    },
    {
      name: '200 with an invalid email',
      status: 200,
      response: { failCount: 1, invalidEmails: ['b@x.com'] },
      subscribers: twoSubscribers,
      endpoint: SUBSCRIBE,
    },
    {
      name: '200 with a GDPR-forgotten email — accepted, not aborted',
      status: 200,
      response: { failCount: 1, failedUpdates: { forgottenEmails: ['b@x.com'] } },
      subscribers: twoSubscribers,
      endpoint: SUBSCRIBE,
    },
    {
      name: '200 notFound on unsubscribe — no-op success',
      status: 200,
      response: { failCount: 1, failedUpdates: { notFoundEmails: ['b@x.com'] } },
      subscribers: twoSubscribers,
      endpoint: UNSUBSCRIBE,
    },
    {
      name: '200 with an invalid userId',
      status: 200,
      response: { failCount: 1, invalidUserIds: ['uid-2'] },
      subscribers: [{ userId: 'uid-1' }, { userId: 'uid-2' }],
      endpoint: SUBSCRIBE,
    },
    {
      name: '401 auth failure',
      status: 401,
      response: { msg: 'bad key' },
      subscribers: twoSubscribers,
      endpoint: SUBSCRIBE,
    },
    {
      name: '500 server error',
      status: 500,
      response: { msg: 'boom' },
      subscribers: twoSubscribers,
      endpoint: SUBSCRIBE,
    },
  ];

  it.each(parityCases)(
    'per-job codes and errors match: $name',
    ({ status, response, subscribers, endpoint }) => {
      const ctx = ctxFor(status, response, subscribers, endpoint);
      const next = viaFramework(ctx);
      const prev = viaLegacy(ctx);

      expect(next.threw).toBe(prev.threw);
      if (prev.threw) {
        expect(next.status).toBe(prev.status);
        expect(next.authErrorCategory ?? '').toBe(prev.authErrorCategory ?? '');
        return;
      }
      expect(next.codes).toEqual(prev.codes);
      expect(next.errors).toEqual(prev.errors);
    },
  );
});

describe('iterable_audience delivery — the two deliberate successes', () => {
  it('accepts a GDPR-forgotten user as 200 rather than aborting', () => {
    const ctx = ctxFor(
      200,
      { failCount: 1, failedUpdates: { forgottenEmails: ['b@x.com'] } },
      twoSubscribers,
    );
    const result = toDeliveryV1Response(IterableAudienceIntegration.handleResponse(ctx), ctx, DEST);
    expect(result.response.map((r) => r.statusCode)).toEqual([200, 200]);
  });

  it('treats notFound as success on unsubscribe but not on subscribe', () => {
    const response = { failCount: 1, failedUpdates: { notFoundEmails: ['b@x.com'] } };

    const unsub = ctxFor(200, response, twoSubscribers, UNSUBSCRIBE);
    expect(
      toDeliveryV1Response(
        IterableAudienceIntegration.handleResponse(unsub),
        unsub,
        DEST,
      ).response.map((r) => r.statusCode),
    ).toEqual([200, 200]);

    // On subscribe the same payload is a real failure, which the shared checker reports.
    const sub = ctxFor(200, response, twoSubscribers, SUBSCRIBE);
    const subResult = toDeliveryV1Response(
      IterableAudienceIntegration.handleResponse(sub),
      sub,
      DEST,
    );
    expect(subResult.response[1].statusCode).toBe(400);
  });

  it('case-folds emails on both sides when matching identities', () => {
    const ctx = ctxFor(200, { failCount: 1, failedUpdates: { forgottenEmails: ['B@X.COM'] } }, [
      { email: 'a@x.com' },
      { email: 'b@x.com' },
    ]);
    const result = toDeliveryV1Response(IterableAudienceIntegration.handleResponse(ctx), ctx, DEST);
    expect(result.response.map((r) => r.statusCode)).toEqual([200, 200]);
  });
});

describe('iterable_audience delivery — extractErrorMessage', () => {
  const cases = [
    // Structured `params` has no message of its own, so it is serialised — as the legacy handler
    // did. A plain string is returned as-is rather than JSON-quoted.
    { name: 'params', response: { params: { detail: 'p' } }, expected: '{"detail":"p"}' },
    { name: 'msg', response: { msg: 'a message' }, expected: 'a message' },
    { name: 'message', response: { message: 'another' }, expected: 'another' },
    { name: 'a bare string body', response: 'Invalid API key', expected: 'Invalid API key' },
    // Nothing recognisable: the body beats the old 'unknown error format' placeholder, which told
    // whoever read the job's error nothing at all.
    { name: 'nothing recognisable', response: { other: 1 }, expected: '{"other":1}' },
  ];

  it.each(cases)('reads $name', ({ response, expected }) => {
    expect(IterableAudienceIntegration.extractErrorMessage(response)).toBe(expected);
  });
});
