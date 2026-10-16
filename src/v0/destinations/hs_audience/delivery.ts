/**
 * Delivery for HubSpot list membership.
 *
 * HTTP 200 is not success by itself. Missing adds abort; a missing id on a
 * removal is the absence the caller asked for, so it succeeds with no reason.
 * An id left out of `recordsIdsAdded` is the same success: HubSpot omits
 * contacts that were already on the list. Only transport failures mapped to
 * 400 and portal-migration 477 need custom retry verdicts. Other statuses
 * use the framework default with HubSpot-specific failure reasons.
 */
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
import { normalizeContactId } from './utils';

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

const MEMBERSHIP_RESULT_KEYS = [
  'recordIdsMissing',
  'recordIdsRemoved',
  'recordsIdsAdded',
  'recordIdsAdded',
] as const;

// `recordsIdsAdded` is HubSpot's documented spelling; `recordIdsAdded` is
// accepted as a fallback. All three arrays are normalized so one bad id fails
// the batch closed, but only `recordIdsMissing` changes a verdict. Absence
// from the added array is a successful no-op. A body with none of the result
// keys is accepted when it is an empty object or an empty string: the proxy
// reports an empty HTTP body as `''`, and that body cannot carry
// `recordIdsMissing`. All empty arrays may be omitted on a no-op.
function missingIds(
  response: unknown,
  sent: { operation: 'add' | 'remove'; ids: string[] },
): Set<string> | null {
  const record = asRecord(response === '' ? {} : response);
  if (
    !record ||
    (Object.keys(record).length > 0 &&
      !MEMBERSHIP_RESULT_KEYS.some((key) => record[key] !== undefined))
  ) {
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

// processAxiosResponse turns a Node transport failure with no HTTP status into
// a 400 whose body is `[CODE]` or `[CODE] :: ...`. HubSpot never sent that 400.
const NODE_TRANSPORT_MESSAGE = /^\[\w+]/;

function isNodeTransportMessage(response: unknown): boolean {
  return typeof response === 'string' && NODE_TRANSPORT_MESSAGE.test(response);
}

const MEMBERSHIP_FAILURE_REASONS: Readonly<Partial<Record<number, string>>> = {
  401: TOKEN_REJECTED,
  403: MEMBERSHIP_MISSING_SCOPE,
  404: LIST_NOT_FOUND,
  429: RATE_LIMIT_EXCEEDED,
  477: MEMBERSHIP_UNAVAILABLE,
};

function nonemptyText(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function errorDetails(record: Record<string, unknown>, keys: readonly string[]): string[] {
  return keys.flatMap((key) => {
    const value = nonemptyText(record[key]);
    return value ? [`${key}: ${value}`] : [];
  });
}

function formatError(message: string | undefined, details: string[]): string | undefined {
  if (!message) {
    return details.length > 0 ? details.join(', ') : undefined;
  }
  return details.length > 0 ? `${message} (${details.join(', ')})` : message;
}

function nestedErrorDetails(record: Record<string, unknown>): string[] {
  const details = errorDetails(record, ['category', 'subCategory', 'correlationId', 'code']);
  const context = asRecord(record.context);
  if (context) {
    // HubSpot error context maps field names to arrays of strings, such as
    // { ids: ['101'] }. Ignore malformed values rather than serializing them.
    const entries = Object.entries(context).filter(
      ([, values]) =>
        Array.isArray(values) &&
        values.length > 0 &&
        values.every((value) => typeof value === 'string'),
    );
    if (entries.length > 0) {
      details.push(`context: ${JSON.stringify(Object.fromEntries(entries))}`);
    }
  }
  return details;
}

function failureReason(ctx: DeliveryContext): string {
  const fallbackReason =
    MEMBERSHIP_FAILURE_REASONS[ctx.status] ??
    (ctx.status >= 400 && ctx.status < 500
      ? MEMBERSHIP_REJECTED
      : defaultFailureReason(ctx.status));
  const record = asRecord(ctx.response);
  if (!record) {
    return fallbackReason;
  }
  const reason = formatError(
    nonemptyText(record.message) ?? fallbackReason,
    errorDetails(record, ['category', 'subCategory', 'correlationId']),
  );
  const nested = Array.isArray(record.errors)
    ? record.errors.flatMap((entry, index) => {
        const error = asRecord(entry);
        if (!error) {
          return [];
        }
        const detail = formatError(nonemptyText(error.message), nestedErrorDetails(error));
        return detail ? [`error[${index}]: ${detail}`] : [];
      })
    : [];
  const detailedReason = [reason, ...nested].join(' | ');
  // The ineligible-list cause is named up front; HubSpot's own text stays attached.
  return ctx.status === 400 && isIneligibleList(ctx.response)
    ? `${LIST_INELIGIBLE}: ${detailedReason}`
    : detailedReason;
}

const statusOverrides: StatusOverrideMap = {
  // The framework succeeds on 200. HubSpot can report missing contacts inside
  // that response, so failed additions and malformed results need per-job verdicts.
  200: (ctx, fallback) => {
    const verdicts = membershipOutcomes(ctx);
    return verdicts.every((verdict) => verdict.kind === 'success') ? fallback() : perItem(verdicts);
  },
  // The framework aborts on 400. Node transport failures mapped to 400 must retry.
  400: (ctx, fallback) =>
    isNodeTransportMessage(ctx.response)
      ? perItem(ctx.jobs.map(() => retry(MEMBERSHIP_UNAVAILABLE)))
      : fallback(),
  // The framework aborts on 477. HubSpot portal migration must retry, with
  // per-job 500s so the HTTP 477 does not terminate jobs. Retry-After is not forwarded.
  477: (ctx) => {
    const reason = failureReason(ctx);
    return perItem(ctx.jobs.map(() => retry(reason)));
  },
};

export const hubSpotAudienceDelivery: DeliverySpec = {
  statusOverrides,
  failureReason,
};
