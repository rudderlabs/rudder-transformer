export const DESTINATION = 'OPENAI_ADS';
export const BASE_URL = 'https://bzr.openai.com';
export const ENDPOINT_PATH = '/v1/events';
export const ENDPOINT = `${BASE_URL}${ENDPOINT_PATH}`;
export const MAX_BATCH_SIZE = 1000;
export const MAX_PAYLOAD_SIZE = '4MB';
export const CUSTOM_EVENT_SENTINEL = 'custom';
export const STANDARD_EVENTS = [
  'app_installed',
  'app_opened',
  'appointment_scheduled',
  'checkout_started',
  'contents_viewed',
  'items_added',
  'lead_created',
  'order_created',
  'page_viewed',
  'registration_completed',
  'subscription_created',
  'trial_started',
] as const;
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
