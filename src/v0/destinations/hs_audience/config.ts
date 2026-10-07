// Same character class as rudder-integrations-info `isSafeListId`. List ids are
// path segments, so this rejects traversal, query breaks, and whitespace
// before any URL encoding happens. The control characters are intentional.
// eslint-disable-next-line no-control-regex
const UNSAFE_LIST_ID = /[\s\u0000-\u001F#/?\\\u007F]/;

export const DESTINATION_TYPE = 'HS_AUDIENCE';

// Our cap, not a documented HubSpot maximum. Email lookup stays at 100.
export const MAX_MEMBERSHIP_BATCH_SIZE = 1000;
export const MAX_LOOKUP_BATCH_SIZE = 100;

export const HUBSPOT_API_BASE = 'https://api.hubapi.com';
export const CONTACT_BATCH_READ_PATH = '/crm/v3/objects/contacts/batch/read';
export const CONTACT_BATCH_READ_URL = `${HUBSPOT_API_BASE}${CONTACT_BATCH_READ_PATH}`;
// Fixed metric/throttle label. The list id belongs on `endpoint` only.
export const MEMBERSHIP_ENDPOINT_PATH = '/crm/v3/lists/:listId/memberships/add-and-remove';

export const ACCESS_TOKEN_REQUIRED = 'HubSpot access token is required';
export const LIST_ID_REQUIRED = 'HubSpot list ID is required';
export const LIST_ID_INVALID = 'HubSpot list ID is invalid';
export const UNSUPPORTED_RECORD_ACTION = 'Unsupported record action';
export const INVALID_RECORD_ID = 'Invalid HubSpot Record ID';
export const INVALID_EMAIL_IDENTIFIER = 'Invalid email identifier';
export const NO_IDENTIFIER_MAPPED = 'No identifier mapped';
export const CONTACT_NOT_FOUND = 'Contact not found in HubSpot';
export const REMOVAL_UNCONFIRMED = 'Removal could not be confirmed: HubSpot identifier not found';
export const CONFLICTING_MEMBERSHIP = 'Conflicting membership operations for HubSpot contact';
export const LOOKUP_UNCORRELATED = 'HubSpot contact lookup response could not be correlated';
export const TOKEN_REJECTED = 'HubSpot rejected the access token';
export const LOOKUP_MISSING_SCOPE = 'HubSpot token is missing the crm.objects.contacts.read scope';
export const MEMBERSHIP_MISSING_SCOPE = 'HubSpot token is missing the crm.lists.write scope';
export const RATE_LIMIT_EXCEEDED = 'HubSpot rate limit exceeded';
export const LOOKUP_UNAVAILABLE = 'HubSpot contact lookup is temporarily unavailable';
export const LOOKUP_REJECTED = 'HubSpot contact lookup was rejected';
export const LIST_NOT_FOUND = 'HubSpot list was not found';
export const LIST_INELIGIBLE = 'HubSpot list is not eligible for contact membership sync';
export const MEMBERSHIP_REJECTED = 'HubSpot membership update was rejected';
export const MEMBERSHIP_UNAVAILABLE = 'HubSpot membership update is temporarily unavailable';
export const MEMBERSHIP_UNCORRELATED = 'HubSpot membership response could not be correlated';

export const OBJECT_NOT_FOUND = 'OBJECT_NOT_FOUND';
export const VALIDATION_ERROR = 'VALIDATION_ERROR';
// HubSpot's published ineligible-list signal. Message text is not a substitute:
// other 400 bodies can mention a DYNAMIC list without this subcategory.
export const INELIGIBLE_LIST_SUBCATEGORY = 'ListError.INVALID_OBJECT_TYPE_FOR_LIST';

export function isSafeListId(listId: string): boolean {
  if (listId.length === 0 || listId === '.' || listId === '..') {
    return false;
  }
  return !UNSAFE_LIST_ID.test(listId);
}
