import { DeliveryJobState } from '../../types/index';
import stats from '../../util/stats';
import { parseEnvInt } from '../../util/utils';

/**
 * Bounds the `error` a v1 delivery response carries back to rudder-server.
 *
 * That field is where the proxy reports why a job failed, and it is usually the destination's own
 * response body verbatim. A v1 response repeats it once per job in the batch (`response[].error`),
 * so what the transformer has to serialize grows as `batchSize x bodySize`. At a few MB per body
 * and a few thousand jobs that crosses V8's ~512MB maximum string length, `JSON.stringify` throws
 * `RangeError: Invalid string length`, and rudder-server receives a body with no `output` field —
 * which it reports as `router_transformerproxy_invalid_response{reason="missing output"}`.
 *
 * The detail exists for debugging, and beyond the first few KB it stops serving that purpose, so it
 * is capped rather than removed.
 *
 * # v1 only, deliberately
 *
 * v0 delivery responses carry the same echo in `destinationResponse` and are **not** capped. That
 * is a decision, not an oversight, and the reason is the multiplication rather than the echo:
 *
 * - `ProxyV0Request.metadata` is a single `ProxyMetdata`; `ProxyV1Request` overrides it to
 *   `ProxyMetdata[]`. One v0 request is one job, so a v0 response carries the body **once**. There
 *   is no `batchSize x bodySize` growth to bound — the response is the size of the body.
 * - A single body is already bounded upstream: axios rejects a response larger than
 *   `MAX_CONTENT_LENGTH` (`src/adapters/network.js`, 100MB by default), which is roughly five times
 *   under the string length that breaks serialization.
 *
 * So capping v0 would trade real debugging detail for no safety. If that ever changes — a v0 route
 * that accepts an array `metadata`, or `MAX_CONTENT_LENGTH` raised past ~512MB — the premise above
 * is what to re-check.
 */

/**
 * 50KB, chosen against the batch size rather than picked for readability.
 *
 * The cap is per job, so what the response serializes to is still `batchSize x cap` — the cap
 * lowers the ceiling, it does not remove the multiplication. That ceiling has to stay under V8's
 * ~512MB maximum string length at the largest batch the proxy is asked to deliver, and the batch
 * that produced INT-6978 was 6000 jobs:
 *
 *   6000 x 100KB = ~600MB  -> still `RangeError: Invalid string length`, the original bug
 *   6000 x  50KB = ~300MB  -> serializes
 *
 * So 100KB would have left the reported failure reproducible at the batch size that reported it.
 * Raising `PROXY_DESTINATION_RESPONSE_MAX_BYTES` above 50KB is safe only where batches stay well
 * under 6000; a guarantee independent of batch size would need an aggregate budget divided across
 * `response[]` rather than a per-job limit.
 */
const DEFAULT_MAX_BYTES = 50 * 1024;

/**
 * Read per call rather than bound at import.
 *
 * A limit captured in a module constant is fixed for the life of the process, so the only way to
 * exercise a different one is to reload the module - which is why the tests used to reach for
 * `jest.resetModules()`, and why anything driving the cap through the real route had to clear the
 * 50KB default with a multi-MB payload. Reading here lets the env var set the limit at the point it
 * is used, so a test can lower the cap to a few hundred bytes and prove the same behaviour with a
 * few KB. Cost is one `Number.parseInt` per delivery response - not per job - against a function
 * that already walks the whole batch.
 */
const maxBytesFromEnv = (): number =>
  parseEnvInt(process.env.PROXY_DESTINATION_RESPONSE_MAX_BYTES, DEFAULT_MAX_BYTES);

/**
 * Cap one `error` string to at most `maxBytes` UTF-8 **bytes**.
 *
 * Module-private: `capDeliveryV1Errors` is the only entry point, so there is no way to cap a job
 * state without going through the memo that keeps the capping itself from amplifying.
 *
 * Returns the error unchanged when it already fits, so the caller can apply it unconditionally and
 * a normal response keeps its exact bytes.
 *
 * Bytes rather than `String.prototype.slice`, which counts UTF-16 code units: that under-counts
 * multi-byte characters, so a byte budget expressed in code units is wrong by up to 4x, and a cut
 * between the halves of a surrogate pair leaves a lone surrogate behind.
 */
