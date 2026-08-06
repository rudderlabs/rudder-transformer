/**
 * Delivery contract for the native batching framework.
 *
 * An integration says what should happen to a batch in terms the platform can act on — retry it,
 * drop it, or accept it — and this module turns that into the shape the delivery API requires.
 * Integrations never build a `DeliveryV1Response`, never choose an HTTP status code, and never
 * throw. See docs/superpowers/specs/2026-07-30-network-handler-abstraction-design.md.
 */
import { TransformerProxyError } from '../../../v0/util/errorTypes';
import { isHttpStatusSuccess, isHttpStatusRetryable } from '../../../v0/util';
import tags from '../../../v0/util/tags';
import stats from '../../../util/stats';
import type {
  DeliveryJobState,
  DeliveryV1Response,
  ProxyMetdata,
  ProxyV1Request,
} from '../../../types';

const {
  REFRESH_TOKEN,
  AUTH_STATUS_INACTIVE,
} = require('../../../adapters/networkhandler/authConstants');

// ---------------------------------------------------------------------------
// Verdicts
// ---------------------------------------------------------------------------

type SuccessVerdict = { kind: 'success' };
type AbortVerdict = { kind: 'abort'; reason: string; auth?: 'revoked' };
type RetryVerdict = {
  kind: 'retry';
  reason: string;
  as?: 'throttled' | 'authExpired';
  dontBatch?: boolean;
};

/** What should happen to a job (or to the whole batch). */
export type Verdict = SuccessVerdict | AbortVerdict | RetryVerdict;

/**
 * The subset of verdicts expressible per item. The auth refinements are absent deliberately:
 * rudder-server overwrites the status code of *every* job in a batch whenever an
 * `authErrorCategory` is present, so a per-item auth verdict cannot be represented.
 */
export type ItemVerdict =
  | SuccessVerdict
  | { kind: 'abort'; reason: string }
  | { kind: 'retry'; reason: string; as?: 'throttled'; dontBatch?: boolean };

export const success = (): SuccessVerdict => ({ kind: 'success' });

export const abort = (reason: string): { kind: 'abort'; reason: string } => ({
  kind: 'abort',
  reason,
});

export const retry = (
  reason: string,
  opts?: { dontBatch?: boolean },
): { kind: 'retry'; reason: string; dontBatch?: boolean } => ({
  kind: 'retry',
  reason,
  ...(opts?.dontBatch ? { dontBatch: true } : {}),
});

export const throttled = (reason: string): { kind: 'retry'; reason: string; as: 'throttled' } => ({
  kind: 'retry',
  reason,
  as: 'throttled',
});

/** Token is stale but recoverable → rudder-server refreshes it and retries the batch. */
export const authExpired = (
  reason: string,
): { kind: 'retry'; reason: string; as: 'authExpired' } => ({
  kind: 'retry',
  reason,
  as: 'authExpired',
});

/** Grant is gone → rudder-server aborts the batch. */
export const authRevoked = (
  reason: string,
): { kind: 'abort'; reason: string; auth: 'revoked' } => ({
  kind: 'abort',
  reason,
  auth: 'revoked',
});

export type PerItemVerdicts = { kind: 'perItem'; verdicts: ItemVerdict[] };

/**
 * One verdict per **request body item**, in the order they were sent. Positional and 1:1 — the
 * framework carries no item→job map, so this is only correct when each job contributed exactly
 * one body item. A length mismatch degrades to a whole-batch verdict rather than misattributing.
 */
export const perItem = (verdicts: ItemVerdict[]): PerItemVerdicts => ({
  kind: 'perItem',
  verdicts,
});

export type HandleResponseResult = Verdict | PerItemVerdicts;

// ---------------------------------------------------------------------------
// Context and overrides
// ---------------------------------------------------------------------------

export type DeliveryContext = {
  /** HTTP status from the destination, after processAxiosResponse. */
  status: number;
  /** Parsed destination response body. */
  response: unknown;
  /** One entry per job in this batch, in the order the framework built them. */
  jobs: ProxyMetdata[];
  /** The request that was sent — for correlating response items back to what was posted. */
  request: ProxyV1Request;
  destinationConfig: Record<string, unknown>;
};

/**
 * Behaviour for one status (or status class). Return a verdict, or per-item verdicts, or call
 * `fallback()` for the framework's own classification — useful when a handler owns only some of
 * the responses carrying its status (a particular endpoint, a decodable body).
 */
export type StatusOverride = (
  ctx: DeliveryContext,
  fallback: () => Verdict,
) => HandleResponseResult;

/** An exact status, or a whole class of them. Exact keys win. */
export type StatusKey = number | '2xx' | '4xx' | '5xx';

export type StatusOverrideMap = Readonly<Partial<Record<StatusKey, StatusOverride>>>;

export const statusClassOf = (status: number): StatusKey | undefined => {
  if (isHttpStatusSuccess(status)) return '2xx';
  if (status >= 400 && status < 500) return '4xx';
  if (status >= 500 && status < 600) return '5xx';
  return undefined;
};

