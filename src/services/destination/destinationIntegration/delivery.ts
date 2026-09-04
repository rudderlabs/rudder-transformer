/**
 * Delivery contract for the native batching framework.
 *
 * An integration says what should happen to a batch in terms the platform can act on — retry it,
 * drop it, or accept it — and this module turns that into the shape the delivery API requires.
 * Integrations never build a `DeliveryV1Response`, never choose an HTTP status code, and never
 * throw. See docs/superpowers/specs/2026-07-30-network-handler-abstraction-design.md.
 */
import { PlatformError } from '@rudderstack/integrations-lib';
import { TransformerProxyError } from '../../../v0/util/errorTypes';
import { isHttpStatusSuccess, isHttpStatusRetryable } from '../../../v0/util';
import tags from '../../../v0/util/tags';
import stats from '../../../util/stats';
import logger from '../../../logger';
import {
  REFRESH_TOKEN,
  AUTH_STATUS_INACTIVE,
} from '../../../adapters/networkhandler/authConstants';
import type {
  DeliveryJobState,
  DeliveryV1Response,
  ProxyMetdata,
  ProxyRequest,
  ProxyV1Request,
} from '../../../types';

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
 *
 * Both refinements are excluded by construction, not by omission. `as?: 'throttled'` already makes
 * `authExpired()` a type error, but a plain `{ kind: 'abort'; reason: string }` would *accept*
 * `authRevoked()` — a returned value gets no excess-property check, so the extra `auth: 'revoked'`
 * would be silently dropped and the record would abort as an ordinary 400. `auth?: never` closes
 * that, so both builders fail at the call site rather than one of them degrading quietly.
 */
export type ItemVerdict =
  | SuccessVerdict
  | { kind: 'abort'; reason: string; auth?: never }
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
 *
 * That makes a delivery spec and an **array-returning `transformEvent`** mutually exclusive.
 * `ctx.jobs` is one entry per job (`processDestinationIntegration` builds it from a `Set<number>` of
 * job ids), so one job contributing two body items puts the two lengths permanently out of step:
 * the guard retries the batch, the retry reproduces the same mismatch, and it never converges.
 * `destinationIntegration.ts`'s `transformEvent` and the VDM V2 dispatch table both permit an array, so
 * a destination that returns one must not declare `statusOverrides` that call `perItem`.
 */
export const perItem = (verdicts: ItemVerdict[]): PerItemVerdicts => ({
  kind: 'perItem',
  verdicts,
});

export type HandleResponseResult = Verdict | PerItemVerdicts;

// ---------------------------------------------------------------------------
// Context and overrides
// ---------------------------------------------------------------------------

export type DeliveryRequestContext = {
  /** One entry per job in this batch, in the order the framework built them. */
  jobs: ProxyMetdata[];
  /** The request about to be sent — for shaping transport-only fields. */
  request: ProxyRequest;
  destinationConfig: Record<string, unknown>;
  /**
   * `jobs[0]`'s destinationId/workspaceId, empty string if there is no first job. Set once where
   * the context is built, so a spec that needs them — for a stat tag, say — reads them here
   * instead of re-deriving from `jobs[0]` itself.
   */
  destinationId: string;
  workspaceId: string;
};

export type DeliveryContext = DeliveryRequestContext & {
  /** HTTP status from the destination, after processAxiosResponse. */
  status: number;
  /** Parsed destination response body. */
  response: unknown;
  /** The request that was sent — for correlating response items back to what was posted. */
  request: ProxyV1Request;
};

/** `DeliveryContext`'s `destinationId`/`workspaceId`, derived from its first job. */
export const firstJobIdentity = (
  jobs: ProxyMetdata[],
): Pick<DeliveryRequestContext, 'destinationId' | 'workspaceId'> => ({
  destinationId: jobs[0]?.destinationId ?? '',
  workspaceId: jobs[0]?.workspaceId ?? '',
});

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
 * So the framework stays out of it, and an integration that wants better reads its own body in its
 * own `delivery.failureReason`.
 */
export const defaultFailureReason = (status: number): string =>
  `[Generic Response Handler] Request failed with status: ${status}`;

/**
 * The framework's own status classification. Mirrors genericNetworkHandler's responseHandler.
 *
 * `reason` is a thunk so the success path costs nothing. `fallback()` is called for every response
 * with no override — including every plain 2xx — and an eagerly-evaluated reason would run the
 * destination's extractor over the whole body just to discard the result. `braze_audience`'s falls
 * through to `JSON.stringify(response)` when there is no `message`, which on a large batch response
 * is the expensive kind of nothing.
 */
export const classifyByStatus = (status: number, reason: () => string): Verdict => {
  if (isHttpStatusSuccess(status)) return success();
  if (status === 429) return throttled(reason());
  if (isHttpStatusRetryable(status)) return retry(reason());
  return abort(reason());
};

