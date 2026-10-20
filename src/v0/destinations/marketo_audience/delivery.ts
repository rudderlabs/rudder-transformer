/**
 * Delivery for Marketo static-list membership (add: POST, remove: DELETE).
 *
 * Marketo answers application errors with HTTP 200, so the 2xx override does most of the work:
 * `success: true` carries one result per sent lead, matched by lead ID; `success: false` carries a
 * code that applies to the whole request. Every verdict goes through `perItem`, so the framework
 * does not attach the raw response, and reasons carry Marketo codes or HTTP statuses only: no lead
 * IDs, emails or Marketo message text.
 */
import {
  abort,
  perItem,
  retry,
  success,
  throttled,
  type DeliveryContext,
  type DeliverySpec,
  type HandleResponseResult,
  type ItemVerdict,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import {
  ACCESS_DENIED,
  LEAD_NOT_FOUND,
  LIST_NOT_FOUND,
  MEMBERSHIP_FAILED,
  PARTITION_DENIED,
  RESPONSE_UNMATCHED,
} from './config';
import {
  asRecord,
  authCache,
  classifyMarketoCode,
  firstErrorCode,
  isNodeTransportMessage,
  type MarketoOutcome,
} from './utils';

// https://experienceleague.adobe.com/en/docs/marketo-developer/marketo/rest/error-codes
const LEAD_NOT_FOUND_CODE = '1004';
const PARTITION_DENIED_CODE = '1008';
const NOT_IN_LIST_CODE = '1015';

const everyJob = (ctx: DeliveryContext, verdict: ItemVerdict): HandleResponseResult =>
  perItem(ctx.jobs.map(() => verdict));

function outcomeVerdict(outcome: MarketoOutcome): ItemVerdict {
  if (outcome.kind === 'throttled') {
    return throttled(outcome.reason);
  }
  if (outcome.kind === 'retry') {
    return retry(outcome.reason);
  }
  return abort(outcome.reason);
}

// A lead absent from Marketo, or absent from the list, is what a removal asked for.
function skippedVerdict(code: string | undefined, removing: boolean): ItemVerdict {
  if (removing && (code === LEAD_NOT_FOUND_CODE || code === NOT_IN_LIST_CODE)) {
    return success();
  }
  if (code === LEAD_NOT_FOUND_CODE) {
    return abort(LEAD_NOT_FOUND);
  }
  if (code === PARTITION_DENIED_CODE) {
    return abort(PARTITION_DENIED);
  }
  return abort(`Marketo skipped the lead (code ${code ?? 'unknown'})`);
}

function resultVerdict(result: Record<string, unknown>, removing: boolean): ItemVerdict {
  if (result.status === 'added' || result.status === 'removed') {
    return success();
  }
  if (result.status === 'skipped') {
    const reasons = Array.isArray(result.reasons) ? result.reasons : [];
    const code = asRecord(reasons[0])?.code;
    return skippedVerdict(code === undefined ? undefined : String(code), removing);
  }
  return retry(RESPONSE_UNMATCHED);
}

// Results are matched to jobs by lead ID: Marketo returns one result per sent lead but does not
// promise their order. internalGroupKey keeps each lead ID once per request, so an ID names a job.
function resultVerdicts(ctx: DeliveryContext, body: Record<string, unknown>): ItemVerdict[] {
  const sent = asRecord(ctx.request.body?.JSON)?.input;
  const { result } = body;
  const unmatched = () => ctx.jobs.map(() => retry(RESPONSE_UNMATCHED));
  if (
    !Array.isArray(sent) ||
    !Array.isArray(result) ||
    sent.length !== ctx.jobs.length ||
    result.length !== sent.length
  ) {
    return unmatched();
  }
  const entries = result
    .map(asRecord)
    .filter((entry): entry is Record<string, unknown> => entry !== null);
  const byId = new Map(entries.map((entry) => [String(entry.id), entry]));
  if (entries.length !== result.length || byId.size !== result.length) {
    return unmatched();
  }
  const matched = sent.map((item) => byId.get(String(asRecord(item)?.id)));
  if (!matched.every((entry): entry is Record<string, unknown> => entry !== undefined)) {
    return unmatched();
  }
  const removing = ctx.request.method.toUpperCase() === 'DELETE';
  return matched.map((entry) => resultVerdict(entry, removing));
}

function membershipResponse(ctx: DeliveryContext): HandleResponseResult {
  const body = asRecord(ctx.response);
  if (body?.success === true) {
    return perItem(resultVerdicts(ctx, body));
  }
  const code = body ? firstErrorCode(body) : undefined;
  if (!code) {
    return everyJob(ctx, retry(RESPONSE_UNMATCHED));
  }
  const outcome = classifyMarketoCode(
    code,
    { '603': ACCESS_DENIED, '1013': LIST_NOT_FOUND },
    MEMBERSHIP_FAILED,
  );
  // The retried jobs are transformed again and fetch a new token.
  if (outcome.evictToken) {
    authCache.del(ctx.destinationId);
  }
  return everyJob(ctx, outcomeVerdict(outcome));
}

function clientFailure(ctx: DeliveryContext): ItemVerdict {
  if (ctx.status === 429) {
    return throttled('Marketo rate limit reached (HTTP 429)');
  }
  if (ctx.status === 400 && isNodeTransportMessage(ctx.response)) {
    return retry(`${MEMBERSHIP_FAILED} (network error)`);
  }
  return abort(`${MEMBERSHIP_FAILED} (HTTP ${ctx.status})`);
}

export const marketoAudienceDelivery: DeliverySpec = {
  statusOverrides: {
    '2xx': membershipResponse,
    '4xx': (ctx) => everyJob(ctx, clientFailure(ctx)),
    // The framework retries a 5xx too, but its whole-batch error carries the raw body, which can
    // hold an email. A per-job retry with a fixed reason keeps the body out of job errors.
    '5xx': (ctx) => everyJob(ctx, retry(`${MEMBERSHIP_FAILED} (HTTP ${ctx.status})`)),
  },
};
