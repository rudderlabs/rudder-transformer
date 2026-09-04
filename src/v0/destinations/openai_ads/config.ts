export const DESTINATION = 'OPENAI_ADS';
export const BASE_URL = 'https://bzr.openai.com';
export const ENDPOINT_PATH = '/v1/events';
export const ENDPOINT = `${BASE_URL}${ENDPOINT_PATH}`;
export const MAX_BATCH_SIZE = 1000;
export const MAX_PAYLOAD_SIZE = '4MB';
// OpenAI rejects the *whole batch* when any event falls outside these bounds, and — unlike its
// 400s — the 422 it answers with carries no event index, so the batch can only be split blindly
// one event at a time. Checking here keeps a single stale event from costing a full isolation
// cycle.
//
// Both bounds are OpenAI's own, quoted back by its 422s: `event_timestamp_ms must be within the
// last 7 days` (recorded in test/integrations/destinations/openai_ads/network.ts) and
// `event_timestamp_ms must not be more than 600 seconds in the future`.
export const MAX_EVENT_AGE_MS = 7 * 24 * 60 * 60 * 1000;
export const MAX_EVENT_FUTURE_SKEW_MS = 600 * 1000;
// OpenAI re-evaluates the window when it *receives* the batch, which is later than when we build
// the event by the batch-assembly and network delay. Without a margin an event at 6d23h59m59s
// passes here and still 422s the whole batch — exactly what this check exists to prevent.
export const EVENT_AGE_SAFETY_MARGIN_MS = 60 * 1000;
export const CUSTOM_EVENT_SENTINEL = 'custom';
const CONTENTS_DATA_TYPE = 'contents';
export const CUSTOMER_ACTION_DATA_TYPE = 'customer_action';
const PLAN_ENROLLMENT_DATA_TYPE = 'plan_enrollment';
export const EVENT_DATA_TYPES = [
  CONTENTS_DATA_TYPE,
  CUSTOMER_ACTION_DATA_TYPE,
  PLAN_ENROLLMENT_DATA_TYPE,
  CUSTOM_EVENT_SENTINEL,
] as const;
export const STANDARD_EVENT_DATA_TYPES = {
  app_installed: CUSTOMER_ACTION_DATA_TYPE,
  app_opened: CUSTOMER_ACTION_DATA_TYPE,
  appointment_scheduled: CUSTOMER_ACTION_DATA_TYPE,
  checkout_started: CONTENTS_DATA_TYPE,
  contents_viewed: CONTENTS_DATA_TYPE,
  items_added: CONTENTS_DATA_TYPE,
  lead_created: CUSTOMER_ACTION_DATA_TYPE,
  order_created: CONTENTS_DATA_TYPE,
  page_viewed: CONTENTS_DATA_TYPE,
  registration_completed: CUSTOMER_ACTION_DATA_TYPE,
  subscription_created: PLAN_ENROLLMENT_DATA_TYPE,
  trial_started: PLAN_ENROLLMENT_DATA_TYPE,
} as const;
export const STANDARD_EVENTS = Object.keys(STANDARD_EVENT_DATA_TYPES) as [
  keyof typeof STANDARD_EVENT_DATA_TYPES,
  ...(keyof typeof STANDARD_EVENT_DATA_TYPES)[],
];
export const ACTION_SOURCES = [
  'web',
  'mobile_app',
  'offline',
  'physical_store',
  'phone_call',
  'email',
  'other',
] as const;
export const HASHED_MATCH_FIELDS = [
  'emails_sha256',
  'phone_numbers_sha256',
  'external_ids_sha256',
  'first_names_sha256',
  'last_names_sha256',
] as const;