/**
 * Merge `statusOverrides` down the prototype chain, child winning over parent.
 *
 * Static properties are inherited but *shadowed*, not merged: a subclass declaring its own
 * `statusOverrides` would otherwise silently drop every entry an ancestor declared, with no type
 * or runtime error. Merging here means a family-level map on e.g. VDMV2ObjectDestination keeps
 * working when a concrete destination adds an entry of its own. Not cached — the walk is three
 * levels of small objects, which is nothing next to the HTTP call it accompanies, and a cache
 * would go stale whenever a test swaps a map.
 */
export function resolveStatusOverrides(klass: unknown): StatusOverrideMap {
  const chain: StatusOverrideMap[] = [];
  let current: unknown = klass;
  while (typeof current === 'function') {
    if (Object.hasOwn(current, 'statusOverrides')) {
      const own = (current as { statusOverrides?: StatusOverrideMap }).statusOverrides;
      if (own) {
        chain.push(own);
      }
    }
    current = Object.getPrototypeOf(current);
  }
  // `chain` is leaf-first; assign parent-first so the leaf wins.
  return Object.assign({}, ...chain.reverse()) as StatusOverrideMap;
}

// ---------------------------------------------------------------------------
// Error messages
// ---------------------------------------------------------------------------

/**
 * The framework's default failure reason.
 *
 * Deliberately does not look at the response body. `genericNetworkHandler` — the fallback every
 * destination without its own handler already gets — builds exactly this kind of status-only
 * string and leaves the body to travel separately in `destinationResponse`
 * (`adapters/networkhandler/genericNetworkHandler.js`). There is no shared body-parsing
 * convention on the legacy path to inherit: every destination that wants a message out of its
 * body writes that itself, against the shape its own API returns.
 *
 * So the framework stays out of it, and an integration that wants better reads its own body in
 * its own `statusOverrides`.
 */
export const defaultFailureReason = (status: number): string =>
  `[Generic Response Handler] Request failed with status: ${status}`;

/** The framework's own status classification. Mirrors genericNetworkHandler's responseHandler. */
export const classifyByStatus = (status: number, reason: string): Verdict => {
  if (isHttpStatusSuccess(status)) return success();
  if (status === 429) return throttled(reason);
  if (isHttpStatusRetryable(status)) return retry(reason);
  return abort(reason);
};

// ---------------------------------------------------------------------------
// Bridge: verdicts -> DeliveryV1Response
// ---------------------------------------------------------------------------

/**
 * The message a verdict carries. Exported so an override that refines `fallback()` — turning a
 * plain abort into an auth-revoked one, say — can keep the framework's own message rather than
 * re-deriving it from the body.
 */
export const reasonOf = (v: Verdict): string => (v.kind === 'success' ? 'success' : v.reason);

/** The `statTags.errorType` a verdict implies. Shared by the throw path and the returned one. */
const errorTypeOf = (v: Verdict): string => {
  if (v.kind !== 'retry') return tags.ERROR_TYPES.ABORTED;
  return v.as === 'throttled' ? tags.ERROR_TYPES.THROTTLED : tags.ERROR_TYPES.RETRYABLE;
};

/**
 * Turn a handler's result into the delivery API response.
 *
 * Throws `TransformerProxyError` when the whole batch failed and there is no per-item detail to
 * lose — that path preserves statTags, the destinationResponse echo, authErrorCategory and error
 * reporting via the existing postTransformation handling. Everything else returns a response.
 */