const capDeliveryResponse = (error: string, maxBytes: number): string => {
  // `JSON.stringify` returns `undefined` at runtime for an absent body, despite its TypeScript
  // return type, and a job state built from one carries that through. Nothing to cap.
  if (typeof error !== 'string') return error;

  // Allocation-free, and the overwhelming majority of errors never exceed the budget.
  const bytes = Buffer.byteLength(error);
  if (bytes <= maxBytes) return error;

  const notice = `...[truncated: ${bytes} bytes exceeded the ${maxBytes} byte limit]`;
  // `slice` first so the copy is bounded: this runs on exactly the oversized values the cap exists
  // to keep out of memory, and `Buffer.from(error)` would copy all of one. The bound is safe
  // because every UTF-16 code unit encodes to at least one UTF-8 byte, so the first `maxBytes` code
  // units always contain the first `maxBytes` bytes.
  const buf = Buffer.from(error.slice(0, maxBytes));
  let end = Math.max(0, maxBytes - Buffer.byteLength(notice));
  // Back off any UTF-8 continuation byte (0x80..0xBF) so the cut lands on a character boundary.
  while (end > 0 && buf[end] >= 0x80 && buf[end] <= 0xbf) {
    end -= 1;
  }

  return buf.subarray(0, end).toString() + notice;
};

/**
 * Cap every `error` in a v1 delivery response, in place. **The only place the cap is applied.**
 *
 * Called once, from `DeliveryController.deliverToDestinationV1`, immediately before the response
 * becomes `ctx.body`. That is the single point every v1 response reaches, whichever producer built
 * it — the batching framework, the v0->v1 adaptation, a native v1 handler, `deliver`'s catch, or
 * the controller's own catch, which is not reachable from inside `deliver` at all. Capping at the
 * producers instead took three call sites and still had to be re-argued every time `deliver` grew
 * another return.
 *
 * # The memo
 *
 * Every producer builds one error string and shares it across the batch, so `response[]` is
 * typically N references to one string. Truncating each entry independently would allocate N
 * distinct copies of the capped string and rescan the full body N times — re-creating, at 50KB a
 * job, the very `batchSize x bodySize` amplification this module exists to remove.
 *
 * One entry is enough to collapse that: the shared case is N *consecutive* hits. It also collapses
 * the equal-but-distinct strings a per-job producer builds, since `!==` on strings compares by
 * value. Measured at 2000 jobs x 2MB: 142MB and 657ms without it, 1.5MB and 0.8ms with it.
 */
export const capDeliveryV1Errors = (
  response: DeliveryJobState[] | undefined,
  // Optional to match `ErrorDetailer.destType`, which the delivery failure paths already pass
  // straight through to stats.
  destType: string | undefined,
  // Default arguments are evaluated per call, so this picks up the env var as it stands when the
  // response is capped rather than as it stood when the module was first required.
  maxBytes: number = maxBytesFromEnv(),
): void => {
  if (!Array.isArray(response)) return;

  let lastInput: string | undefined;
  let lastOutput: string | undefined;
  let truncated = 0;

  response.forEach((jobState) => {
    if (jobState.error !== lastInput) {
      lastInput = jobState.error;
      lastOutput = capDeliveryResponse(jobState.error, maxBytes);
    }
    if (lastOutput !== jobState.error) truncated += 1;
    // eslint-disable-next-line no-param-reassign
    jobState.error = lastOutput as string;
  });

  // Counted per job state rather than per distinct string, so the number answers "how many events
  // lost detail" rather than "how many times the memo missed". Counter only, no log line: a
  // destination chronically above the cap would truncate on every delivery, which at proxy
  // throughput is spam rather than signal.
  // `counter` rather than `increment`, which takes no delta — one call per response instead of one
  // per job.
  if (truncated > 0) {
    stats.counter('proxy_destination_response_truncated', truncated, { destType });
  }
};
