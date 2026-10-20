import validator from 'validator';
import Cache from '../../util/cache';
import { AUTH_CACHE_TTL } from '../../util/constant';
import {
  DAILY_QUOTA_REACHED,
  INVALID_EMAIL_IDENTIFIER,
  INVALID_LEAD_ID,
  LIST_ID_INVALID,
  LIST_ID_REQUIRED,
  NO_IDENTIFIER_MAPPED,
} from './config';

type IdentifierResolution =
  | { kind: 'id'; leadId: number }
  | { kind: 'email'; email: string }
  | { kind: 'error'; message: string };

type ListIdResolution = { ok: true; listId: string } | { ok: false; message: string };

/** What Marketo's application error code means for the request that received it. */
export type MarketoOutcome = {
  kind: 'retry' | 'throttled' | 'abort';
  reason: string;
  evictToken: boolean;
};

type PositiveId = { ok: true; id: number } | { ok: false; empty: boolean };

type EmailClassification =
  | { kind: 'empty' }
  | { kind: 'invalid' }
  | { kind: 'valid'; email: string };

const DECIMAL_DIGITS = /^\d+$/;

// https://experienceleague.adobe.com/en/docs/marketo-developer/marketo/rest/error-codes
const TOKEN_CODES = ['601', '602'];
const RETRYABLE_CODES = ['604', '611', '713'];
const THROTTLED_CODES = ['502', '606', '608', '615'];
const DAILY_QUOTA_CODE = '607';

// One access token per destination ID, kept for Marketo's `expires_in`. The lookup and delivery
// evict it when Marketo answers 601/602, so the retried jobs fetch a new one.
export const authCache = new Cache('MARKETO_AUDIENCE_AUTH', AUTH_CACHE_TTL);

export function baseUrl(accountId: string): string {
  return `https://${accountId}.mktorest.com`;
}

export function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

// Marketo reports application errors as HTTP 200 with `success: false` and `errors[].code`.
export function firstErrorCode(body: Record<string, unknown>): string | undefined {
  const code = Array.isArray(body.errors) ? asRecord(body.errors[0])?.code : undefined;
  return typeof code === 'string' || typeof code === 'number' ? String(code) : undefined;
}

// Absent, null and whitespace-only are empty. `0` and `false` are not: a supplied value that
// cannot be an ID fails instead of falling through to the next identifier.
function isBlank(value: unknown): boolean {
  return (
    value === undefined || value === null || (typeof value === 'string' && value.trim() === '')
  );
}

// Marketo lead and list IDs are positive integers. Anything past MAX_SAFE_INTEGER cannot be sent
// exactly as a JSON number, so it fails rather than being rounded to another lead.
export function parsePositiveId(value: unknown): PositiveId {
  if (isBlank(value)) {
    return { ok: false, empty: true };
  }
  let id: number;
  if (typeof value === 'number') {
    id = value;
  } else if (typeof value === 'string' && DECIMAL_DIGITS.test(value.trim())) {
    id = Number(value.trim());
  } else {
    return { ok: false, empty: false };
  }
  return Number.isSafeInteger(id) && id > 0 ? { ok: true, id } : { ok: false, empty: false };
}

// `filterValues` is comma-separated, so an address containing a comma would be read as two.
function classifyEmail(value: unknown): EmailClassification {
  if (value === undefined || value === null) {
    return { kind: 'empty' };
  }
  if (typeof value !== 'string') {
    return { kind: 'invalid' };
  }
  const email = value.trim().toLowerCase();
  if (email === '') {
    return { kind: 'empty' };
  }
  if (email.includes(',') || !validator.isEmail(email)) {
    return { kind: 'invalid' };
  }
  return { kind: 'valid', email };
}

/**
 * Pick the row's Marketo identifier: the lead ID when present, else the email. A malformed lead
 * ID fails the row and never falls back to email.
 */
export function resolveIdentifier(identifiers?: Record<string, unknown>): IdentifierResolution {
  const leadId = parsePositiveId(identifiers?.id);
  if (leadId.ok) {
    return { kind: 'id', leadId: leadId.id };
  }
  if (!leadId.empty) {
    return { kind: 'error', message: INVALID_LEAD_ID };
  }
  const email = classifyEmail(identifiers?.email);
  if (email.kind === 'valid') {
    return { kind: 'email', email: email.email };
  }
  if (email.kind === 'invalid') {
    return { kind: 'error', message: INVALID_EMAIL_IDENTIFIER };
  }
  return { kind: 'error', message: NO_IDENTIFIER_MAPPED };
}

/** The static list ID from the row's own connection. */
export function readListId(connection?: {
  config?: { destination?: { audienceId?: unknown } };
}): ListIdResolution {
  const listId = parsePositiveId(connection?.config?.destination?.audienceId);
  if (listId.ok) {
    return { ok: true, listId: String(listId.id) };
  }
  return { ok: false, message: listId.empty ? LIST_ID_REQUIRED : LIST_ID_INVALID };
}

/**
 * Classify the first application error code of a `success: false` body. `abortReasons` names the
 * codes whose meaning depends on the call (a permission, a missing list); any other unlisted code
 * aborts with `<fallback> (code <code>)`.
 */
export function classifyMarketoCode(
  code: string,
  abortReasons: Record<string, string>,
  fallback: string,
): MarketoOutcome {
  if (TOKEN_CODES.includes(code)) {
    return {
      kind: 'retry',
      reason: `Marketo rejected the access token (code ${code})`,
      evictToken: true,
    };
  }
  if (RETRYABLE_CODES.includes(code)) {
    return {
      kind: 'retry',
      reason: `Marketo is temporarily unavailable (code ${code})`,
      evictToken: false,
    };
  }
  if (THROTTLED_CODES.includes(code)) {
    return {
      kind: 'throttled',
      reason: `Marketo rate limit reached (code ${code})`,
      evictToken: false,
    };
  }
  // The daily quota resets at 12:00 AM CST, so a later retry succeeds. rudder-server retries a
  // throttled job without counting it against the retry limit, and Marketo does not charge calls
  // that return a limit code. MARKETO and MARKETO_STATIC_LIST throttle 607 too.
  if (code === DAILY_QUOTA_CODE) {
    return { kind: 'throttled', reason: DAILY_QUOTA_REACHED, evictToken: false };
  }
  return {
    kind: 'abort',
    reason: abortReasons[code] ?? `${fallback} (code ${code})`,
    evictToken: false,
  };
}
