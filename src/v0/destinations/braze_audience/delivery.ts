/**
 * Delivery handling for the Braze audience bulk attribute sync.
 *
 * Braze answers `/users/track/bulk` with a **2xx** even when individual records were rejected,
 * listing them in `errors[]`. Each entry carries `index` — a position in the posted `attributes`
 * array — so correlation is positional, and without this entry the framework would read a
 * partially-failed batch as a plain success. Keyed on '2xx' rather than 201 because the check it
 * replaces is `isHttpStatusSuccess(status)` (`v1/destinations/braze_audience/networkHandler.ts`).
 *
 * Three branches carry over from the legacy handler:
 *
 *  - an indexed error naming a permanent identity problem aborts that record — no retry can fix an
 *    id Braze has blacklisted or that exceeds its length cap;
 *  - any other indexed error is retryable, since Braze does not distinguish transient attribute
 *    failures from permanent ones;
 *  - an error with **no** index cannot be attributed to a record, so every record the indexed
 *    errors did not name is marked retryable rather than reported as delivered. Braze flagged the
 *    batch as partially failed and we cannot say which part, so the safe reading is to redeliver.
 *
 * The non-2xx path needs no override: `defaultVerdict` already aborts a 400 and retries a 500 with
 * no auth inference, which is what the legacy handler's empty `authErrorCategory` was expressing —
 * Braze is REST-API-key authenticated, not OAuth.
 *
 * NOTE: `src/v1/destinations/braze_audience/networkHandler.ts` keeps this logic while delivery is
 * still resolved through networkHandlerFactory; both are deleted together when the framework owns
 * delivery for this destination. The identity classifier itself is shared (`./utils`) rather than
 * copied, so the two cannot drift.
 */
import {
  abort,
  perItem,
  retry,
  success,
  type ItemVerdict,
  type StatusOverrideMap,
  messageFromResponse,
} from '../../../services/destination/nativeBatching/batchDestination';
import { isIdentityAborted } from './utils';

const stats = require('../../../util/stats');

type BrazeAudienceError = { type?: string; index?: number };

export const extractBrazeAudienceErrorMessage = (response: unknown): string =>
  messageFromResponse(response, ['message']);

export const brazeAudienceStatusOverrides: StatusOverrideMap = {
  '2xx': (ctx, fallback) => {
    const rawErrors = (ctx.response as { errors?: unknown } | undefined)?.errors;
    const errors: BrazeAudienceError[] = Array.isArray(rawErrors) ? rawErrors : [];
    if (errors.length === 0) return fallback();

    const destinationId = ctx.jobs[0]?.destinationId ?? '';
    const workspaceId = ctx.jobs[0]?.workspaceId ?? '';
    // Destination-scoped, deliberately not the shared event-stream `braze_partial_failure`.
    stats.increment('braze_audience_partial_failure', { destinationId, workspaceId });

    // Values are the raw `type`, which is both the abortability signal and the reported reason.
    const failedByIndex = new Map<number, string | undefined>();
    let hasUnindexedError = false;
    let unindexedMessage = 'braze_partial_error_unindexed';
    for (const error of errors) {
      if (typeof error?.index === 'number') {
        failedByIndex.set(error.index, error.type);
      } else {
        hasUnindexedError = true;
        if (typeof error?.type === 'string' && error.type.length > 0) {
          unindexedMessage = error.type;
        }
      }
    }

    // `errors[].index` indexes the posted `attributes` array, so that is what the loop is driven
    // from. It falls back to `ctx.jobs` — which the framework builds 1:1 with `attributes` — when
    // the body cannot be read, so that per-record verdicts survive. Without it the bridge sees a
    // length mismatch and retries the whole batch, which would keep redelivering an identity
    // failure that can never succeed instead of aborting it.
    const attributes = (ctx.request.body?.JSON as { attributes?: unknown } | undefined)?.attributes;
    const items: unknown[] =
      Array.isArray(attributes) && attributes.length > 0 ? attributes : ctx.jobs;

    const verdicts: ItemVerdict[] = items.map((_item, index) => {
      if (!failedByIndex.has(index)) {
        if (!hasUnindexedError) return success();
        stats.increment('braze_audience_retryable', {
          destinationId,
          workspaceId,
          reason: 'partial_unindexed',
        });
        return retry(unindexedMessage);
      }

      const type = failedByIndex.get(index);
      const reason = type || 'braze_partial_error';

      if (isIdentityAborted(type)) {
        stats.increment('braze_audience_aborted', { destinationId, workspaceId });
        return abort(reason);
      }

      stats.increment('braze_audience_retryable', {
        destinationId,
        workspaceId,
        reason: 'partial',
      });
      return retry(reason);
    });

    return perItem(verdicts);
  },
};
