/**
 * ONE classification of a Reddit response, shared by both delivery paths.
 *
 * `delivery.ts` (the batching framework's `DeliverySpec`) only runs when
 * `REDDIT_AUDIENCE_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS` names the
 * workspace — and that flag has no GA map, so it is OFF by default. Every other
 * framework destination survives that gap by keeping a legacy networkHandler
 * until GA; for an API-key destination the fallback is merely worse errors, but
 * for an OAuth one it is fatal: `genericNetworkHandler` throws a bare
 * NetworkError with no `authErrorCategory`, so a 401 aborts the batch and no
 * token refresh is ever requested. Reddit tokens expire in an hour.
 *
 * Both paths therefore import this module, so the two cannot drift — the same
 * reason `iterable_audience` shares one checker between its halves.
 */

export type RedditVerdict =
  | { kind: 'success' }
  | { kind: 'retry'; message: string; refreshToken?: boolean }
  | { kind: 'throttled'; message: string }
  | { kind: 'abort'; message: string };

type RedditErrorBody = {
  error?: {
    code?: number;
    reason?: string;
    message?: string;
    fields?: { field?: string; message?: string }[];
  };
};

/**
 * Reddit's documented envelope is `{ error: { code, message, fields[] } }`.
 * `fields[]` is the useful part on a 400 — it names the offending property —
 * but it is absent on semantic errors, which carry only `message`. Both shapes
 * are real; handle each without assuming the other.
 *
 * Returned bare (not JSON-quoted): this string is what live events display.
 */
export const extractRedditAudienceErrorMessage = (response: unknown): string => {
  const error = (response as RedditErrorBody | undefined)?.error;
  if (!error) {
    if (typeof response === 'string' && response) return response;
    return response ? JSON.stringify(response) : 'unknown error format';
  }
  const base = error.message ?? 'unknown error format';
  const fields = (error.fields ?? [])
    .map((f) => [f.field, f.message].filter(Boolean).join(': '))
    .filter(Boolean);
  return fields.length > 0 ? `${base} (${fields.join('; ')})` : base;
};

/** Reddit's own auth signal, as read by the event-stream Reddit handler. */
export const isUnauthorizedBody = (response: unknown): boolean => {
  if (typeof response === 'string') return response.includes('Authorization Required');
  const error = (response as RedditErrorBody | undefined)?.error;
  if (!error) return false;
  return error.reason === 'UNAUTHORIZED' || /token|unauthor/i.test(error.message ?? '');
};

const isSuccess = (status: number) => status >= 200 && status < 300;

export const classifyRedditResponse = (status: number, response: unknown): RedditVerdict => {
  if (isSuccess(status)) return { kind: 'success' };

  const message = extractRedditAudienceErrorMessage(response);

  // A 401 is NEVER terminal. The recognition heuristic is narrow, so an
  // unrecognised body must still retry rather than drop up to 2500 members.
  if (status === 401) {
    return { kind: 'retry', message, refreshToken: isUnauthorizedBody(response) };
  }

  if (status === 403) {
    return {
      kind: 'abort',
      message: `${message} — Reddit returned 403. The connected account is missing the 'adsedit' scope, or the request was blocked. Re-authorize the Reddit Audience account.`,
    };
  }

  if (status === 404) {
    return {
      kind: 'abort',
      message: `${message} — custom audience not found. It may have been deleted in Reddit Ads Manager; re-select the audience on this sync.`,
    };
  }

  if (status === 429) return { kind: 'throttled', message };
  if (status >= 500) return { kind: 'retry', message };
  return { kind: 'abort', message };
};
