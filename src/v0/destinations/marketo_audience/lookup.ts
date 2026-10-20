import {
  AbortedError,
  BaseError,
  RetryableError,
  ThrottledError,
} from '@rudderstack/integrations-lib';
import { httpPOST } from '../../../adapters/network';
import { processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { isHttpStatusSuccess } from '../../util';
import {
  ACCESS_DENIED,
  DESTINATION_TYPE,
  LOOKUP_ENDPOINT_PATH,
  LOOKUP_FAILED,
  LOOKUP_UNMATCHED,
  MAX_LOOKUP_EMAILS,
} from './config';
import {
  asRecord,
  authCache,
  baseUrl,
  classifyMarketoCode,
  firstErrorCode,
  parsePositiveId,
  type MarketoOutcome,
} from './utils';

export type LookupOutcome =
  | { kind: 'found'; leadId: number }
  | { kind: 'missing' }
  | { kind: 'duplicate' }
  | { kind: 'error'; error: Error };

type LookupRequest = {
  accountId: string;
  token: string;
  destinationId: string;
  workspaceId: string;
  // Already trimmed and lowercased.
  emails: string[];
};

// Lead IDs matched so far, keyed by requested email.
type Matches = Map<string, Set<number>>;

function outcomeError(outcome: MarketoOutcome): Error {
  if (outcome.kind === 'throttled') {
    return new ThrottledError(outcome.reason);
  }
  if (outcome.kind === 'retry') {
    return new RetryableError(outcome.reason);
  }
  return new AbortedError(outcome.reason);
}

// Transport failures have no HTTP status, and processAxiosResponse maps some of them (DNS, for
// one) onto 400, which would abort a network blip as permanent.
function hasHttpStatus(clientResponse: {
  success?: boolean;
  response?: { status?: unknown; response?: { status?: unknown } };
}): boolean {
  const status = clientResponse.success
    ? clientResponse.response?.status
    : clientResponse.response?.response?.status;
  return typeof status === 'number' && status !== 0;
}

function httpError(status: number): Error {
  if (status === 429) {
    return new ThrottledError('Marketo rate limit reached (HTTP 429)');
  }
  if (status >= 500) {
    return new RetryableError(`${LOOKUP_FAILED} (HTTP ${status})`);
  }
  return new AbortedError(`${LOOKUP_FAILED} (HTTP ${status})`, status);
}

// A POST with `_method=GET` keeps the emails out of the URL, which 300 addresses can push past
// Marketo's 8 KB limit. URLSearchParams encodes `+` and `&`, which a raw form body would mangle.
async function fetchPage(
  request: LookupRequest,
  emails: string[],
  pageToken: string | undefined,
): Promise<unknown> {
  const form = new URLSearchParams({
    filterType: 'email',
    filterValues: emails.join(','),
    fields: 'id,email',
    batchSize: String(MAX_LOOKUP_EMAILS),
  });
  if (pageToken) {
    form.set('nextPageToken', pageToken);
  }
  const clientResponse = await httpPOST(
    `${baseUrl(request.accountId)}${LOOKUP_ENDPOINT_PATH}?_method=GET`,
    form.toString(),
    {
      headers: {
        Authorization: `Bearer ${request.token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
    {
      destType: DESTINATION_TYPE,
      feature: 'transformation',
      module: 'router',
      requestMethod: 'POST',
      endpointPath: LOOKUP_ENDPOINT_PATH,
      metadata: { destinationId: request.destinationId, workspaceId: request.workspaceId },
    },
  );
  if (!hasHttpStatus(clientResponse)) {
    throw new RetryableError(`${LOOKUP_FAILED} (network error)`);
  }
  const { status, response } = processAxiosResponse(clientResponse);
  if (!isHttpStatusSuccess(status)) {
    throw httpError(status);
  }
  return response;
}

/**
 * Add one page of leads to `matches` and return the next page token, if any. Throws a typed error
 * for a Marketo failure, and a retryable one for a body that cannot be matched to the request:
 * an unreadable page must never turn into "lead not found".
 */
function collectPage(body: unknown, matches: Matches, destinationId: string): string | undefined {
  const page = asRecord(body);
  if (!page) {
    throw new RetryableError(LOOKUP_UNMATCHED);
  }
  if (page.success !== true) {
    const code = firstErrorCode(page);
    if (!code) {
      throw new RetryableError(LOOKUP_UNMATCHED);
    }
    const outcome = classifyMarketoCode(code, { '603': ACCESS_DENIED }, LOOKUP_FAILED);
    if (outcome.evictToken) {
      authCache.del(destinationId);
    }
    throw outcomeError(outcome);
  }
  if (!Array.isArray(page.result)) {
    throw new RetryableError(LOOKUP_UNMATCHED);
  }
  page.result.forEach((entry) => {
    const lead = asRecord(entry);
    if (typeof lead?.email !== 'string') {
      throw new RetryableError(LOOKUP_UNMATCHED);
    }
    // Marketo matches emails case-insensitively; requested emails are already lowercased.
    const ids = matches.get(lead.email.trim().toLowerCase());
    // A lead for an address this chunk did not ask for says nothing about the requested ones.
    if (!ids) {
      return;
    }
    const leadId = parsePositiveId(lead.id);
    if (!leadId.ok) {
      throw new RetryableError(LOOKUP_UNMATCHED);
    }
    ids.add(leadId.id);
  });
  if (page.moreResult !== true) {
    return undefined;
  }
  if (typeof page.nextPageToken !== 'string' || page.nextPageToken === '') {
    throw new RetryableError(LOOKUP_UNMATCHED);
  }
  return page.nextPageToken;
}

async function matchChunk(request: LookupRequest, emails: string[]): Promise<Matches> {
  const matches: Matches = new Map(emails.map((email) => [email, new Set<number>()]));
  const usedTokens = new Set<string>();
  let pageToken: string | undefined;
  do {
    // eslint-disable-next-line no-await-in-loop -- each page needs the previous page's token
    const body = await fetchPage(request, emails, pageToken);
    const nextToken = collectPage(body, matches, request.destinationId);
    if (typeof nextToken === 'string') {
      // A token Marketo already handed out would page forever.
      if (usedTokens.has(nextToken)) {
        throw new RetryableError(LOOKUP_UNMATCHED);
      }
      usedTokens.add(nextToken);
    }
    pageToken = nextToken;
  } while (pageToken !== undefined);
  return matches;
}

function matchOutcome(ids: Set<number> | undefined): LookupOutcome {
  if (!ids || ids.size === 0) {
    return { kind: 'missing' };
  }
  if (ids.size > 1) {
    return { kind: 'duplicate' };
  }
  return { kind: 'found', leadId: [...ids][0] };
}

// A failed chunk fails its own emails only, with the classified error.
async function lookupChunk(
  request: LookupRequest,
  emails: string[],
): Promise<[string, LookupOutcome][]> {
  try {
    const matches = await matchChunk(request, emails);
    return emails.map((email) => [email, matchOutcome(matches.get(email))]);
  } catch (error) {
    const classified = error instanceof BaseError ? error : new RetryableError(LOOKUP_FAILED);
    return emails.map((email) => [email, { kind: 'error', error: classified }]);
  }
}

/**
 * Resolve normalized emails to Marketo lead IDs, 300 distinct emails per call. Each email maps to
 * one outcome: one lead found, none, several (duplicates), or the error its chunk failed with.
 */
export async function lookupLeadsByEmail(
  request: LookupRequest,
): Promise<Map<string, LookupOutcome>> {
  const distinct = [...new Set(request.emails)];
  const outcomes = new Map<string, LookupOutcome>();
  for (let offset = 0; offset < distinct.length; offset += MAX_LOOKUP_EMAILS) {
    // eslint-disable-next-line no-await-in-loop -- one call at a time against the instance rate limit
    const chunkOutcomes = await lookupChunk(
      request,
      distinct.slice(offset, offset + MAX_LOOKUP_EMAILS),
    );
    chunkOutcomes.forEach(([email, outcome]) => outcomes.set(email, outcome));
  }
  return outcomes;
}
