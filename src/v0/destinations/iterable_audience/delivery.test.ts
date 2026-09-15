import { Integration as IterableAudienceIntegration } from './routerTransform';
import {
  firstJobIdentity,
  handleDeliveryResponse,
  resolveDeliverySpec,
  toDeliveryV1Response,
} from '../../../services/destination/destinationIntegration/delivery';
import type { DeliveryContext } from '../../../services/destination/destinationIntegration/delivery';
import type { ProxyMetdata, ProxyV1Request } from '../../../types';

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
): DeliveryContext => {
  const jobs = subscribers.map((_s, i) => job(i + 1));
  return {
    status,
    response,
    jobs,
    request: {
      body: { JSON: { listId: 42, subscribers } },
      endpoint,
    } as unknown as ProxyV1Request,
    destinationConfig: {},
    ...firstJobIdentity(jobs),
  };
};

const viaFramework = (ctx: DeliveryContext) => {
  try {
    const response = toDeliveryV1Response(
      handleDeliveryResponse(IterableAudienceIntegration, ctx),
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

const twoSubscribers: Subscriber[] = [{ email: 'a@x.com' }, { email: 'b@x.com' }];

describe('iterable_audience delivery — per-job outcomes by response shape', () => {
  const successCases = [
    {
      name: '200 clean',
      response: { successCount: 2, failCount: 0 },
      subscribers: twoSubscribers,
      endpoint: SUBSCRIBE,
      codes: [200, 200],
      errors: ['success', 'success'],
    },
    {
      name: '200 with an invalid email',
      response: { failCount: 1, invalidEmails: ['b@x.com'] },
      subscribers: twoSubscribers,
      endpoint: SUBSCRIBE,
      codes: [200, 400],
      errors: ['success', 'email error:"b@x.com" in "invalidEmails".'],
    },
    {
      name: '200 with a GDPR-forgotten email — accepted, not aborted',
      response: { failCount: 1, failedUpdates: { forgottenEmails: ['b@x.com'] } },
      subscribers: twoSubscribers,
      endpoint: SUBSCRIBE,
      codes: [200, 200],
      errors: ['success', 'success'],
    },
    {
      name: '200 notFound on unsubscribe — no-op success',
      response: { failCount: 1, failedUpdates: { notFoundEmails: ['b@x.com'] } },
      subscribers: twoSubscribers,
      endpoint: UNSUBSCRIBE,
      codes: [200, 200],
      errors: ['success', 'success'],
    },
    {
      name: '200 with an invalid userId',
      response: { failCount: 1, invalidUserIds: ['uid-2'] },
      subscribers: [{ userId: 'uid-1' }, { userId: 'uid-2' }],
      endpoint: SUBSCRIBE,
      codes: [200, 400],
      errors: ['success', 'userId error:"uid-2" in "invalidUserIds".'],
    },
  ];

  it.each(successCases)(
    'reports per-job codes and errors: $name',
    ({ response, subscribers, endpoint, codes, errors }) => {
      const result = viaFramework(ctxFor(200, response, subscribers, endpoint));

      expect(result.threw).toBe(false);
      expect(result.codes).toEqual(codes);
      expect(result.errors).toEqual(errors);
    },
  );

  // Iterable list APIs are Api-Key authenticated, so no status carries an auth refinement — a 401
  // aborts and a 5xx retries, both as whole-batch throws with an empty authErrorCategory.
  it.each([
    { name: '401 auth failure', status: 401, response: { msg: 'bad key' } },
    { name: '500 server error', status: 500, response: { msg: 'boom' } },
  ])('throws for the whole batch: $name', ({ status, response }) => {
    const result = viaFramework(ctxFor(status, response, twoSubscribers, SUBSCRIBE));

    expect(result.threw).toBe(true);
    expect(result.status).toBe(status);
    expect(result.authErrorCategory ?? '').toBe('');
  });
});

describe('iterable_audience delivery — the two deliberate successes', () => {
  it('accepts a GDPR-forgotten user as 200 rather than aborting', () => {
    const ctx = ctxFor(
      200,
      { failCount: 1, failedUpdates: { forgottenEmails: ['b@x.com'] } },
      twoSubscribers,
    );
    const result = toDeliveryV1Response(
      handleDeliveryResponse(IterableAudienceIntegration, ctx),
      ctx,
      DEST,
    );
    expect(result.response.map((r) => r.statusCode)).toEqual([200, 200]);
  });

  it('treats notFound as success on unsubscribe but not on subscribe', () => {
    const response = { failCount: 1, failedUpdates: { notFoundEmails: ['b@x.com'] } };

    const unsub = ctxFor(200, response, twoSubscribers, UNSUBSCRIBE);
    expect(
      toDeliveryV1Response(
        handleDeliveryResponse(IterableAudienceIntegration, unsub),
        unsub,
        DEST,
      ).response.map((r) => r.statusCode),
    ).toEqual([200, 200]);

    // On subscribe the same payload is a real failure, which the shared checker reports.
    const sub = ctxFor(200, response, twoSubscribers, SUBSCRIBE);
    const subResult = toDeliveryV1Response(
      handleDeliveryResponse(IterableAudienceIntegration, sub),
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
    const result = toDeliveryV1Response(
      handleDeliveryResponse(IterableAudienceIntegration, ctx),
      ctx,
      DEST,
    );
    expect(result.response.map((r) => r.statusCode)).toEqual([200, 200]);
  });
});

describe('iterable_audience delivery — failureReason', () => {
  const reasonFor = (response: unknown) =>
    resolveDeliverySpec(IterableAudienceIntegration).failureReason({
      ...ctxFor(500, {}, []),
      response,
    });

  /**
   * The `??` precedence below is stated as a JSON-serialised expression, matching how the message
   * is built for a structured body; the framework returns a plain string bare. Undoing just the
   * quoting keeps the assertion about which field was *selected*, not how it was formatted.
   * Parsing rather than stripping quotes textually keeps escapes intact.
   */
  const unquote = (json: string): string => {
    const parsed: unknown = JSON.parse(json);
    return typeof parsed === 'string' ? parsed : json;
  };

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
    expect(reasonFor(response)).toBe(expected);
  });

  // Iterable's real envelope is `{ msg, code, params }` — both fields present at once. The `??`
  // chain takes `params` whenever it is non-null, including when it is empty. Pinned so the
  // precedence cannot drift silently.
  type IterableErrorBody = { msg?: string; message?: string; params?: unknown };

  it.each<{ name: string; response: IterableErrorBody }>([
    { name: 'populated params beats msg', response: { msg: 'generic', params: { bad: 'x' } } },
    { name: 'even empty params beats msg', response: { msg: 'generic', params: {} } },
    { name: 'null params yields to msg', response: { msg: 'generic', params: null } },
  ])('$name', ({ response }) => {
    const selected = JSON.stringify(response.params ?? response.msg ?? response.message);
    expect(reasonFor(response)).toBe(unquote(selected));
  });
});
