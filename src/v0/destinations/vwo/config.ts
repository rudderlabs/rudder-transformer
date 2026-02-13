/**
 * VWO Destination Configuration
 * 
 * API endpoints for different regions and configuration constants
 */

const BASE_URL = 'https://dev.visualwebsiteoptimizer.com';

const API_ENDPOINTS = {
  DEFAULT: `${BASE_URL}/events/t`,
  EU: `${BASE_URL}/eu01/events/t`,
  AS: `${BASE_URL}/as01/events/t`,
} as const;

const DESTINATION_NAME = 'VWO';

// Supported event types for VWO offline conversions
const SUPPORTED_EVENT_TYPES = ['track'] as const;

export {
  API_ENDPOINTS,
  DESTINATION_NAME,
  SUPPORTED_EVENT_TYPES,
};