export function toDeliveryV1Response(
  result: HandleResponseResult,
  ctx: DeliveryContext,
  destType: string,
): DeliveryV1Response {
  // `perItemPreserved` tracks whether we actually ended up with per-item detail: false for a
  // whole-batch verdict, and false when a per-item list had to be discarded.
  // `attributionLost` is the second of those — a per-item list whose length did not match the job
  // list, so nothing in it can be tied to a job.
  let verdicts: Verdict[];
  let perItemPreserved = false;
  let attributionLost = false;

  if (result.kind !== 'perItem') {
    verdicts = ctx.jobs.map(() => result);
  } else if (result.verdicts.length === ctx.jobs.length) {
    verdicts = result.verdicts;
    perItemPreserved = true;
  } else {
    // Never index past the end — that is how a job state with `metadata: undefined` gets emitted,
    // which rudder-server reports as a non-fatal in/out breach and then redelivers. Degrade to a
    // whole-batch verdict instead, and make the mismatch visible.
    stats.counter('batch_delivery_per_item_mismatch', 1, {
      destType,
      destinationId: ctx.jobs[0]?.destinationId ?? '',
      workspaceId: ctx.jobs[0]?.workspaceId ?? '',
      items: String(result.verdicts.length),
      jobs: String(ctx.jobs.length),
    });
    // Retry the batch rather than guess at it. Folding the verdicts into a worst-of would report
    // *success* whenever the ones that are present happen to be clean — including the empty-list
    // case, where the handler has decided there were failures but produced nothing to attribute
    // them to. A job with no verdict has an unknown outcome, and the only honest reading of an
    // unknown outcome is that it must be redelivered; re-sending items that already succeeded is
    // the accepted cost under the platform's at-least-once contract.
    attributionLost = true;
    verdicts = ctx.jobs.map(() =>
      retry(
        `[${destType}] per-item verdicts (${result.verdicts.length}) do not match jobs (${ctx.jobs.length})`,
      ),
    );
  }

  const first = verdicts[0] ?? success();

  // Uniform means same class, not same reason: two aborts with different messages are still one
  // abort as far as the platform is concerned.
  const uniform = verdicts.every(
    (v) =>
      v.kind === first.kind &&
      (v as RetryVerdict).as === (first as RetryVerdict).as &&
      (v as AbortVerdict).auth === (first as AbortVerdict).auth,
  );
  const allSucceeded = uniform && first.kind === 'success';

  // The classic whole-batch error. Four deliberate exclusions, all of them cases where the throw
  // would lose or contradict something the per-job path carries correctly:
  //
  //  - a 2xx status, because postTransformation echoes the thrown status into every job's
  //    statusCode and rudder-server's isSuccessStatus would then read failed events as delivered;
  //  - a preserved per-item list, because postTransformation rebuilds job states from metadata and
  //    would discard the per-item reasons. A destination reporting per-item failures on a non-2xx
  //    (mixpanel's /import does exactly that on a 400) keeps its detail this way;
  //  - a lost-attribution retry, because the throw carries `ctx.status` rather than a status
  //    derived from the verdict, so on a 4xx rudder-server's isJobTerminated would abort the very
  //    batch we just decided to retry. The per-job path derives 500 from the verdict;
  //  - a `dontBatch` retry, because that flag only exists as a metadata stamp on a job state and
  //    the throw has no job states to stamp.
  const carriesDontBatch = first.kind === 'retry' && first.dontBatch === true;
  if (
    uniform &&
    !allSucceeded &&
    !perItemPreserved &&
    !attributionLost &&
    !carriesDontBatch &&
    !isHttpStatusSuccess(ctx.status)
  ) {
    let authErrorCategory = '';
    if (first.kind === 'retry') {
      if (first.as === 'authExpired') authErrorCategory = REFRESH_TOKEN;
    } else if (first.kind === 'abort' && first.auth === 'revoked') {
      authErrorCategory = AUTH_STATUS_INACTIVE;
    }

    throw new TransformerProxyError(
      `[${destType}] ${reasonOf(first)}`,
      ctx.status,
      { [tags.TAG_NAMES.ERROR_TYPE]: errorTypeOf(first) },
      { status: ctx.status, response: ctx.response },
      authErrorCategory,
    );
  }

  const response: DeliveryJobState[] = verdicts.map((verdict, i) => {
    let statusCode = 400;
    if (verdict.kind === 'success') {
      statusCode = 200;
    } else if (verdict.kind === 'retry') {
      statusCode = verdict.as === 'throttled' ? 429 : 500;
    }
    const metadata = ctx.jobs[i];
    return {
      statusCode,
      metadata:
        verdict.kind === 'retry' && verdict.dontBatch ? { ...metadata, dontBatch: true } : metadata,
      error: reasonOf(verdict),
    };
  });

  const failures = verdicts.filter((v) => v.kind !== 'success');
  const distinctReasons = new Set(failures.map(reasonOf));

  // One reason is only worth quoting as *the* batch message when every failure agrees on it —
  // gaec's `partialFailureError.message`, or a single failed record. With several different
  // reasons, picking the first would present one job's error as the batch's, so say how many
  // failed and leave the detail to the per-job entries, which carry every reason keyed to its job.
  let message = `[${destType}] Request processed successfully`;
  if (distinctReasons.size === 1) {
    message = `[${destType}] ${[...distinctReasons][0]}`;
  } else if (distinctReasons.size > 1) {
    message = `[${destType}] ${failures.length} of ${verdicts.length} events failed; see per-event errors`;
  }

  // `statTags` drives rudder-server's `integration.failure_detailed` counter
  // (`processor/integrations/integrations.go:29-37`), which tags the response as a whole. That is
  // only honest when the response as a whole is one failure: every job failed, the same way. A
  // partially-succeeded batch has no single errorType, and labelling one 'aborted' — as gaec's
  // legacy handler did — counts a batch that partly delivered as a whole-batch abort.
  //
  // Only the error-describing half is set here, matching what the throw path hands
  // `TransformerProxyError`. The identifying half — destType, destinationId, workspaceId, module,
  // implementation, feature — is merged in by the caller from the same `getTags` metadata that
  // `postTransformation` merges for a thrown error, so both paths emit one tag set from one source.
  const allFailed = failures.length === verdicts.length && failures.length > 0;
  const statTags =
    uniform && allFailed
      ? {
          statTags: {
            [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.NETWORK,
            [tags.TAG_NAMES.ERROR_TYPE]: errorTypeOf(first),
          },
        }
      : undefined;

  return {
    // The destination's own status, always. `ProxyResponseV1` has no `status` field
    // (`router/transformer/transformer_proxy_adapter.go:40-44`), so rudder-server takes disposition
    // from each job state and never reads this; substituting 207 for a status the destination did
    // not send would invent a difference from the legacy handler that nothing benefits from.
    status: ctx.status,
    message,
    ...statTags,
    response,
  };
}
