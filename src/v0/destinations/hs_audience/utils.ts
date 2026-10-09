import validator from 'validator';
import {
  HUBSPOT_API_BASE,
  INVALID_EMAIL_IDENTIFIER,
  INVALID_RECORD_ID,
  LIST_ID_INVALID,
  LIST_ID_REQUIRED,
  MEMBERSHIP_ENDPOINT_PATH,
  NO_IDENTIFIER_MAPPED,
  isSafeListId,
} from './config';
import type { HubSpotAudiencePayload, MembershipOperation } from './types';

const DECIMAL_DIGITS = /^\d+$/;

// Membership transform output stops here. The bearer token is added later, on a
// clone, so it is not stored with the router payload.
export const JSON_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
};

export type ContactIdClassification = { ok: true; id: string } | { ok: false; empty: boolean };

export type EmailClassification =
  | { kind: 'empty' }
  | { kind: 'invalid' }
  | { kind: 'valid'; email: string };

export type IdentifierResolution =
  | { kind: 'id'; recordId: string }
  | { kind: 'email'; email: string }
  | { kind: 'error'; message: string };

export type ListIdResolution = { ok: true; listId: string } | { ok: false; message: string };

// Absent, null, and whitespace-only are empty. `0` and `false` are not: a
// supplied value that cannot be a HubSpot id must fail instead of falling through.
function isBlank(value: unknown): boolean {
  if (value === undefined || value === null) {
    return true;
  }
  return typeof value === 'string' && value.trim() === '';
}

function normalizeDecimalId(value: string): ContactIdClassification {
  const trimmed = value.trim();
  if (trimmed === '') {
    return { ok: false, empty: true };
  }
  if (!DECIMAL_DIGITS.test(trimmed)) {
    return { ok: false, empty: false };
  }
  // String replace, not Number(): ids past MAX_SAFE_INTEGER must stay exact.
  const withoutLeadingZeros = trimmed.replace(/^0+/, '');
  if (withoutLeadingZeros === '') {
    return { ok: false, empty: false };
  }
  return { ok: true, id: withoutLeadingZeros };
}

export function normalizeContactId(value: unknown): ContactIdClassification {
  if (isBlank(value)) {
    return { ok: false, empty: true };
  }
  if (typeof value === 'number') {
    if (Number.isSafeInteger(value) && value > 0) {
      return { ok: true, id: String(value) };
    }
    return { ok: false, empty: false };
  }
  if (typeof value === 'string') {
    return normalizeDecimalId(value);
  }
  return { ok: false, empty: false };
}

export function classifyEmail(value: unknown): EmailClassification {
  if (value === undefined || value === null) {
    return { kind: 'empty' };
  }
  if (typeof value !== 'string') {
    return { kind: 'invalid' };
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === '') {
    return { kind: 'empty' };
  }
  if (!validator.isEmail(normalized)) {
    return { kind: 'invalid' };
  }
  return { kind: 'valid', email: normalized };
}

// Lookup responses are matched on the same trim/lowercase email the request used.
export function normalizeLookupEmail(value: unknown): string | null {
  const classified = classifyEmail(value);
  if (classified.kind !== 'valid') {
    return null;
  }
  return classified.email;
}

function identifierRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }
  return value as Record<string, unknown>;
}

// A malformed record id never falls through to email. A valid id skips email
// validation entirely, including when the email itself would be rejected.
export function resolveIdentifier(identifiers: unknown): IdentifierResolution {
  const record = identifierRecord(identifiers);
  const contactId = normalizeContactId(record.hs_object_id);
  if (!contactId.ok && !contactId.empty) {
    return { kind: 'error', message: INVALID_RECORD_ID };
  }
  if (contactId.ok) {
    return { kind: 'id', recordId: contactId.id };
  }

  const email = classifyEmail(record.email);
  if (email.kind === 'invalid') {
    return { kind: 'error', message: INVALID_EMAIL_IDENTIFIER };
  }
  if (email.kind === 'valid') {
    return { kind: 'email', email: email.email };
  }
  return { kind: 'error', message: NO_IDENTIFIER_MAPPED };
}

export function readAccessToken(config: unknown): string | null {
  if (!config || typeof config !== 'object') {
    return null;
  }
  const token = (config as Record<string, unknown>).accessToken;
  if (typeof token !== 'string') {
    return null;
  }
  const trimmed = token.trim();
  if (trimmed === '') {
    return null;
  }
  return trimmed;
}

// List ids are not contact ids: "00123" stays "00123". Encoding happens only
// when the id is placed in the URL path.
export function readListId(connection: unknown): ListIdResolution {
  const destination = (connection as { config?: { destination?: { audienceId?: unknown } } })
    ?.config?.destination;
  const audienceId = destination?.audienceId;
  if (typeof audienceId !== 'string') {
    return { ok: false, message: LIST_ID_REQUIRED };
  }
  const trimmed = audienceId.trim();
  if (trimmed === '') {
    return { ok: false, message: LIST_ID_REQUIRED };
  }
  if (!isSafeListId(trimmed)) {
    return { ok: false, message: LIST_ID_INVALID };
  }
  return { ok: true, listId: trimmed };
}

export function membershipOperation(action: unknown): MembershipOperation | null {
  if (action === 'insert' || action === 'update') {
    return 'add';
  }
  if (action === 'delete') {
    return 'remove';
  }
  return null;
}

export function membershipEndpoint(listId: string): string {
  const path = MEMBERSHIP_ENDPOINT_PATH.replace(':listId', encodeURIComponent(listId));
  return `${HUBSPOT_API_BASE}${path}`;
}

// Duplicate ids stay. Delivery applies one verdict per sent id, in this order,
// which is also the jobIds insertion order.
export function wrapMembershipBody(bodies: HubSpotAudiencePayload[]): {
  recordIdsToAdd: string[];
  recordIdsToRemove: string[];
} {
  const orderedIds = bodies.map((body) => body.recordId);
  if (bodies[0]?.operation === 'remove') {
    return { recordIdsToAdd: [], recordIdsToRemove: orderedIds };
  }
  return { recordIdsToAdd: orderedIds, recordIdsToRemove: [] };
}
