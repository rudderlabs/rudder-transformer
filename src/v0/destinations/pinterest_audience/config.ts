import { RecordAction } from '../../../types/rudderEvents';

export const DESTINATION_TYPE = 'pinterest_audience';

export const BASE_URL = 'https://api.pinterest.com/v5';

/** Static metrics label; the ids live in the URL only, never in the label. */
export const ENDPOINT_PATH = '/ad_accounts/{ad_account_id}/customer_lists/{customer_list_id}';

export const getEndpoint = (adAccountId: string, customerListId: string): string =>
  `${BASE_URL}/ad_accounts/${adAccountId}/customer_lists/${customerListId}`;

/**
 * Rows per PATCH. Pinterest documents no ceiling; 2742
 * EXCEEDED_MAX_USER_LISTS_PER_REQUEST_LIMIT is the over-limit code.
 */
// pinned by probe P1 (spec §9)
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
