# Facebook Conversions API - Business Logic

## Overview

This document provides detailed information about the business logic, data transformations, and implementation details for the Facebook Conversions API destination.

## Event Processing Flow

### 1. Event Type Determination

The destination processes events based on their type:

```javascript
switch (messageType) {
  case EventType.PAGE:
  case EventType.SCREEN:
    category = CONFIG_CATEGORIES.PAGE_VIEW;
    break;
  case EventType.TRACK:
    category = getCategoryFromEvent(mappedEvent || message.event.toLowerCase());
    break;
  default:
    throw new InstrumentationError(`Message type ${messageType} not supported`);
}
```

### 2. Event Category Mapping

Track events are mapped to specific categories based on event names:

#### Standard E-commerce Events

- `product list viewed` → `PRODUCT_LIST_VIEWED` → Facebook `ViewContent`
- `product viewed` → `PRODUCT_VIEWED` → Facebook `ViewContent`
- `product added` → `PRODUCT_ADDED` → Facebook `AddToCart`
- `order completed` → `ORDER_COMPLETED` → Facebook `Purchase`
- `products searched` → `PRODUCTS_SEARCHED` → Facebook `Search`
- `checkout started` → `CHECKOUT_STARTED` → Facebook `InitiateCheckout`
- `payment info entered` → `PAYMENT_INFO_ENTERED` → Facebook `AddPaymentInfo`
- `product added to wishlist` → `PRODUCT_ADDED_TO_WISHLIST` → Facebook `AddToWishlist`

#### Other Standard Events

Events like `Lead`, `CompleteRegistration`, `Contact`, etc., are mapped to `OTHER_STANDARD` category.

#### Custom Events

Events not matching standard patterns are treated as custom events using `SIMPLE_TRACK` category.

## Data Transformation Logic

### User Data Processing

#### 1. User Data Extraction

```javascript
const userData = fetchUserData(
  message,
  Config,
  MAPPING_CONFIG[CONFIG_CATEGORIES.USERDATA.name],
  DESTINATION.toLowerCase(),
);
```

#### 2. PII Data Handling

- **Hashing**: Most PII fields are automatically hashed using SHA-256
- **Normalization**: Email addresses are trimmed and lowercased before hashing
- **Name Splitting**: Full names are split into first and last names
- **External ID Removal**: Can be configured to remove external_id for privacy

#### 3. Facebook-specific Parameters

- **FBC Parameter**: Facebook click ID deduced from URL parameters or context
- **FBP Parameter**: Facebook browser ID from context or properties

### Custom Data Processing

#### 1. Property Extraction

```javascript
customData = extractCustomFields(
  message,
  customData,
  ['properties'],
  FB_CONVERSIONS_DEFAULT_EXCLUSION,
);
```

#### 2. Default Exclusions

The following properties are excluded from custom data:

- `opt_out`
- `event_id`
- `action_source`

#### 3. PII Transformation

```javascript
customData = transformedPayloadData(
  message,
  customData,
  blacklistPiiProperties,
  whitelistPiiProperties,
  integrationsObj,
);
```

#### 4. Category-specific Processing

Different event categories have specific custom data processing:

**E-commerce Events**:

- Product arrays are processed to extract `content_ids` and `contents`
- Content type and category are determined
- Number of items is calculated
- Currency and value are standardized

**Search Events**:

- Search query is included in custom data
- Content type validation is performed

## Event-Specific Logic

### Product List Viewed / Product Viewed

```javascript
const { contentIds, contents } = populateContentsAndContentIDs(products);
eventTypeCustomData = {
  ...eventTypeCustomData,
  content_ids: contentIds.length === 1 ? contentIds[0] : contentIds,
  contents,
  content_type: contentType,
  content_category: getContentCategory(contentCategory),
};
```

### Order Completed / Checkout Started

```javascript
const { contentIds, contents } = populateContentsAndContentIDs(
  products,
  message.properties?.quantity,
  message.properties?.delivery_category,
);

eventTypeCustomData = {
  ...eventTypeCustomData,
  content_ids: contentIds,
  contents,
  content_type: contentType,
  content_category: getContentCategory(contentCategory),
  num_items: contentIds.length,
};
```

