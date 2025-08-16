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
    'name', // Full name (fallback identification)
    'ge', // Gender (enhanced targeting)
    'db', // Date of birth (age targeting)
    'fbc', // Facebook Click ID (perfect attribution)
    'fbp', // Facebook Browser ID (cross-session)
    'client_ip_address', // Geo-targeting
    'client_user_agent', // Device optimization
    'ct', // City (geographic targeting)
    'st', // State (regional optimization)
    'zp', // Zip code (hyper-local targeting)
    'country', // Country (international optimization)
    // Advanced Identifiers
    'subscription_id', // Subscription lifecycle tracking
    'lead_id', // Lead quality optimization
    'fb_login_id', // Facebook login ID (enhanced matching)
    'madid', // Mobile Advertising ID (mobile attribution)
    'anon_id', // Anonymous ID tracking
    'page_id', // Page-specific tracking
    'page_scoped_user_id', // Messenger bot tracking
    'ctwa_clid', // Click to WhatsApp ID
    'ig_account_id', // Instagram Account ID
    'ig_sid', // Click to Instagram ID
  ],

  // Event Parameters (core tracking)
  EVENT_DATA: [
    'event_name', // Required for optimization
    'event_time', // Required for attribution
    'event_source_url', // Page-level insights
    'event_id', // Prevents double-counting
    'action_source', // Source-specific optimization
    'opt_out', // Privacy compliance
    'referrer_url', // Traffic source analysis
    'customer_segmentation', // Customer lifecycle optimization
  ],

  // Custom Data Parameters (optimization critical)
  CUSTOM_DATA: [
    'content_ids', // Product-level optimization
    'value', // ROAS optimization critical
    'currency', // Multi-currency businesses
    'content_type', // Content optimization
    'content_category', // Category targeting
    'content_name', // Named product tracking
    'contents', // Rich product data
    'num_items', // Basket size optimization
    'search_string', // Search intent targeting
    // Purchase-Specific Parameters
    'order_id', // Order tracking
    'delivery_category', // Delivery optimization
    // Travel & Hospitality Parameters
    'checkin_date', // Hotel check-in date
    'num_adults', // Number of adults
    'num_children', // Number of children
    'destination_airport', // Destination airport
    'travel_class', // Travel class
    // Automotive Parameters
    'make', // Vehicle make
    'model', // Vehicle model
    'year', // Vehicle year
    'body_style', // Vehicle body style
    'fuel_type', // Fuel type
    // Real Estate Parameters
    'property_type', // Property type
    'listing_type', // Listing type
    'preferred_beds_range', // Bedroom range
    'preferred_price_range', // Price range
  ],

  // Mobile App Parameters (mobile optimization)
  APP_DATA: [
    'advertiser_tracking_enabled', // iOS 14.5+ compliance
    'application_tracking_enabled', // App store optimization
    'extinfo', // Comprehensive device data
    // Attribution Parameters
    'campaign_ids', // Cross-campaign attribution
    'install_referrer', // Install source tracking
    'installer_package', // Distribution channel insights
    'url_schemes', // Deep link optimization
    'windows_attribution_id', // Windows app attribution
    'vendor_id', // Vendor identification
  ],

  // Data Processing & Compliance
  COMPLIANCE: [
    'data_processing_options', // CCPA compliance
    'data_processing_options_country', // Geographic compliance
    'data_processing_options_state', // State-level compliance
    // Original Event Data Parameters
    'original_event_name', // Delayed attribution
    'original_event_time', // Timeline reconstruction
    'original_order_id', // Order attribution
    'original_event_id', // Event attribution
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
