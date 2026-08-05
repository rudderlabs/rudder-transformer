/**
 * Delivery handling for Iterable audience list subscribe/unsubscribe.
 *
 * Iterable's bulk list APIs answer a partially-failed request with HTTP 200 and a `failedUpdates`
 * object naming the *identities* that failed — no indices anywhere. So correlation is content-keyed:
 * each subscriber in the request body is tested against those identity sets.
 *
 * Two branches deliberately report success where a naive reading would abort:
 *
 *  - a GDPR-forgotten user can never be delivered, so retrying or aborting is pointless noise;
 *    it is counted and accepted.
 *  - `notFound` on an unsubscribe means the user was already off the list, which is the outcome
 *    the request asked for.
 *
 * Keyed on '2xx' rather than 200 because the check this replaces is `isHttpStatusSuccess(status)`
 * (BaseStrategy.handleResponse). The non-2xx path needs no entry: the framework's own
 * classification already aborts a 401 and retries a 500, with no auth inference — which is what
 * the legacy handler's empty `authErrorCategory` was expressing, Iterable list APIs being
 * Api-Key authenticated rather than OAuth.
 *
 * NOTE: `src/v1/destinations/iterable_audience/` keeps its strategy while the delivery path is
 * still resolved through networkHandlerFactory. Both are deleted together when the framework owns
 * delivery for this destination.
 */
import {
  abort,
  perItem,
  success,
  type ItemVerdict,
  type StatusOverrideMap,
} from '../../../services/destination/nativeBatching/batchDestination';
import { createBatchErrorChecker } from '../../../v1/destinations/iterable/utils';
import type { IterableSubscriber } from '../../../v1/destinations/iterable_audience/types';
import { UNSUBSCRIBE_CATEGORY } from './config';

const stats = require('../../../util/stats');

type IdentifierLookups = { emails: Set<string>; userIds: Set<string> };

/** Emails are case-folded on both sides, mirroring Iterable's server-side lowercasing. */
const lookupsFrom = (
  emails: string[] | undefined,
  userIds: string[] | undefined,
): IdentifierLookups => ({
  emails: new Set((emails ?? []).map((v) => v.toLowerCase())),
  userIds: new Set(userIds ?? []),
});

/** A subscriber may carry both identifiers (hybrid projects) — a match on either one counts. */
const matchesIdentifier = (subscriber: IterableSubscriber, lookups: IdentifierLookups): boolean =>
  (subscriber.email ? lookups.emails.has(subscriber.email.toLowerCase()) : false) ||
  (subscriber.userId ? lookups.userIds.has(subscriber.userId) : false);

/**
 * Iterable's error envelope is `{ msg, code, params }`.
 *
 * `params` wins over `msg` even when both are present — the structured detail names the offending
 * identifiers, where `msg` is a generic summary. That precedence is the legacy handler's `??`
 * chain (`v1/destinations/iterable_audience/strategies/audience-list.ts`), kept deliberately.
 *
 * One difference from that handler: a string is returned bare rather than JSON-quoted.
 */
export const extractIterableAudienceErrorMessage = (response: unknown): string => {
  const body = response as { params?: unknown; msg?: unknown; message?: unknown } | undefined;
  // The trailing `?? response` is the framework default the legacy handler lacked: a body with
  // none of these fields is shown whole rather than replaced by a placeholder that says nothing.
  const message = body?.params ?? body?.msg ?? body?.message ?? response;
  if (typeof message === 'string') return message || 'unknown error format';
  return JSON.stringify(message) ?? 'unknown error format';
};

export const iterableAudienceStatusOverrides: StatusOverrideMap = {
  '2xx': (ctx) => {
    const requestBody = ctx.request.body?.JSON as
      | { subscribers?: IterableSubscriber[] }
      | undefined;
    const subscribers = requestBody?.subscribers ?? [];

    const failedUpdates = (
      ctx.response as {
        failedUpdates?: {
          forgottenEmails?: string[];
          forgottenUserIds?: string[];
          notFoundEmails?: string[];
          notFoundUserIds?: string[];
        };
      }
    )?.failedUpdates;

    const forgotten = lookupsFrom(failedUpdates?.forgottenEmails, failedUpdates?.forgottenUserIds);
    const notFound = lookupsFrom(failedUpdates?.notFoundEmails, failedUpdates?.notFoundUserIds);
    const isUnsubscribe = (ctx.request.endpoint ?? '').includes(UNSUBSCRIBE_CATEGORY.endpoint);
    const checkEventError = createBatchErrorChecker({
      status: ctx.status,
      response: ctx.response,
    } as never);

    const verdicts: ItemVerdict[] = subscribers.map((subscriber) => {
      // 1. GDPR-forgotten user → success + metric. Can never be retried successfully.
      if (matchesIdentifier(subscriber, forgotten)) {
        stats.counter('iterable_forgotten_user_violations', 1, {
          destType: 'ITERABLE_AUDIENCE',
          destinationId: ctx.jobs[0]?.destinationId ?? '',
          workspaceId: ctx.jobs[0]?.workspaceId ?? '',
          identifierType: subscriber.email ? 'email' : 'userId',
          // NEVER tag the identifier VALUE — it is GDPR-protected.
        });
        return success();
      }

      // 2. notFound on unsubscribe → no-op success; the user was already off the list.
      if (isUnsubscribe && matchesIdentifier(subscriber, notFound)) return success();

      // 3. Everything else goes to the shared abortability check.
      const { isAbortable, errorMsg } = checkEventError({
        email: subscriber.email ? subscriber.email.toLowerCase() : undefined,
        userId: subscriber.userId,
      });
      return isAbortable ? abort(errorMsg) : success();
    });

    return perItem(verdicts);
  },
};
