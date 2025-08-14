/**
 * Postscript Destination Configuration
 *
 * This file contains configuration constants and types for the Postscript destination.
 * Postscript is an SMS marketing platform that allows businesses to send SMS messages
 * to their customers for marketing and engagement purposes.
 */

// API Configuration
export const BASE_ENDPOINT = 'https://api.postscript.io/api/v2';
export const SUBSCRIBERS_ENDPOINT = `${BASE_ENDPOINT}/subscribers`;
export const CUSTOM_EVENTS_ENDPOINT = `${BASE_ENDPOINT}/events`;

// Configuration for field mappings
export const MAPPING_CONFIG = {
  SUBSCRIBER: { name: 'postscriptSubscriberConfig' },
};

// Supported external ID types for Postscript
export const EXTERNAL_ID_TYPES = {
  SUBSCRIBER_ID: 'subscriber_id',
  EXTERNAL_ID: 'external_id',
  SHOPIFY_CUSTOMER_ID: 'shopify_customer_id',
};

// Destination name constant
export const DESTINATION_NAME = 'POSTSCRIPT';
