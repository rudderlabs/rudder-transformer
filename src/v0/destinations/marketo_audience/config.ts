// Label for the instrumented lookup call (`outgoing_request_*` metrics).
export const DESTINATION_TYPE = 'marketo_audience';

// Marketo's per-call maximums: 300 lead IDs for list membership, 300 filter values for lookup.
export const MAX_LEAD_IDS = 300;
export const MAX_LOOKUP_EMAILS = 300;

// Fixed metric and throttler labels. The list ID belongs on `endpoint` only.
export const LOOKUP_ENDPOINT_PATH = '/rest/v1/leads.json';
export const MEMBERSHIP_ENDPOINT_PATH = '/rest/v1/lists/:listId/leads.json';

export const INVALID_LEAD_ID = 'Invalid Marketo Lead ID';
export const INVALID_EMAIL_IDENTIFIER = 'Invalid email identifier';
export const NO_IDENTIFIER_MAPPED = 'No identifier mapped';
export const LIST_ID_REQUIRED = 'Marketo static list ID is required';
export const LIST_ID_INVALID = 'Marketo static list ID is invalid';

export const LEAD_NOT_FOUND = 'Lead not found in Marketo';
export const REMOVAL_UNCONFIRMED =
  'Removal could not be confirmed: Marketo lead not found by email';
export const DUPLICATE_LEADS =
  'Email matches more than one Marketo lead; merge the duplicates in Marketo or map the Marketo Lead ID';
export const CONFLICTING_MEMBERSHIP = 'Conflicting membership operations for Marketo lead';
export const TOKEN_UNAVAILABLE = 'Marketo access token could not be fetched';
export const ROW_NOT_PREPARED = 'Marketo Audience row was not prepared before transform';
export const PRESTAGE_FAILED = 'Marketo Audience could not prepare the row';

export const DAILY_QUOTA_REACHED = 'Marketo daily API quota reached';
export const MEMBERSHIP_FAILED = 'Marketo request failed';
export const RESPONSE_UNMATCHED = 'Marketo response could not be matched to the request';
export const PARTITION_DENIED = 'Lead is in a partition the Marketo API user cannot access';
export const LIST_NOT_FOUND = 'Marketo static list not found';
export const WRITE_PERMISSION_MISSING = 'Marketo API user lacks Read-Write Lead permission';
export const LOOKUP_FAILED = 'Marketo lead lookup failed';
export const LOOKUP_UNMATCHED = 'Marketo lead lookup response could not be matched to the request';
export const READ_PERMISSION_MISSING = 'Marketo API user lacks Read-Only Lead permission';