// ---------------------------------------------------------------------------
// The delivery spec
// ---------------------------------------------------------------------------

/**
 * Everything an integration declares about **delivery**, in one object.
 *
 * It is grouped rather than spread across loose statics because a `DestinationIntegration` is otherwise
 * entirely about *transformation* — `transformEvent`, `getBatchStrategy`, `getInputSchema` — and a
 * bare `statusOverrides` or `failureReason` sitting beside them reads as more of the same. Behind
 * `static readonly delivery`, the scope is stated at the declaration site: these describe what to
 * do with the destination's *response*, and they are the only members that do.
 *
 * Both entries are optional. A destination that needs neither declares no `delivery` at all and
 * gets the framework's classification, which reproduces `genericNetworkHandler`.
 */
export type DeliverySpec = {
  /**
   * Per-status behaviour, consulted before the framework's own classification. Exact status keys
   * take precedence over class keys ('2xx' / '4xx' / '5xx').
   */
  statusOverrides?: StatusOverrideMap;

  /**
   * The reason carried by a failure verdict.
   *
   * The default is status-only and never reads the body: the framework has no general way to find
   * a message in an arbitrary destination's response, and guessing at common field names
   * generalises one destination's shape onto every other. An integration whose API returns usable
   * error text supplies an extractor written against that API.
   */
  failureReason?: (ctx: DeliveryContext) => string;

  /**
   * Last chance to modify the outgoing request before it is sent. Whatever this adds is used for
   * the call and never persisted on the job — the place for secrets the destination needs but
   * that must not appear in live events.
   */
  prepareRequest?: (request: ProxyRequest, ctx: DeliveryRequestContext) => ProxyRequest;
};

/** A spec with response members filled in — what the framework actually runs against. */
export type ResolvedDeliverySpec = Required<
  Pick<DeliverySpec, 'statusOverrides' | 'failureReason'>
> &
  Pick<DeliverySpec, 'prepareRequest'>;

/** Hoisted so resolving a spec that declares no `failureReason` allocates nothing per request. */
const statusOnlyFailureReason = (ctx: DeliveryContext): string => defaultFailureReason(ctx.status);

/**
 * Collect the `delivery` specs down the prototype chain and fold them into one, child winning.
 *
 * Static properties are inherited but *shadowed*, not merged: a subclass declaring its own
 * `delivery` would otherwise silently drop everything an ancestor declared, with no type or
 * runtime error. `statusOverrides` is therefore merged key-by-key, so a family-level map on e.g.
 * VDMV2ObjectDestination keeps working when a concrete destination adds an entry of its own, and
 * `failureReason` resolves to the nearest declaration — which is what a plain static override
 * would have done. Not cached: the walk is three levels of small objects, nothing next to the HTTP
 * call it accompanies, and a cache would go stale whenever a test swaps a spec.
 *
 * Throws when handed anything that is not a class. `MiscService.getDestinationIntegrationHandler` is
 * `require(...).Integration`, so a missing or renamed export arrives here as `undefined`, and
 * walking from `undefined` resolves to the empty spec — which is a *valid* configuration meaning
 * "classify on status alone". Every destination that reports partial failures on a 2xx
 * (braze_audience, customerio, iterable_audience) would then answer each rejected record with
 * `statusCode: 200, error: 'success'`: dropped with no throw, no log and no metric. The transform
 * path already refuses the same mistake loudly, so this does too.
 */
export function resolveDeliverySpec(klass: unknown): ResolvedDeliverySpec {
  if (typeof klass !== 'function') {
    throw new PlatformError(
      'Delivery spec resolution: expected a DestinationIntegration class, got ' +
        `${klass === null ? 'null' : typeof klass}. The destination's routerTransform module ` +
        'likely does not export `Integration`.',
    );
  }

  // Leaf-first.
  const chain: DeliverySpec[] = [];
  let current: unknown = klass;
  while (typeof current === 'function') {
    if (Object.hasOwn(current, 'delivery')) {
      const own = (current as { delivery?: DeliverySpec }).delivery;
      if (own) {
        chain.push(own);
      }
    }
    current = Object.getPrototypeOf(current);
  }

  return {
    // Assign parent-first so the leaf wins.
    statusOverrides: Object.assign(
      {},
      ...chain.map((spec) => spec.statusOverrides ?? {}).reverse(),
    ) as StatusOverrideMap,
    failureReason:
      chain.find((spec) => spec.failureReason)?.failureReason ?? statusOnlyFailureReason,
    prepareRequest: chain.find((spec) => spec.prepareRequest)?.prepareRequest,
  };
}

/**
 * Apply a class's delivery spec to one response.
 *
 * Framework-owned, and a free function rather than a static so there is nothing for an integration
 * to override or to call `super` on. The resolution order — exact status, then status class, then
 * the framework's own classification — *is* the contract; a destination that wants different
 * behaviour declares an override for the status it cares about.
 */