### Products Searched

Special validation is performed for search events:

```javascript
validateProductSearchedData(eventTypeCustomData);
```

## Action Source Determination

The `action_source` is determined using the following logic:

1. **Explicit Configuration**: Use configured action source if provided
2. **Context-based Detection**:
   - `app` for mobile app contexts
   - `website` for web contexts
3. **Default Fallback**: `website` if no context is available

```javascript
const getActionSource = (commonData, actionSource) => {
  if (actionSource) return actionSource;

  // Auto-detection logic based on context
  if (isAppContext(commonData)) return 'app';
  return 'website';
};
```

## App Data Processing

For mobile app events (`action_source === 'app'), additional app data is included:

```javascript
const appData = constructPayload(
  message,
  MAPPING_CONFIG[CONFIG_CATEGORIES.APPDATA.name],
  DESTINATION.toLowerCase(),
);
```

App data includes:

- Extended device information (`extinfo`)
- App version
- SDK version
- Platform-specific identifiers

### Platform-specific Processing

```javascript
if (sourceSDK === 'android') {
  sourceSDK = 'a2';
} else if (isAppleFamily(sourceSDK)) {
  sourceSDK = 'i2';
} else {
  throw new InstrumentationError('Invalid device type');
}
```

## Data Processing Options (CCPA)

When `limitedDataUsage` is enabled:

```javascript
if (limitedDataUsage) {
  const dataProcessingOptions = get(message, 'context.dataProcessingOptions');
  if (dataProcessingOptions && Array.isArray(dataProcessingOptions)) {
    [
      commonData.data_processing_options,
      commonData.data_processing_options_country,
      commonData.data_processing_options_state,
    ] = dataProcessingOptions;
  }
}
```

Expected format: `["LDU", country_code, state_code]`

## Validation Logic

### Required Field Validation

1. **Message Type**: Must be present and supported
2. **Dataset ID**: Must be configured
3. **Access Token**: Must be configured
4. **Event Name**: Required for track events, must be string

### Event Duration Validation

```javascript
verifyEventDuration(message, destination, timeStamp);
```

This validation ensures events are within Facebook's acceptable time window.

### User Data Validation

At least one user identifier must be present:

- `external_id` (from userId or anonymousId)
- `em` (email)
- `ph` (phone)
- Other identifiers (fbc, fbp, etc.)

## Error Handling

### Configuration Errors

- Missing dataset ID or access token
- Invalid action source values
- Malformed event mapping configuration

### Data Validation Errors

- Missing required fields
- Invalid event duration
- Invalid device type for app events

### Network Errors

- API rate limiting
- Authentication failures
- Malformed requests

## Content Type and Category Logic

### Content Type Determination

```javascript
const contentType =
  message.properties?.content_type ||
  getContentType(
    message,
    eventTypeCustomData.content_type,
    categoryToContent,
    DESTINATION.toLowerCase(),
  );
```

### Category Mapping

The `categoryToContent` configuration allows mapping product categories to Facebook content types:

```javascript
// Example configuration
{
  "from": "electronics",
  "to": "product"
}
```

## Final Response Formation

```javascript
return formingFinalResponse(
  userData,
  commonData,
  customData,
  ENDPOINT(datasetId, accessToken),
  testDestination,
  testEventCode,
  appData,
);
```

The final response includes:

- **User Data**: Hashed PII and identifiers
- **Common Data**: Event metadata and action source
- **Custom Data**: Event-specific properties
- **App Data**: Mobile app specific data (if applicable)
- **Test Parameters**: Test destination and event code (if configured)

## Use Cases

### E-commerce Tracking

- Product catalog browsing
- Shopping cart interactions
- Purchase completion
- Wishlist management

### Lead Generation

- Form submissions
- Newsletter signups
- Contact requests
- Trial registrations

### Content Engagement

- Page views
- Content interactions
- Search activities
- Custom events

### Mobile App Analytics

- Screen views
- In-app purchases
- App-specific events
- Cross-platform tracking
