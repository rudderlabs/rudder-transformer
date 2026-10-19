import { RecordAction } from '../../../types/rudderEvents';

export const DESTINATION_TYPE = 'pinterest_audience';

export const BASE_URL = 'https://api.pinterest.com/v5';

/** Static metrics label; the ids live in the URL only, never in the label. */
export const ENDPOINT_PATH = '/ad_accounts/{ad_account_id}/customer_lists/{customer_list_id}';

export const getEndpoint = (adAccountId: string, customerListId: string): string =>
  `${BASE_URL}/ad_accounts/${adAccountId}/customer_lists/${customerListId}`;

/**
 * Rows per PATCH. Under `records` a row with email and MAID is two records, so a classic body
 * carries up to 2 × this many identifiers. Pinterest documents no ceiling; 2742
 * EXCEEDED_MAX_USER_LISTS_PER_REQUEST_LIMIT is the over-limit code.
 */
// Probe P1 (spec §9, 2026-10-16): Pinterest accepted ≥ 10,000 classic identifiers in one
// request, so 1000 rows stays.
export const MAX_RECORDS_PER_REQUEST = 1000;

/**
 * Pinterest OpenAPI v5.28.0 path parameters `ad_account_id` and `customer_list_id`:
 * `pattern: ^\d+$`, `maxLength: 18`. Both are interpolated into the URL path.
 */
export const PINTEREST_ID_PATTERN = /^\d{1,18}$/;

/** `UserListOperationType` is exactly ADD | REMOVE. */
const OPERATION_TYPES = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
} as const;

export type OperationType = (typeof OPERATION_TYPES)[keyof typeof OPERATION_TYPES];

export const ACTION_RECORD_MAP: Record<RecordAction, OperationType> = {
  [RecordAction.INSERT]: OPERATION_TYPES.ADD,
  [RecordAction.UPDATE]: OPERATION_TYPES.ADD,
  [RecordAction.DELETE]: OPERATION_TYPES.REMOVE,
};

/** The identifier names integrations-info `/listFields` returns and the mapper writes as `to`. */
export const IDENTIFIERS = ['EMAIL', 'MAID', 'PHONE'] as const;

export type PinterestIdentifier = (typeof IDENTIFIERS)[number];

/** `CustomerListRecordRow` property per identifier (spec §3.3). */
export const RECORD_KEY_BY_IDENTIFIER = {
  EMAIL: 'email',
  MAID: 'maid',
  PHONE: 'hashed_phone_number',
} as const satisfies Record<PinterestIdentifier, string>;

export type RecordKey = (typeof RECORD_KEY_BY_IDENTIFIER)[PinterestIdentifier];

/**
 * Body format for customer-list writes, chosen by the definition (spec D15).
 * `records`: classic comma-separated SHA-256 values (emails, MAIDs, IDFAs) — what Pinterest
 * accepts for our app today. `records_v2`: multi-field rows incl. `hashed_phone_number`, which
 * Pinterest enables per app (403 code 29 until then).
 */
export const RECORD_FORMATS = {
  CLASSIC: 'records',
  V2: 'records_v2',
} as const;

export type RecordFormat = (typeof RECORD_FORMATS)[keyof typeof RECORD_FORMATS];

/** Absent, misspelt or unknown => classic: the format that cannot be refused for our app. */
export const resolveRecordFormat = (
  definitionConfig: Record<string, unknown> | undefined,
): RecordFormat =>
  definitionConfig?.recordFormat === RECORD_FORMATS.V2 ? RECORD_FORMATS.V2 : RECORD_FORMATS.CLASSIC;

/** PHONE exists only as `records_v2.hashed_phone_number`; the classic string has no phone slot. */
export const IDENTIFIERS_BY_FORMAT: Record<RecordFormat, readonly PinterestIdentifier[]> = {
  [RECORD_FORMATS.CLASSIC]: ['EMAIL', 'MAID'],
  [RECORD_FORMATS.V2]: IDENTIFIERS,
};
