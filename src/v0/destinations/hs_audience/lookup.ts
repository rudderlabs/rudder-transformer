import {
  BaseError,
  NetworkError,
  RetryableError,
  ThrottledError,
} from '@rudderstack/integrations-lib';
import { httpPOST } from '../../../adapters/network';
import { processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { isHttpStatusSuccess } from '../../util';
import {
  CONTACT_BATCH_READ_PATH,
  CONTACT_BATCH_READ_URL,
  DESTINATION_TYPE,
  LOOKUP_MISSING_SCOPE,
  LOOKUP_REJECTED,
  LOOKUP_UNAVAILABLE,
  LOOKUP_UNCORRELATED,
  MAX_LOOKUP_BATCH_SIZE,
  OBJECT_NOT_FOUND,
  RATE_LIMIT_EXCEEDED,
  TOKEN_REJECTED,
} from './config';
import { JSON_HEADERS, normalizeContactId, normalizeLookupEmail } from './utils';

export type EmailLookupResult =
  | { kind: 'found'; recordId: string }
  | { kind: 'miss' }
  | { kind: 'error'; error: Error };

type Assignment = { kind: 'found'; recordId: string } | { kind: 'miss' };

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function optionalArray(value: unknown): unknown[] | null {
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value)) {
    return null;
  }
  return value;
}

// The same email may be repeated when the contact id agrees, or when both
// claims are a miss. A different id, or a hit and a miss together, cannot be
// trusted, so the chunk is retried and neither side becomes a confirmed miss.
function claim(assigned: Map<string, Assignment>, email: string, assignment: Assignment): boolean {
  const current = assigned.get(email);
  if (!current) {
    assigned.set(email, assignment);
    return true;
  }
  if (current.kind !== assignment.kind) {
    return false;
  }
  if (current.kind === 'found' && assignment.kind === 'found') {
    return current.recordId === assignment.recordId;
  }
  return true;
}

function claimResult(assigned: Map<string, Assignment>, result: unknown): boolean {
  const record = asRecord(result);
  const properties = asRecord(record?.properties);
  const email = normalizeLookupEmail(properties?.email);
  const contactId = normalizeContactId(record?.id);
  if (!email || !contactId.ok) {
    return false;
  }
  return claim(assigned, email, { kind: 'found', recordId: contactId.id });
}

function claimNotFound(assigned: Map<string, Assignment>, error: unknown): boolean {
  const record = asRecord(error);
  if (!record || record.category !== OBJECT_NOT_FOUND) {
    return false;
  }
  const ids = asRecord(record.context)?.ids;
  if (!Array.isArray(ids)) {
    return false;
  }
  return ids.every((rawId) => {
    if (typeof rawId !== 'string') {
      return false;
    }
    const email = normalizeLookupEmail(rawId);
    if (!email) {
      return false;
    }
    return claim(assigned, email, { kind: 'miss' });
  });
}

function numErrorsAgrees(body: Record<string, unknown>, errors: unknown[]): boolean {
  if (!Object.prototype.hasOwnProperty.call(body, 'numErrors')) {
    return true;
  }
  return body.numErrors === errors.length;
}

/**
 * Correlate a batch-read body by normalized email.
 * Returns null when the body cannot be trusted; callers retry the chunk and
 * must not mark any of its emails as missing contacts.
 * Identities are read only from `properties.email` and `context.ids`.
 */
export function correlateContactLookup(
  requestedEmails: readonly string[],
  body: unknown,
): Map<string, Assignment> | null {
  const record = asRecord(body);
  if (!record || record.status !== 'COMPLETE') {
    return null;
  }
  const results = optionalArray(record.results);
  const errors = optionalArray(record.errors);
  if (!results || !errors || !numErrorsAgrees(record, errors)) {
    return null;
  }

  const assigned = new Map<string, Assignment>();
  const resultsFit = results.every((result) => claimResult(assigned, result));
  const errorsFit = resultsFit && errors.every((error) => claimNotFound(assigned, error));
  const covered = errorsFit && requestedEmails.every((email) => assigned.has(email));
  if (!covered) {
    return null;
  }

  const byEmail = new Map<string, Assignment>();
  requestedEmails.forEach((email) => {
    const assignment = assigned.get(email);
    if (assignment) {
      byEmail.set(email, assignment);
    }
  });
  return byEmail;
}