export function handleDeliveryResponse(klass: unknown, ctx: DeliveryContext): HandleResponseResult {
  const { statusOverrides, failureReason } = resolveDeliverySpec(klass);
  const statusClass = statusClassOf(ctx.status);
  const override =
    statusOverrides[ctx.status] ?? (statusClass ? statusOverrides[statusClass] : undefined);
  const fallback = () => classifyByStatus(ctx.status, () => failureReason(ctx));
  return override ? override(ctx, fallback) : fallback();
}

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
  // `verdictsAttributable` is false only when a per-item list had to be discarded and the framework
  // synthesized a retry list instead.
  let verdicts: Verdict[];
  let perItemPreserved = false;
  let verdictsAttributable = true;

  if (result.kind !== 'perItem') {
    verdicts = ctx.jobs.map(() => result);
  } else if (result.verdicts.length === ctx.jobs.length) {
    verdicts = result.verdicts;
    perItemPreserved = true;
  } else {
    // Never index past the end — that is how a job state with `metadata: undefined` gets emitted,
    // which rudder-server reports as a non-fatal in/out breach and then redelivers. Degrade to a
    // whole-batch verdict instead, and make the mismatch visible.
    //
    // The two counts stay out of the label set and go in the log line instead. They are unbounded
    // in practice — MAX_BATCH_SIZE is 1000 for both braze_audience and iterable_audience, so tagging
    // both would open a 1000x1000 label space per (destType, destinationId, workspaceId). This
    // counter fires precisely when a destination is stuck in the mismatch/retry loop, so the guard
    // that surfaces the problem would be the thing that takes the metrics backend down with it.
    stats.counter('batch_delivery_per_item_mismatch', 1, {
      destType,
      destinationId: ctx.destinationId,
      workspaceId: ctx.workspaceId,
    });
    logger.error('Batching framework delivery: per-item verdicts do not match the job list', {
      destType,
      destinationId: ctx.destinationId,
      workspaceId: ctx.workspaceId,
      items: result.verdicts.length,
      jobs: ctx.jobs.length,
    });
    // Retry the batch rather than guess at it. Folding the verdicts into a worst-of would report
    // *success* whenever the ones that are present happen to be clean — including the empty-list
    // case, where the handler has decided there were failures but produced nothing to attribute
    // them to. A job with no verdict has an unknown outcome, and the only honest reading of an
    // unknown outcome is that it must be redelivered; re-sending items that already succeeded is
    // the accepted cost under the platform's at-least-once contract.
    verdictsAttributable = false;
    verdicts = ctx.jobs.map(() =>
      retry(
        `[${destType}] per-item verdicts (${result.verdicts.length}) do not match jobs (${ctx.jobs.length})`,
      ),
    );
  }

  // Sampled before the rewrite below, which erases the `dontBatch` marker by turning the verdict
  // into an abort. Computed after, the single-job case would fall through to the throw.
  const dontBatchRequested = verdicts.some((v) => v.kind === 'retry' && v.dontBatch === true);

  let dontBatchAbortCount = 0;
  verdicts = verdicts.map((verdict) => {
    if (verdict.kind === 'retry' && verdict.dontBatch === true && ctx.jobs.length === 1) {
      dontBatchAbortCount += 1;
      return abort(verdict.reason);
    }
    return verdict;
  });
  if (dontBatchAbortCount > 0) {
    stats.counter('batch_delivery_dont_batch_aborted', dontBatchAbortCount, {
      destType,
      destinationId: ctx.destinationId,
      workspaceId: ctx.workspaceId,
    });
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

  // The classic whole-batch error. Five deliberate exclusions, all of them cases where the throw
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
  //    the throw has no job states to stamp;
  //  - a `dontBatch` retry rewritten to an abort, because the throw carries `ctx.status` rather than a
  //    status derived from the verdict, so on a 5xx rudder-server would retry the very event we just
  //    decided to abort. The per-job path derives 400 from the rewritten verdict.
  if (
    uniform &&
    !allSucceeded &&
    !perItemPreserved &&
    !dontBatchRequested &&
    verdictsAttributable &&
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
    // (`router/transformer/transformer_proxy_adapter.go:41-45` — only `message`, `response` and
    // `authErrorCategory`), so rudder-server takes disposition from each job state and never reads
    // this; substituting 207 for a status the destination did not send would invent a difference
    // from the legacy handler that nothing benefits from.
    //
    // It is not dead, though, and it is not the status rudder-server sees on the wire. The v1
    // controller returns HTTP 200 for this response unless `authErrorCategory` is set, in which
    // case it derives the wire status from this field (`controllers/delivery.ts`). The framework
    // never sets `authErrorCategory` on a *returned* response — whole-batch auth verdicts go down
    // the throw path above — so for everything built here the field is carried but not read. The
    // shared `DeliveryV1Response` type and its zod schema both require it regardless.
    status: ctx.status,
    message,
    ...statTags,
    response,
  };
}
