/**
 * Configuration for Survicate integration
 * Contains API endpoints and configuration constants
 */

// Survicate API base URL
const BASE_URL = 'https://integrations.survicate.com';

// API endpoints for different event types
const contentType = 'application/json';

const ENDPOINT_CONFIG = {
  IDENTIFY: {
    url: `${BASE_URL}/endpoint/rudder-stack/identify`,
    method: 'POST',
    contentType
  },
  GROUP: {
    url: `${BASE_URL}/endpoint/rudder-stack/group`,
    method: 'POST',
    contentType
  },
  TRACK: {
    url: `${BASE_URL}/endpoint/rudder-stack/track`,
    method: 'POST',
    contentType
  },
} as const;

// Destination type for logging and error tracking
const DEST_TYPE = 'SURVICATE';

// Headers configuration
const HEADERS_CONFIG = {
  CONTENT_TYPE: contentType
} as const;

export { BASE_URL, ENDPOINT_CONFIG, DEST_TYPE, HEADERS_CONFIG };
