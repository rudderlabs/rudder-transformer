export const DESTINATION = 'OPENAI_ADS';
export const BASE_URL = 'https://bzr.openai.com';
export const ENDPOINT_PATH = '/v1/events';
export const ENDPOINT = `${BASE_URL}${ENDPOINT_PATH}`;
export const MAX_BATCH_SIZE = 1000;
export const MAX_PAYLOAD_SIZE = '4MB';
// OpenAI's ingest window, both bounds quoted from its Conversions API reference: "The timestamp
// must be within the last 7 days and no more than 10 minutes in the future."
//
// OpenAI enforces the window per batch, atomically — one violating event 422s the entire request
// (see `staleTimestampResponse` in test/integrations/destinations/openai_ads/network.ts). The
// delivery spec cannot attribute that 422 to a single job: it maps 400 and 422 alike to
// `retry({ dontBatch: true })`, which re-sends every job in the batch on its own. At
// MAX_BATCH_SIZE = 1000, one bad event turns a single request into 1001 — and is aborted at the
// end of that anyway. Checking here costs one InstrumentationError against the one bad event.
export const MAX_EVENT_AGE_MS = 7 * 24 * 60 * 60 * 1000;
export const MAX_EVENT_FUTURE_SKEW_MS = 10 * 60 * 1000;
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
