// Keys that must not be overwritten by incoming traits; filterTraits strips these from any trait map.
export const RESERVED_KEYS = [
  'user_id',
  'userId',
  'group_id',
  'groupId',
  'timestamp',
  'originalTimestamp',
  'message_id',
  'messageId',
  'event',       // track event name
  'properties',  // track properties bag
  'context',     // enriched context block set explicitly after trait merge
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
    url: 'https://hv.survicate.com/integrations/partners/rudder-stack/group',
    method: 'POST',
    contentType,
  },
  TRACK: {
    url: 'https://hv.survicate.com/integrations/partners/rudder-stack/track',
    method: 'POST',
    contentType,
  },
} as const;

export { ENDPOINT_CONFIG };
