import stats from '../stats';
import { getCaptureConfig } from './config';
import { FileWriter } from './fileWriter';
import { Sampler } from './sampler';
import { CaptureMetadata, CaptureRecord } from './types';
// type-only: the class is required at module load only when capture is
// enabled, so disabled processes never pay the S3 SDK load cost
import type { S3Uploader, S3UploaderOptions } from './s3Uploader';

const INSTANCE_ID = process.env.INSTANCE_ID || 'localhost';
const MAX_BODY_BYTES = 256 * 1024;
const WARN_INTERVAL_MS = 5 * 60_000;
const SENSITIVE_HEADERS = new Set([
  'authorization',
  'proxy-authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'x-auth-token',
  'api-key',
  'access-token',
]);
// query-param KEYS matching this are masked; other params often carry the
// event itself for GET-style destinations and must stay debuggable
const SENSITIVE_PARAM_PATTERN =
  /(^|[_-])(api)?key$|token|secret|auth|sig(nature)?$|passw|pwd|credential|session/i;

const config = getCaptureConfig();

type UploaderConstructor = new (opts: S3UploaderOptions) => S3Uploader;
const loadUploaderClass = (): UploaderConstructor =>
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  require('./s3Uploader').S3Uploader;
// the SDK costs ~100ms to load — pay it at boot (module load) when capture
// is enabled instead of inside the first live delivery
const EagerUploaderClass = config.enabled ? loadUploaderClass() : undefined;
let captureDisabled = false;
let sampler: Sampler | undefined;
let writer: FileWriter | undefined;
let uploader: S3Uploader | undefined;
let flushTimer: NodeJS.Timeout | undefined;
let flushPromise: Promise<void> | undefined;
const warnedErrors = new Map<string, number>();

// requestIds of captured requests whose response should be captured too.
// Self-cleaning: every delivery emits a response (responseLog runs in a
// finally block), so entries only linger after a crash — the cap bounds that.
const INFLIGHT_CAP = 1000;
const inflightRequestIds = new Set<string>();

interface ErrorLike {
  name?: unknown;
  code?: unknown;
  message?: unknown;
}

// duck-typed: SDK/cross-realm errors are not always instanceof Error
const asErrorLike = (err: unknown): ErrorLike => (err && typeof err === 'object' ? err : {});

/** `code` distinguishes fs/network errors that all share `name: 'Error'`. */
const errorReason = (err: unknown): string => {
  const e = asErrorLike(err);
  if (typeof e.code === 'string' && e.code) {
    return e.code;
  }
  return typeof e.name === 'string' && e.name ? e.name : 'unknown';
};

/** Rate-limited per distinct reason; the metric carries every occurrence. */
const warnRateLimited = (context: string, err: unknown): void => {
  const reason = errorReason(err);
  const key = `${context}:${reason}`;
  const lastLoggedAt = warnedErrors.get(key);
  const now = Date.now();
  if (typeof lastLoggedAt === 'number' && now - lastLoggedAt < WARN_INTERVAL_MS) {
    return;
  }
  warnedErrors.set(key, now);
  // lazy require to avoid a payloadCapture → logger → payloadCapture cycle at load
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  const logger = require('../../logger');
  const e = asErrorLike(err);
  const message = typeof e.message === 'string' ? e.message : String(err);
  logger.warn(`payload capture ${context} failed: [${reason}] ${message}`);
};

const rememberInflight = (requestId: string): void => {
  if (inflightRequestIds.size >= INFLIGHT_CAP) {
    const oldest = inflightRequestIds.values().next().value;
    if (typeof oldest === 'string') {
      inflightRequestIds.delete(oldest);
    }
  }
  inflightRequestIds.add(requestId);
};

const shouldCapture = (record: { kind: string; requestId?: string }, pairKey: string): boolean => {
  if (record.kind === 'request') {
    return sampler?.allow(pairKey) === true;
  }
  // a response is captured iff its request was captured (paired by requestId);
  // id-less callers fall back to a sampling budget of their own
  if (record.requestId) {
    return inflightRequestIds.has(record.requestId);
  }
  return sampler?.allow(`${pairKey}__response`) === true;
};

