/**
 * Delivery for HubSpot list membership.
 *
 * Authorization is applied here, on a clone, because the router output is
 * persisted and shown in live events. Direct delivery would send that output
 * with no token, so proxy delivery is required.
 *
 * A 2xx is not success by itself. Missing adds abort; a missing id on a
 * removal is the absence the caller asked for, so it succeeds with no reason.
 * An id left out of `recordsIdsAdded` is the same success: HubSpot omits
 * contacts that were already on the list. `perItem` on 4xx and 5xx keeps the
 * framework from attaching the raw response, which can echo ids and tokens.
 */
import { InstrumentationError } from '@rudderstack/integrations-lib';
import {
  abort,
  perItem,
  retry,
  success,
  throttled,
  type DeliveryContext,
  type DeliveryRequestContext,
  type DeliverySpec,
  type ItemVerdict,
  type StatusOverrideMap,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import type { ProxyRequest } from '../../../types';
import {
  ACCESS_TOKEN_REQUIRED,
  CONTACT_NOT_FOUND,
  INELIGIBLE_LIST_SUBCATEGORY,
  LIST_INELIGIBLE,
  LIST_NOT_FOUND,
  MEMBERSHIP_MISSING_SCOPE,
  MEMBERSHIP_REJECTED,
  MEMBERSHIP_UNAVAILABLE,
  MEMBERSHIP_UNCORRELATED,
  RATE_LIMIT_EXCEEDED,
  TOKEN_REJECTED,
  VALIDATION_ERROR,
} from './config';
import { normalizeContactId, readAccessToken } from './utils';

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function normalizeIdArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) {
    return null;
  }
  const ids: string[] = [];
  for (const entry of value) {
    const normalized = normalizeContactId(entry);
    if (!normalized.ok) {
      return null;
    }
    ids.push(normalized.id);
  }
  return ids;
}

// Live HubSpot add-and-remove responses omit empty arrays (e.g. only
// `recordsIdsAdded` is present). Treat absent/null like []. A present
// non-array still fails closed.
function normalizeResponseIdArray(value: unknown): string[] | null {
  if (value === undefined || value === null) {
    return [];
  }
  return normalizeIdArray(value);
}

function sentMembership(body: unknown): { operation: 'add' | 'remove'; ids: string[] } | null {
  const record = asRecord(body);
  if (!record) {
    return null;
  }
  const toAdd = normalizeIdArray(record.recordIdsToAdd);
  const toRemove = normalizeIdArray(record.recordIdsToRemove);
  if (!toAdd || !toRemove) {
    return null;
  }
  const adding = toAdd.length > 0;
  const removing = toRemove.length > 0;
  // Exactly one array carries the jobs. Both empty, or both filled, cannot
  // be lined up with a single operation.
  if (adding === removing) {
    return null;
  }
  if (adding) {
    return { operation: 'add', ids: toAdd };
  }
  return { operation: 'remove', ids: toRemove };
}

// `recordsIdsAdded` is HubSpot's documented spelling; `recordIdsAdded` is
// accepted as a fallback. All three arrays are normalized so one bad id fails
// the batch closed, but only `recordIdsMissing` changes a verdict. Absence
// from the added array is a successful no-op.
function missingIds(
  response: unknown,
  sent: { operation: 'add' | 'remove'; ids: string[] },
): Set<string> | null {
  const record = asRecord(response);
  if (!record) {
    return null;
  }
  const missing = normalizeResponseIdArray(record.recordIdsMissing);
  const removed = normalizeResponseIdArray(record.recordIdsRemoved);
  const added = normalizeResponseIdArray(
    record.recordsIdsAdded !== undefined ? record.recordsIdsAdded : record.recordIdsAdded,
  );
  if (!missing || !removed || !added) {
    return null;
  }
  if (
    (sent.operation === 'add' && removed.length > 0) ||
    (sent.operation === 'remove' && added.length > 0)
  ) {
    return null;
  }

  const sentIds = new Set(sent.ids);
  const claimedIds = new Set<string>();
  for (const ids of [missing, removed, added]) {
    // Repeated entries within one array are valid. Across arrays, an ID
    // cannot be both missing and changed, or both added and removed.
    const uniqueIds = new Set(ids);
    for (const id of uniqueIds) {
      if (!sentIds.has(id) || claimedIds.has(id)) {
        return null;
      }
      claimedIds.add(id);
    }
  }
  return new Set(missing);
}

function retryEveryJob(ctx: DeliveryContext): ItemVerdict[] {
  return ctx.jobs.map(() => retry(MEMBERSHIP_UNCORRELATED));
}

function membershipOutcomes(ctx: DeliveryContext): ItemVerdict[] {
  const sent = sentMembership(ctx.request.body?.JSON);
  if (!sent || sent.ids.length !== ctx.jobs.length) {
    return retryEveryJob(ctx);
  }
  const missing = missingIds(ctx.response, sent);
  if (!missing) {
    return retryEveryJob(ctx);
  }
  return sent.ids.map((id) => {
    if (!missing.has(id) || sent.operation === 'remove') {
      return success();
    }
    return abort(CONTACT_NOT_FOUND);
  });
}

function isIneligibleList(response: unknown): boolean {
  const record = asRecord(response);
  if (!record || record.category !== VALIDATION_ERROR) {
    return false;
  }
  if (record.subCategory === INELIGIBLE_LIST_SUBCATEGORY) {
    return true;
  }
  if (!Array.isArray(record.errors)) {
    return false;
  }
  return record.errors.some((entry) => {
    const error = asRecord(entry);
    return error?.subCategory === INELIGIBLE_LIST_SUBCATEGORY;
  });
}

function clientFailure(ctx: DeliveryContext): ItemVerdict {
  if (ctx.status === 401) {
    return abort(TOKEN_REJECTED);
  }
  if (ctx.status === 403) {
    return abort(MEMBERSHIP_MISSING_SCOPE);
  }
  if (ctx.status === 404) {
    return abort(LIST_NOT_FOUND);
  }
  if (ctx.status === 429) {
    return throttled(RATE_LIMIT_EXCEEDED);
  }
  if (ctx.status === 400 && isIneligibleList(ctx.response)) {
    return abort(LIST_INELIGIBLE);
  }
  return abort(MEMBERSHIP_REJECTED);
}

const statusOverrides: StatusOverrideMap = {
  '2xx': (ctx) => perItem(membershipOutcomes(ctx)),
  '4xx': (ctx) => perItem(ctx.jobs.map(() => clientFailure(ctx))),
  '5xx': (ctx) => perItem(ctx.jobs.map(() => retry(MEMBERSHIP_UNAVAILABLE))),
};

function prepareMembershipRequest(
  request: ProxyRequest,
  ctx: DeliveryRequestContext,
): ProxyRequest {
  const token = readAccessToken(ctx.destinationConfig);
  if (!token) {
    throw new InstrumentationError(ACCESS_TOKEN_REQUIRED);
  }
  return {
    ...request,
    headers: {
      ...request.headers,
      Authorization: `Bearer ${token}`,
    },
  };
}

export const hubSpotAudienceDelivery: DeliverySpec = {
  statusOverrides,
  prepareRequest: prepareMembershipRequest,
};
