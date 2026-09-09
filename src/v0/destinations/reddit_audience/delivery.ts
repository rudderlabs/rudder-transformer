/**
 * Framework delivery spec for Reddit Custom Audience user updates.
 *
 * Reddit answers `PATCH /custom_audiences/{id}/users` with **204 No Content**.
 * There is no per-record envelope — nothing like Braze's indexed `errors[]` or
 * Iterable's identity-keyed `failedUpdates` — so there is no `perItem` verdict
 * to build and no positional correlation to get wrong. Every failure is a plain
 * HTTP status applying to the whole request.
 *
 * All classification lives in `./classify`, shared with
 * `src/v1/destinations/reddit_audience/networkHandler.ts`. That handler is what
 * actually runs until framework delivery is flagged on for a workspace, so the
 * two must agree by construction rather than by review.
 */
import {
  abort,
  authExpired,
  retry,
  throttled,
  success,
  type DeliverySpec,
  type StatusOverrideMap,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import { classifyRedditResponse, extractRedditAudienceErrorMessage } from './classify';

export { extractRedditAudienceErrorMessage } from './classify';

const redditAudienceStatusOverrides: StatusOverrideMap = {
  '4xx': (ctx, fallback) => {
    const v = classifyRedditResponse(ctx.status, ctx.response);
    switch (v.kind) {
      case 'success':
        return success();
      case 'throttled':
        return throttled(v.message);
      case 'retry':
        // A 401 is NEVER terminal: the framework's status-based default treats
        // it as neither success, nor 429, nor retryable (that is 5xx only), so
        // falling through would abort and permanently drop up to 2500 members
        // without ever asking for a refresh. `refreshToken` is derived from the
        // response BODY, never inferred from the status alone.
        return v.refreshToken ? authExpired(v.message) : retry(v.message);
      case 'abort':
        return abort(v.message);
      default:
        return fallback();
    }
  },
};

export const redditAudienceDelivery: DeliverySpec = {
  statusOverrides: redditAudienceStatusOverrides,
  failureReason: (ctx) => extractRedditAudienceErrorMessage(ctx.response),
};