/** IDs land in filenames and S3 keys; the `__` delimiter must stay unambiguous. */
const sanitizeId = (value: string | undefined): string =>
  (value || 'unknown').replace(/[^\dA-Za-z-]/g, '-');

const isPlainObjectOrArray = (value: object): boolean => {
  if (Array.isArray(value)) {
    return true;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

/**
 * Bounds and type-guards a captured body: only strings, plain objects and
 * arrays are stored (a FormData or stream body serialises uselessly or
 * throws), and anything over MAX_BODY_BYTES is cut down to a preview.
 */
const safeBody = (body: unknown): unknown => {
  if (body === null || body === undefined) {
    return body;
  }
  if (typeof body === 'string') {
    return body.length > MAX_BODY_BYTES
      ? { truncated: true, preview: body.slice(0, MAX_BODY_BYTES) }
      : body;
  }
  if (typeof body === 'number' || typeof body === 'boolean') {
    return body;
  }
  if (typeof body === 'object' && isPlainObjectOrArray(body)) {
    let json: string;
    try {
      json = JSON.stringify(body);
    } catch {
      return { unserializable: true };
    }
    if (typeof json !== 'string') {
      return { unserializable: true };
    }
    return json.length > MAX_BODY_BYTES
      ? { truncated: true, preview: json.slice(0, MAX_BODY_BYTES) }
      : body;
  }
  return { unserializable: body?.constructor?.name || typeof body };
};

/** Masks values of secret-looking query params; other params stay debuggable. */
const maskQueryParams = (url: unknown): unknown => {
  if (typeof url !== 'string') {
    return url;
  }
  const queryStart = url.indexOf('?');
  if (queryStart === -1) {
    return url;
  }
  const params = new URLSearchParams(url.slice(queryStart + 1));
  const masked: string[] = [];
  for (const [key, value] of params) {
    masked.push(`${key}=${SENSITIVE_PARAM_PATTERN.test(key) ? '***' : encodeURIComponent(value)}`);
  }
  return `${url.slice(0, queryStart)}?${masked.join('&')}`;
};

// no plain-object requirement: axios responses carry an AxiosHeaders
// instance, whose own enumerable props Object.entries reads fine
const redactHeaders = (headers: unknown): unknown => {
  if (typeof headers !== 'object' || headers === null) {
    return undefined;
  }
  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(headers)) {
    redacted[key] = SENSITIVE_HEADERS.has(key.toLowerCase()) ? '***' : value;
  }
  return redacted;
};

const sanitizeDetails = (details: Record<string, unknown>): Record<string, unknown> => ({
  ...details,
  ...('url' in details && { url: maskQueryParams(details.url) }),
  ...('body' in details && { body: safeBody(details.body) }),
  ...('headers' in details && { headers: redactHeaders(details.headers) }),
});

const flushOnce = async (): Promise<void> => {
  if (!writer || !uploader) {
    return;
  }
  writer.rotateAged(config.flushIntervalMs);
  for (const filePath of await writer.listRotatedAsync()) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const sizeBytes = await uploader.uploadFile(filePath);
      writer.onFileRemoved(sizeBytes);
      stats.increment('payload_capture_uploaded');
    } catch (err) {
      // keep the file for the next cycle
      warnRateLimited('upload', err);
      stats.increment('payload_capture_upload_failure', { reason: errorReason(err) });
    }
  }
};

/** Single in-flight flush shared by the timer and shutdown. */
const runFlush = (): Promise<void> => {
  if (!flushPromise) {
    flushPromise = flushOnce().finally(() => {
      flushPromise = undefined;
    });
  }
  return flushPromise;
};

