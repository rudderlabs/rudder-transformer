export const DESTINATION = 'OPENAI_ADS';
export const BASE_URL = 'https://bzr.openai.com';
export const ENDPOINT_PATH = '/v1/events';
export const ENDPOINT = `${BASE_URL}${ENDPOINT_PATH}`;
export const MAX_BATCH_SIZE = 1000;
export const MAX_PAYLOAD_SIZE = '4MB';
export const CUSTOM_EVENT_SENTINEL = 'custom';
export const STANDARD_EVENT_DATA_TYPES = {
  app_installed: 'customer_action',
  app_opened: 'customer_action',
  appointment_scheduled: 'customer_action',
  checkout_started: 'contents',
  contents_viewed: 'contents',
  items_added: 'contents',
  lead_created: 'customer_action',
  order_created: 'contents',
  page_viewed: 'contents',
  registration_completed: 'customer_action',
  subscription_created: 'plan_enrollment',
  trial_started: 'plan_enrollment',
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