// Transport failures often have no HTTP status. processAxiosResponse maps some
// of those (DNS, for example) onto 400, which would abort a blip as permanent.
function httpStatus(clientResponse: { success?: boolean; response?: any }): number | null {
  const status = clientResponse?.success
    ? clientResponse.response?.status
    : clientResponse?.response?.response?.status;
  if (typeof status !== 'number' || status === 0) {
    return null;
  }
  return status;
}

function lookupStatusError(status: number): Error {
  if (status === 401) {
    return new NetworkError(TOKEN_REJECTED, 401);
  }
  if (status === 403) {
    return new NetworkError(LOOKUP_MISSING_SCOPE, 403);
  }
  if (status === 429) {
    return new ThrottledError(RATE_LIMIT_EXCEEDED);
  }
  if (status >= 500) {
    return new RetryableError(LOOKUP_UNAVAILABLE, status);
  }
  // A 400 or 404 is not a confirmed miss and it is not a retry. The status is
  // kept so the router aborts the row, with a reason that does not say the
  // lookup will become available later.
  return new NetworkError(LOOKUP_REJECTED, status);
}

export function toLookupError(error: unknown): Error {
  if (error instanceof BaseError) {
    return error;
  }
  return new RetryableError(LOOKUP_UNAVAILABLE, 500);
}

async function lookupEmailChunk(
  accessToken: string,
  emails: string[],
  metadata: unknown,
): Promise<Map<string, Assignment>> {
  let clientResponse: { success?: boolean; response?: any };
  try {
    clientResponse = await httpPOST(
      CONTACT_BATCH_READ_URL,
      {
        idProperty: 'email',
        properties: ['email'],
        propertiesWithHistory: [],
        inputs: emails.map((id) => ({ id })),
      },
      {
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${accessToken}`,
        },
      },
      {
        destType: DESTINATION_TYPE,
        feature: 'transformation',
        module: 'router',
        requestMethod: 'POST',
        endpointPath: CONTACT_BATCH_READ_PATH,
        metadata,
      },
    );
  } catch (error) {
    throw toLookupError(error);
  }

  // No destinationResponse: generateErrorObject would embed the raw body,
  // and that body can repeat the emails from this request.
  if (httpStatus(clientResponse) === null) {
    throw new RetryableError(LOOKUP_UNAVAILABLE, 500);
  }
  const processed = processAxiosResponse(clientResponse);
  if (!isHttpStatusSuccess(processed.status)) {
    throw lookupStatusError(processed.status);
  }
  const correlated = correlateContactLookup(emails, processed.response);
  if (!correlated) {
    throw new RetryableError(LOOKUP_UNCORRELATED, 500);
  }
  return correlated;
}

function distinctInOrder(emails: string[]): string[] {
  const seen = new Set<string>();
  const distinct: string[] = [];
  emails.forEach((email) => {
    if (!seen.has(email)) {
      seen.add(email);
      distinct.push(email);
    }
  });
  return distinct;
}

/**
 * Look up distinct emails for one credential. Chunks run one after another so
 * a bad chunk does not cancel the emails that follow it. Each email in a failed
 * chunk receives the same classified error; confirmed misses are not guessed.
 */
export async function lookupDistinctEmails(
  accessToken: string,
  emails: string[],
  metadata: unknown,
): Promise<Map<string, EmailLookupResult>> {
  const results = new Map<string, EmailLookupResult>();
  const distinct = distinctInOrder(emails);
  let offset = 0;
  while (offset < distinct.length) {
    const chunk = distinct.slice(offset, offset + MAX_LOOKUP_BATCH_SIZE);
    offset += MAX_LOOKUP_BATCH_SIZE;
    try {
      // eslint-disable-next-line no-await-in-loop
      const correlated = await lookupEmailChunk(accessToken, chunk, metadata);
      correlated.forEach((assignment, email) => {
        results.set(email, assignment);
      });
    } catch (error) {
      const classified = toLookupError(error);
      chunk.forEach((email) => {
        results.set(email, { kind: 'error', error: classified });
      });
    }
  }
  return results;
}
