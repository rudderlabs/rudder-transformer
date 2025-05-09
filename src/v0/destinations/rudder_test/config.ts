/**
 * Configuration constants for the rudder_test destination
 * This is a minimal implementation designed for testing platform features
 */

// Destination name constant
export const DESTINATION = 'RUDDER_TEST';

// API endpoint for the destination
export const ENDPOINT = 'https://rudder-platform.example.com/api';

// Config schema for the destination
export const CONFIG_SCHEMA = {
  enableBatching: {
    displayName: 'Enable Batching',
    type: 'boolean',
    required: false,
    defaultValue: 'false',
    help: 'Enable batching of events in router transformation',
  },
  testField: {
    displayName: 'Test Field',
    type: 'string',
    required: false,
    defaultValue: 'default-value',
    help: 'Test field for general configuration testing',
  },
};
