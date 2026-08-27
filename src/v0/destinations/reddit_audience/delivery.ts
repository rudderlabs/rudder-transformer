/**
 * Delivery handling for Reddit Custom Audience user updates.
 *
 * Reddit answers `PATCH /custom_audiences/{id}/users` with **204 No Content**.
 * There is no per-record envelope — nothing like Braze's indexed `errors[]` or
 * Iterable's identity-keyed `failedUpdates` — so there is no `perItem` verdict
 * to build here and no positional correlation to get wrong. Every failure is a
 * plain HTTP status that applies to the whole request.
 *
 * That makes the framework default almost right on its own (2xx success, 429
 * throttled, retryable retry, else abort). Two things it cannot know:
 *
 *  - **401 on an OAuth destination.** Reddit access tokens expire after an hour,
 *    so a 401 here is a routine, recoverable staleness rather than a bad
 *    credential, and must drive a refresh instead of aborting the batch. Per
 *    the batching-framework-delivery guidance we do NOT infer this from the
 *    status alone: the auth signal is read out of the body, matching what the
 *    event-stream Reddit handler already does for the same API
 *    (`src/v1/destinations/reddit/networkHandler.js` — `error.reason ===
 *    'UNAUTHORIZED'`). A 401 whose body we don't recognise falls through to the
 *    framework's own classification rather than burning a token refresh.
 *
 *  - **403 is never retryable, and is ambiguous.** Reddit returns it both for
 *    insufficient OAuth scopes (the `adsedit` case) and for a blocked/generic
 *    User-Agent. Neither is fixed by retrying, and neither is fixed by
 *    refreshing a token — the grant itself lacks the scope. Abort with a reason
 *    that names both possibilities, because the distinction is not in the body.
 */
import {
  abort,
  authExpired,
  type DeliverySpec,
  type StatusOverrideMap,
} from '../../../services/destination/nativeBatching/batchDestination';

type RedditErrorBody = {
  error?: {
    code?: number;
    message?: string;
    fields?: { field?: string; message?: string }[];
  };
};

/**
 * Reddit's documented error envelope is `{ error: { code, message, fields[] } }`.
 * `fields[]` is the useful part on a 400 — it names the offending property —
 * so it is appended rather than dropped in favour of the generic `message`.
 *
 * Returned bare (not JSON-quoted): this string is what live events display.
 */
export const extractRedditAudienceErrorMessage = (response: unknown): string => {
  const body = response as RedditErrorBody | undefined;
  const error = body?.error;
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
const isUnauthorizedBody = (response: unknown): boolean => {
  if (typeof response === 'string') return response.includes('Authorization Required');
  const error = (response as { error?: { reason?: string; message?: string } } | undefined)?.error;
  if (!error) return false;
  return error.reason === 'UNAUTHORIZED' || /token|unauthor/i.test(error.message ?? '');
};

const redditAudienceStatusOverrides: StatusOverrideMap = {
  401: (ctx, fallback) =>
    isUnauthorizedBody(ctx.response)
      ? authExpired(extractRedditAudienceErrorMessage(ctx.response))
      : fallback(),

  403: (ctx) =>
    abort(
      `${extractRedditAudienceErrorMessage(ctx.response)} — Reddit returned 403. The connected account is missing the 'adsedit' scope, or the request was blocked. Re-authorize the Reddit Audience account.`,
    ),

  404: (ctx) =>
    abort(
      `${extractRedditAudienceErrorMessage(ctx.response)} — custom audience not found. It may have been deleted in Reddit Ads Manager; re-select the audience on this sync.`,
    ),
};

export const redditAudienceDelivery: DeliverySpec = {
  statusOverrides: redditAudienceStatusOverrides,
  failureReason: (ctx) => extractRedditAudienceErrorMessage(ctx.response),
};
