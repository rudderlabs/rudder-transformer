// Destination type for logging and error tracking
const DEST_TYPE = 'SURVICATE';

export const RESERVED_KEYS = [
  'user_id',
  'userId',
  'group_id',
  'groupId',
  'timestamp',
  'originalTimestamp',
  'message_id',
  'messageId',
];

// API endpoints for different event types
const contentType = 'application/json';

// ENDPOINT_CONFIG
const ENDPOINT_CONFIG = {
  IDENTIFY: {
    url: 'https://hv.survicate.com/integrations/partners/rudder-stack/identify',
    method: 'POST',
    contentType,
  },
  GROUP: {
    url: 'https://hv.survicate.com/integrations/partners/rudderstack/group',
    method: 'POST',
    contentType,
  },
  TRACK: {
    url: 'https://hv.survicate.com/integrations/partners/rudderstack/track',
    method: 'POST',
    contentType,
  },
  CHECK: {
    url: 'https://hv.survicate.com/integrations/partners/rudderstack/check',
    method: 'POST',
    contentType,
  },
} as const;

// Headers configuration
const HEADERS_CONFIG = {
  CONTENT_TYPE: contentType,
} as const;

export { ENDPOINT_CONFIG, DEST_TYPE, HEADERS_CONFIG };
