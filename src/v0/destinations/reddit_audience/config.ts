import { RecordAction } from '../../../types/rudderEvents';

export const DESTINATION_TYPE = 'reddit_audience';

export const BASE_URL = 'https://ads-api.reddit.com/api/v3';

export const getEndpoint = (audienceId: string): string =>
  `${BASE_URL}/custom_audiences/${audienceId}/users`;

export const getEndpointPath = (): string => '/custom_audiences/{audience_id}/users';

/**
 * Reddit's documented per-request maximum for `data.user_data`
 * (OpenAPI `user_data.maxItems`, and the operation description:
 * "Limited to 2,500 `user_data` entries per request").
 */
export const MAX_BATCH_SIZE = 2500;

/**
 * `action_type` enum is exactly ADD | REMOVE — there is no upsert and no delete.
 * INSERT and UPDATE both mean "this user is a member", so both map to ADD.
 */
export const ACTION_TYPES = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
} as const;

export type ActionType = (typeof ACTION_TYPES)[keyof typeof ACTION_TYPES];

export const ACTION_RECORD_MAP: Record<RecordAction, ActionType> = {
  [RecordAction.INSERT]: ACTION_TYPES.ADD,
  [RecordAction.UPDATE]: ACTION_TYPES.ADD,
  [RecordAction.DELETE]: ACTION_TYPES.REMOVE,
};

/**
 * The only two identifier columns Reddit's Custom Audiences API accepts.
 * Phone / external id / IP exist on Reddit's *Conversions* API, not here.
 *
 * Declared in this fixed order so that `column_order` — and therefore the
 * batch grouping key derived from it — is stable regardless of the key order
 * of the incoming `identifiers` object.
 */
export const REDDIT_COLUMNS = ['EMAIL_SHA256', 'MAID_SHA256'] as const;

export type RedditColumn = (typeof REDDIT_COLUMNS)[number];

/**
 * Reddit's docs are explicit that a missing or generic user agent is itself a
 * cause of 403 (Blocked) and 429 responses, and ask integrators not to use a
 * default library agent. Format follows their documented convention:
 * `{platform}:{unique app id}:{version} (by /u/{reddit username})`.
 */
export const USER_AGENT = 'web:com.rudderstack.reddit-audience:v1.0.0 (by /u/rudderstack)';