const ensureStarted = (): boolean => {
  if (writer) {
    return true;
  }
  if (captureDisabled) {
    return false;
  }
  try {
    const newWriter = new FileWriter({
      dir: config.dir,
      maxFileBytes: config.maxFileBytes,
      maxDiskBytes: config.maxDiskBytes,
      instanceId: INSTANCE_ID,
    });
    newWriter.init();
    const S3UploaderImpl = EagerUploaderClass ?? loadUploaderClass();
    const newUploader: S3Uploader = new S3UploaderImpl({
      bucket: config.bucket,
      prefix: config.prefix,
      endpoint: config.endpoint,
      region: config.region,
    });
    const newTimer = setInterval(() => {
      runFlush().catch(() => {
        // flushOnce handles per-file errors; this guards the rotate step
        stats.increment('payload_capture_upload_failure', { reason: 'flush' });
      });
    }, config.flushIntervalMs);
    // never keep the process alive just for the capture loop
    newTimer.unref();
    sampler = new Sampler(config.sampleIntervalMs);
    uploader = newUploader;
    flushTimer = newTimer;
    writer = newWriter;
    return true;
  } catch (err) {
    // e.g. staging dir not writable — disable for this process instead of
    // failing (and miscounting) every delivery
    captureDisabled = true;
    warnRateLimited('init', err);
    stats.increment('payload_capture_dropped', { reason: 'init' });
    return false;
  }
};

export const payloadCapture = {
  /**
   * Fire-and-forget: samples, then appends the record to a local file for a
   * later S3 upload. Never throws into the delivery path.
   */
  write(record: CaptureRecord): void {
    if (!config.enabled) {
      return;
    }
    try {
      if (!ensureStarted()) {
        return;
      }
      // a batched delivery request carries one metadata per job, all for the
      // same customer — capture one record per unique (workspace, destination)
      // pair, not one per job
      const uniquePairs = new Map<string, CaptureMetadata>();
      for (const entry of record.metadata) {
        const pairKey = `${sanitizeId(entry.workspaceId)}__${sanitizeId(entry.destinationId)}`;
        if (!uniquePairs.has(pairKey)) {
          uniquePairs.set(pairKey, entry);
        }
      }
      // a paired response of an uncaptured request is the normal case: skip
      // it before the capacity check so it never inflates the disk_cap counter
      const pairedResponseSkipped =
        record.kind === 'response' &&
        typeof record.requestId === 'string' &&
        !inflightRequestIds.has(record.requestId);
      const pairsToProcess = pairedResponseSkipped ? [] : [...uniquePairs];
      for (const [pairKey, entry] of pairsToProcess) {
        if (!writer?.hasCapacity()) {
          // full disk: don't burn the sampling window on a record we can't keep
          stats.increment('payload_capture_dropped', { reason: 'disk_cap' });
        } else if (!shouldCapture(record, pairKey)) {
          // rate-limited requests are counted; id-less response fallbacks are not
          if (record.kind === 'request') {
            stats.increment('payload_capture_sampled_out');
          }
        } else {
          const line = `${JSON.stringify({
            ts: new Date().toISOString(),
            kind: record.kind,
            identifierMsg: record.identifierMsg,
            requestId: record.requestId,
            workspaceId: entry.workspaceId || 'unknown',
            destinationId: entry.destinationId || 'unknown',
            destType: entry.destType || entry.destinationType,
            sourceId: entry.sourceId,
            ...sanitizeDetails(record.details),
          })}\n`;
          if (writer?.append(pairKey, line)) {
            stats.increment('payload_capture_written');
            if (record.kind === 'request' && record.requestId) {
              rememberInflight(record.requestId);
            }
          } else {
            stats.increment('payload_capture_dropped', { reason: 'disk_cap' });
          }
        }
      }
      if (record.kind === 'response' && record.requestId) {
        inflightRequestIds.delete(record.requestId);
      }
    } catch (err) {
      warnRateLimited('write', err);
      stats.increment('payload_capture_dropped', { reason: 'error' });
    }
  },

  /**
   * Rotates and best-effort uploads everything within a fixed budget; called
   * from shutdown hooks, so it must neither throw nor hang.
   */
  async shutdown(): Promise<void> {
    if (flushTimer) {
      clearInterval(flushTimer);
      flushTimer = undefined;
    }
    if (!writer) {
      return;
    }
    try {
      const deadline = new Promise<void>((resolve) => {
        setTimeout(resolve, config.shutdownBudgetMs).unref();
      });
      // let a timer-triggered flush finish before rotating what's left
      if (flushPromise) {
        await Promise.race([flushPromise, deadline]);
      }
      writer.rotateAll();
      await Promise.race([runFlush(), deadline]);
    } catch (err) {
      warnRateLimited('shutdown', err);
    }
  },
};
