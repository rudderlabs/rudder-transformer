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
import {
  JSON_HEADERS,
  formatHubSpotError,
  normalizeContactId,
  normalizeLookupEmail,
} from './utils';

export type EmailLookupResult =
  | { kind: 'found'; recordId: string }
  | { kind: 'miss' }
  | { kind: 'error'; error: Error };

type Assignment = { kind: 'found'; recordId: string } | { kind: 'miss' };

const LOOKUP_FAILURE_REASONS: Readonly<Partial<Record<number, string>>> = {
  401: TOKEN_REJECTED,
  403: LOOKUP_MISSING_SCOPE,
  429: RATE_LIMIT_EXCEEDED,
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function claimResult(
  assigned: Map<string, Assignment>,
  requested: ReadonlySet<string>,
  result: unknown,
): void {
  const record = asRecord(result);
  const properties = asRecord(record?.properties);
  const contactId = normalizeContactId(record?.id);
  if (!contactId.ok) {
    return;
  }
  const additional = properties?.hs_additional_emails;
  const addresses = [
    properties?.email,
    ...(typeof additional === 'string' ? additional.split(';') : []),
  ];
  addresses.forEach((address) => {
    const email = normalizeLookupEmail(address);
    if (email && requested.has(email) && !assigned.has(email)) {
      assigned.set(email, { kind: 'found', recordId: contactId.id });
    }
  });
}

function claimNotFound(
  assigned: Map<string, Assignment>,
  requested: ReadonlySet<string>,
  error: unknown,
): void {
  const record = asRecord(error);
  if (record?.category !== OBJECT_NOT_FOUND) {
    return;
  }
  const ids = asRecord(record.context)?.ids;
  if (Array.isArray(ids)) {
    ids.forEach((id) => {
      const email = normalizeLookupEmail(id);
      if (email && requested.has(email) && !assigned.has(email)) {
        assigned.set(email, { kind: 'miss' });
      }
    });
  }
}

/** Match usable lookup results and confirmed misses by normalized email. */
export function correlateContactLookup(
  requestedEmails: readonly string[],
  body: unknown,
): Map<string, Assignment> {
  const record = asRecord(body);
  const assigned = new Map<string, Assignment>();
  const requested = new Set(requestedEmails);
  // Keep the first contact match; a not-found entry must not overwrite a found contact.
  if (Array.isArray(record?.results)) {
    record.results.forEach((result) => claimResult(assigned, requested, result));
  }
  if (Array.isArray(record?.errors)) {
    record.errors.forEach((error) => claimNotFound(assigned, requested, error));
  }
  return assigned;
}

function lookupStatusError(status: number, response: unknown): Error {
  const fallbackReason =
    LOOKUP_FAILURE_REASONS[status] ??
    (status === 477 || status >= 500 ? LOOKUP_UNAVAILABLE : LOOKUP_REJECTED);
  const reason = formatHubSpotError(response, fallbackReason);
  if (status === 429) {
    return new ThrottledError(reason);
  }
  // 477 is HubSpot's portal-migration status. Retry-After can ask for a long
  // wait; this verdict does not forward that header.
  if (status === 477 || status >= 500) {
    return new RetryableError(reason, status);
  }
  // A rejected lookup is not a confirmed contact miss.
  return new NetworkError(reason, status);
}

function isPortalWideLookupFailure(error: Error): boolean {
  const { status } = error as { status?: unknown };
  return status === 401 || status === 403 || status === 429 || status === 477;
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
        properties: ['email', 'hs_additional_emails'],
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
  const processed = processAxiosResponse(clientResponse);
  if (!isHttpStatusSuccess(processed.status)) {
    throw lookupStatusError(processed.status, processed.response);
  }
  return correlateContactLookup(emails, processed.response);
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
 * Look up distinct emails for one credential. Chunks run one after another.
 * A 401, 403, 429, or 477 stops the loop: those answers are about the token or
 * the portal, so every email not yet sent receives that same error. Any other
 * failed chunk stays local, and the chunks after it are still sent. Confirmed
 * misses are not guessed.
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
      chunk.forEach((email) => {
        // An uncovered email retries its own rows; confirmed matches stay deliverable.
        results.set(
          email,
          correlated.get(email) ?? {
            kind: 'error',
            error: new RetryableError(LOOKUP_UNCORRELATED, 500),
          },
        );
      });
    } catch (error) {
      const classified = toLookupError(error);
      chunk.forEach((email) => {
        results.set(email, { kind: 'error', error: classified });
      });
      if (isPortalWideLookupFailure(classified)) {
        distinct.slice(offset).forEach((email) => {
          results.set(email, { kind: 'error', error: classified });
        });
        break;
      }
    }
  }
  return results;
}
