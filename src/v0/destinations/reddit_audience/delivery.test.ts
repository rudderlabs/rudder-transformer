import {
  handleDeliveryResponse,
  type DeliveryContext,
  type HandleResponseResult,
} from '../../../services/destination/nativeBatching/delivery';
import { Integration } from './routerTransform';
import { extractRedditAudienceErrorMessage } from './delivery';

const ctxFor = (status: number, response: unknown): DeliveryContext =>
  ({
    status,
    response,
    jobs: [{ jobId: 1 }, { jobId: 2 }],
    request: {
      endpoint: 'https://ads-api.reddit.com/api/v3/custom_audiences/ca.1/users',
      body: {
        JSON: {
          data: {
            action_type: 'ADD',
            column_order: ['EMAIL_SHA256'],
            user_data: [['a'.repeat(64)], ['b'.repeat(64)]],
          },
        },
      },
    },
    destinationConfig: {},
  }) as unknown as DeliveryContext;

const verdict = (status: number, response: unknown = {}) =>
  handleDeliveryResponse(Integration, ctxFor(status, response));

/** Narrow the verdict union before reading `reason` (only failures carry one). */
const abortReason = (v: HandleResponseResult): string => {
  if (v.kind !== 'abort') {
    throw new Error(`expected an abort verdict, got "${v.kind}"`);
  }
  return v.reason;
};

describe('reddit_audience delivery', () => {
  it('treats 204 No Content as success', () => {
    // Reddit's documented success for PATCH .../users is 204 with an empty body.
    expect(verdict(204, '').kind).toBe('success');
  });

  it('retries a 429 as throttled', () => {
    expect(verdict(429, { error: { code: 429, message: 'Too many requests.' } })).toMatchObject({
      kind: 'retry',
      as: 'throttled',
    });
  });

  it('aborts a 400 with the field detail Reddit returns', () => {
    const v = verdict(400, {
      error: {
        code: 400,
        message: 'Bad request.',
        fields: [{ field: 'user_data', message: 'Invalid value.' }],
      },
    });
    expect(abortReason(v)).toContain('user_data: Invalid value.');
  });

  it('retries 5xx', () => {
    expect(verdict(500, {}).kind).toBe('retry');
  });

  describe('401', () => {
    it('refreshes the token when Reddit says UNAUTHORIZED', () => {
      // Reddit access tokens expire in an hour, so this is the routine case.
      const v = verdict(401, {
        error: { code: 401, reason: 'UNAUTHORIZED', message: 'bad token' },
      });
      expect(v).toMatchObject({ kind: 'retry', as: 'authExpired' });
    });

    it('refreshes on the legacy string body the event-stream handler matches', () => {
      expect(verdict(401, 'Authorization Required')).toMatchObject({
        kind: 'retry',
        as: 'authExpired',
      });
    });

    it('does NOT burn a token refresh on an unrecognised 401 body', () => {
      // batching-framework-delivery: never infer auth from the status alone.
      const v = verdict(401, { error: { code: 401, message: 'account suspended' } });
      expect(v.kind).toBe('abort');
    });
  });

  it('aborts a 403 and names the adsedit scope', () => {
    // 403 is either a missing scope or a blocked User-Agent. Neither is fixed by
    // retrying, and neither is fixed by refreshing the token.
    const v = verdict(403, {
      error: { code: 403, message: 'Insufficient authentication scopes.' },
    });
    expect(abortReason(v)).toMatch(/adsedit/);
  });

  it('aborts a 404 and points at the deleted audience', () => {
    const v = verdict(404, { error: { code: 404, message: 'Not found.' } });
    expect(abortReason(v)).toMatch(/audience not found/i);
  });
});

describe('extractRedditAudienceErrorMessage', () => {
  it('returns the bare message, not a JSON-quoted one', () => {
    expect(extractRedditAudienceErrorMessage({ error: { message: 'Bad request.' } })).toBe(
      'Bad request.',
    );
  });

  it('appends every field error', () => {
    expect(
      extractRedditAudienceErrorMessage({
        error: {
          message: 'Bad request.',
          fields: [
            { field: 'a', message: 'x' },
            { field: 'b', message: 'y' },
          ],
        },
      }),
    ).toBe('Bad request. (a: x; b: y)');
  });

  it('falls back to the raw body when the envelope is missing', () => {
    expect(extractRedditAudienceErrorMessage({ weird: 1 })).toBe('{"weird":1}');
    expect(extractRedditAudienceErrorMessage(undefined)).toBe('unknown error format');
  });
});
