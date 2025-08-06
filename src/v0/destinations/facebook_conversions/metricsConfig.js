// Facebook Conversions API - Metrics Allowlist Configuration
// Based on the Facebook Conversions Parameter Guide

const ALLOWED_FACEBOOK_EVENTS = [
  'ViewContent',
  'AddToCart',
  'Purchase',
  'Search',
  'InitiateCheckout',
  'AddPaymentInfo',
  'AddToWishlist',
  'PageView',
];

// Standard events that should be tracked individually
const STANDARD_EVENTS = [...ALLOWED_FACEBOOK_EVENTS];
const OTHER_EVENT = 'OTHER_EVENT';

// Allowlisted properties by category (based on ROI impact from parameter guide)
const ALLOWED_PROPERTIES = {
  // User Data Parameters (high impact on match rates)
  USER_DATA: [
    'external_id', // Primary identifier (required)
    'em', // Email (+15-25% match rate)
    'ph', // Phone (+10-20% match rate)
    'fn', // First name (+5-10% match rate)
    'ln', // Last name (+5-10% match rate)
    'fbc', // Facebook Click ID (perfect attribution)
    'fbp', // Facebook Browser ID (cross-session)
    'client_ip_address', // Geo-targeting
    'client_user_agent', // Device optimization
    'ge', // Gender (enhanced targeting)
    'db', // Date of birth (age targeting)
    'ct', // City (geographic targeting)
    'st', // State (regional optimization)
    'zp', // Zip code (hyper-local targeting)
    'country', // Country (international optimization)
  ],

  // Event Parameters (core tracking)
  EVENT_DATA: [
    'event_name', // Required for optimization
    'event_time', // Required for attribution
    'event_source_url', // Page-level insights
    'event_id', // Prevents double-counting
    'action_source', // Source-specific optimization
  ],

  // Custom Data Parameters (optimization critical)
  CUSTOM_DATA: [
    'content_ids', // Product-level optimization
    'value', // ROAS optimization critical
    'currency', // Multi-currency businesses
    'content_type', // Content optimization
    'content_category', // Category targeting
    'content_name', // Named product tracking
    'num_items', // Basket size optimization
    'search_string', // Search intent targeting
    'contents', // Rich product data
  ],

  // Mobile App Parameters (mobile optimization)
  APP_DATA: [
    'advertiser_tracking_enabled', // iOS 14.5+ compliance
    'application_tracking_enabled', // App store optimization
    'extinfo', // Comprehensive device data
  ],

  // Data Processing & Compliance
  COMPLIANCE: [
    'data_processing_options', // CCPA compliance
    'data_processing_options_country', // Geographic compliance
    'data_processing_options_state', // State-level compliance
    'opt_out', // Privacy compliance
  ],
};

// Event to Facebook event mapping
const EVENT_MAPPING = {
  'Product Viewed': 'ViewContent',
  'Product List Viewed': 'ViewContent',
  'Product Added': 'AddToCart',
  'Order Completed': 'Purchase',
  'Products Searched': 'Search',
  'Checkout Started': 'InitiateCheckout',
  'Payment Info Entered': 'AddPaymentInfo',
  'Product Added to Wishlist': 'AddToWishlist',
  Page: 'PageView',
  Screen: 'PageView',
};

// Flatten all allowed properties
const ALL_ALLOWED_PROPERTIES = [
  ...ALLOWED_PROPERTIES.USER_DATA,
  ...ALLOWED_PROPERTIES.EVENT_DATA,
  ...ALLOWED_PROPERTIES.CUSTOM_DATA,
  ...ALLOWED_PROPERTIES.APP_DATA,
  ...ALLOWED_PROPERTIES.COMPLIANCE,
];

module.exports = {
  ALLOWED_FACEBOOK_EVENTS,
  STANDARD_EVENTS,
  OTHER_EVENT,
  ALLOWED_PROPERTIES,
  ALL_ALLOWED_PROPERTIES,
  EVENT_MAPPING,
};
