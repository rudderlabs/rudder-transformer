/** Delivery for HubSpot list membership. Other statuses use the framework default. */
import {
  abort,
  defaultFailureReason,
  perItem,
  retry,
  success,
  type DeliveryContext,
  type DeliverySpec,
  type ItemVerdict,
  type StatusOverrideMap,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import {
  CONTACT_NOT_FOUND,
  LIST_NOT_FOUND,
  MEMBERSHIP_MISSING_SCOPE,
  MEMBERSHIP_REJECTED,
  MEMBERSHIP_UNAVAILABLE,
  MEMBERSHIP_UNCORRELATED,
  RATE_LIMIT_EXCEEDED,
  TOKEN_REJECTED,
} from './config';
import { formatHubSpotError } from './utils';

const MEMBERSHIP_FAILURE_REASONS: Readonly<Partial<Record<number, string>>> = {
  401: TOKEN_REJECTED,
  403: MEMBERSHIP_MISSING_SCOPE,
  404: LIST_NOT_FOUND,
  429: RATE_LIMIT_EXCEEDED,
  477: MEMBERSHIP_UNAVAILABLE,
};

function failureReason(ctx: DeliveryContext): string {
  const fallbackReason =
    MEMBERSHIP_FAILURE_REASONS[ctx.status] ??
    (ctx.status >= 400 && ctx.status < 500
      ? MEMBERSHIP_REJECTED
      : defaultFailureReason(ctx.status));
  return formatHubSpotError(ctx.response, fallbackReason);
}

const statusOverrides: StatusOverrideMap = {
  // The framework succeeds on 200. HubSpot reports failed additions in recordIdsMissing.
  // Missing removals succeed because the requested absence is already satisfied.
  200: (ctx, fallback) => {
    const { recordIdsToAdd = [], recordIdsToRemove = [] } = (ctx.request.body?.JSON ?? {}) as {
      recordIdsToAdd?: string[];
      recordIdsToRemove?: string[];
    };
    const ids = recordIdsToAdd.length > 0 ? recordIdsToAdd : recordIdsToRemove;
    // wrapMembershipBody preserves job order. A count mismatch prevents safe attribution.
    if (ids.length !== ctx.jobs.length) {
      return perItem(ctx.jobs.map(() => retry(MEMBERSHIP_UNCORRELATED)));
    }
    const response = ctx.response as { recordIdsMissing?: unknown } | undefined;
    const missing = new Set(
      Array.isArray(response?.recordIdsMissing) ? response.recordIdsMissing.map(String) : [],
    );
    const verdicts: ItemVerdict[] = ctx.jobs.map((_, index) =>
      missing.has(recordIdsToAdd[index]) ? abort(CONTACT_NOT_FOUND) : success(),
    );
    return verdicts.every((verdict) => verdict.kind === 'success') ? fallback() : perItem(verdicts);
  },
  // The framework aborts on 477. HubSpot portal migration must retry each job as 500.
  477: (ctx) => {
    const reason = failureReason(ctx);
    return perItem(ctx.jobs.map(() => retry(reason)));
  },
};

export const hubSpotAudienceDelivery: DeliverySpec = {
  statusOverrides,
  failureReason,
};
