# Google Ads Offline Conversions - Business Logic and Mappings

## Overview

The Google Ads Offline Conversions destination transforms RudderStack Track events into Google Ads offline conversion uploads. The destination supports three types of conversions: **Click Conversions**, **Call Conversions**, and **Store Conversions**, each with distinct business logic and API endpoints.

## Event Processing Flow

### 1. Event Validation and Configuration

```javascript
// Event validation
if (!message.type) {
  throw new InstrumentationError('Message type is not present. Aborting message.');
}

if (messageType !== EventType.TRACK) {
  throw new InstrumentationError(`Message type ${messageType} not supported`);
}

// Configuration validation
if (!Config.customerId) {
  throw new ConfigurationError('Customer ID not found. Aborting');
}
```

### 2. Conversion Type Determination

The destination determines the conversion type based on the event mapping configuration:

```javascript
// Event name mapping to conversion types
const conversionTypes = Array.from(eventsToOfflineConversionsTypeMapping[event]);
// Supported types: 'click', 'call', 'store'

// Event name mapping to Google Ads conversion action names
const conversionActionName = eventsToConversionsNamesMapping[event];
```

### 3. Conversion Processing by Type

Each conversion type follows a different processing flow:

#### Click Conversions Flow

1. **Payload Construction**: Uses `TrackClickConversionsConfig.json` mapping
2. **User Identifier Processing**: Handles email, phone, and address data
3. **Click ID Validation**: Processes GCLID, WBRAID, or GBRAID
4. **Custom Variables**: Maps event properties to Google Ads custom variables
5. **API Call**: Single call to `:uploadClickConversions`

#### Call Conversions Flow

1. **Payload Construction**: Uses `TrackCallConversionsConfig.json` mapping
2. **Call Data Validation**: Requires caller ID and call start time
3. **API Call**: Single call to `:uploadCallConversions`

#### Store Conversions Flow

1. **Job Creation**: Uses `TrackCreateJobStoreConversionsConfig.json`
2. **Operation Addition**: Uses `TrackAddStoreConversionsConfig.json`
3. **User Identifier Processing**: Handles email, phone, and address data
4. **Job Execution**: Three-step API process

## Mappings

### Click Conversions Mapping

| RudderStack Field                                                                             | Google Ads Field                                         | Required | Type     | Notes                                          |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------- | -------- | -------- | ---------------------------------------------- |
| `properties.gclid`                                                                            | `conversions[0].gclid`                                   | No       | String   | Google Click ID                                |
| `properties.wbraid`                                                                           | `conversions[0].wbraid`                                  | No       | String   | Web conversion ID                              |
| `properties.gbraid`                                                                           | `conversions[0].gbraid`                                  | No       | String   | App conversion ID                              |
| `timestamp` / `originalTimestamp`                                                             | `conversions[0].conversionDateTime`                      | Yes      | DateTime | Converted to Google format                     |
| `properties.conversionValue` / `properties.total` / `properties.value` / `properties.revenue` | `conversions[0].conversionValue`                         | No       | Number   | Conversion value                               |
| `properties.currencyCode` / `properties.currency`                                             | `conversions[0].currencyCode`                            | No       | String   | Currency code                                  |
| `properties.orderId` / `properties.order_id`                                                  | `conversions[0].orderId`                                 | No       | String   | Order identifier                               |
| `properties.userIdentifierSource`                                                             | `conversions[0].userIdentifiers[0].userIdentifierSource` | No       | Enum     | UNSPECIFIED, UNKNOWN, FIRST_PARTY, THIRD_PARTY |
| `properties.conversionEnvironment`                                                            | `conversions[0].conversionEnvironment`                   | No       | Enum     | UNSPECIFIED, UNKNOWN, APP, WEB                 |

#### Cart Data Mapping (E-commerce)

| RudderStack Field                                                | Google Ads Field                               | Required | Type    | Notes                  |
| ---------------------------------------------------------------- | ---------------------------------------------- | -------- | ------- | ---------------------- |
| `properties.merchantId`                                          | `conversions[0].cartData.merchantId`           | No       | Integer | Merchant Center ID     |
| `properties.feedCountryCode`                                     | `conversions[0].cartData.feedCountryCode`      | No       | String  | Feed country           |
| `properties.feedLanguageCode`                                    | `conversions[0].cartData.feedLanguageCode`     | No       | String  | Feed language          |
| `properties.localTransactionCost`                                | `conversions[0].cartData.localTransactionCost` | No       | Number  | Local transaction cost |
| `properties.products[].product_id` / `properties.products[].sku` | `conversions[0].cartData.items[].productId`    | No       | String  | Product identifier     |
| `properties.products[].quantity`                                 | `conversions[0].cartData.items[].quantity`     | No       | Integer | Product quantity       |
| `properties.products[].price`                                    | `conversions[0].cartData.items[].unitPrice`    | No       | Number  | Product price          |

### Call Conversions Mapping

| RudderStack Field                                                                             | Google Ads Field                    | Required | Type     | Notes               |
| --------------------------------------------------------------------------------------------- | ----------------------------------- | -------- | -------- | ------------------- |
| `properties.callerId`                                                                         | `conversions[0].callerId`           | Yes      | String   | Caller phone number |
| `properties.callStartDateTime`                                                                | `conversions[0].callStartDateTime`  | Yes      | DateTime | Call start time     |
| `timestamp` / `originalTimestamp`                                                             | `conversions[0].conversionDateTime` | Yes      | DateTime | Conversion time     |
| `properties.conversionValue` / `properties.total` / `properties.value` / `properties.revenue` | `conversions[0].conversionValue`    | No       | Number   | Conversion value    |
| `properties.currencyCode` / `properties.currency`                                             | `conversions[0].currencyCode`       | No       | String   | Currency code       |

### Store Conversions Mapping

#### Job Creation Mapping

| RudderStack Field                            | Google Ads Field                                     | Required | Type    | Default | Notes                    |
| -------------------------------------------- | ---------------------------------------------------- | -------- | ------- | ------- | ------------------------ |
| `properties.loyaltyFraction`                 | `job.storeSalesMetadata.loyaltyFraction`             | No       | String  | "1"     | Loyalty program fraction |
| `properties.transaction_upload_fraction`     | `job.storeSalesMetadata.transaction_upload_fraction` | No       | String  | "1"     | Upload fraction          |
| `properties.custom_key`                      | `job.storeSalesMetadata.custom_key`                  | No       | String  | -       | Custom metadata key      |
| `properties.enable_match_rate_range_preview` | `enable_match_rate_range_preview`                    | No       | Boolean | -       | Match rate preview       |

#### Transaction Data Mapping

| RudderStack Field                                                                             | Google Ads Field                                                     | Required | Type     | Notes                             |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | -------- | -------- | --------------------------------- |
| `properties.store_code` / `properties.storeCode`                                              | `operations.create.transaction_attribute.store_attribute.store_code` | No       | String   | Store identifier                  |
| `properties.conversionValue` / `properties.total` / `properties.value` / `properties.revenue` | `operations.create.transaction_attribute.transaction_amount_micros`  | Yes      | Number   | Converted to micros (\*1,000,000) |
| `properties.order_id` / `properties.orderId`                                                  | `operations.create.transaction_attribute.order_id`                   | No       | String   | Order identifier                  |
| `properties.currency`                                                                         | `operations.create.transaction_attribute.currency_code`              | Yes      | String   | Currency code                     |
| `timestamp` / `originalTimestamp`                                                             | `operations.create.transaction_attribute.transaction_date_time`      | Yes      | DateTime | Transaction time                  |

#### Address Data Mapping

| RudderStack Field                                   | Google Ads Field                     | Required | Type   | Hashed | Notes                    |
| --------------------------------------------------- | ------------------------------------ | -------- | ------ | ------ | ------------------------ |
| `traits.city` / `properties.city`                   | `address_info.city`                  | No       | String | No     | City name                |
| `traits.state` / `properties.state`                 | `address_info.state`                 | No       | String | No     | State/province           |
| `traits.country_code` / `properties.country_code`   | `address_info.country_code`          | No       | String | No     | Country code             |
| `traits.postal_code` / `properties.postal_code`     | `address_info.postal_code`           | No       | String | No     | Postal/ZIP code          |
| `traits.firstName` / `properties.firstName`         | `address_info.hashed_first_name`     | No       | String | Yes    | First name (SHA-256)     |
| `traits.lastName` / `properties.lastName`           | `address_info.hashed_last_name`      | No       | String | Yes    | Last name (SHA-256)      |
| `traits.streetAddress` / `properties.streetAddress` | `address_info.hashed_street_address` | No       | String | Yes    | Street address (SHA-256) |

## User Identifier Processing

### Identifier Types

The destination supports three types of user identifiers:

1. **Email**: Hashed using SHA-256 (if `hashUserIdentifier` is true)
2. **Phone**: Hashed using SHA-256 (if `hashUserIdentifier` is true)
3. **Address**: Combination of address fields (some hashed, some not)

### Identifier Selection Logic

```javascript
// Priority order for user identifiers
const userIdentifierInfo = {
  email: hashUserIdentifier && isString(email) ? sha256(email.trim()).toString() : email,
  phone: hashUserIdentifier && isDefinedAndNotNull(phone) ? sha256(phone.trim()).toString() : phone,
  address: buildAndGetAddress(message, hashUserIdentifier),
};

// Use default identifier if available, otherwise use any available identifier
if (isDefinedAndNotNull(userIdentifierInfo[defaultUserIdentifier])) {
  // Use default identifier
} else {
  const keyName = getExistingUserIdentifier(userIdentifierInfo, defaultUserIdentifier);
  // Use alternative identifier
}
```

### Click ID Priority

For click conversions, the destination follows this priority:

1. **GCLID** (highest priority) - removes WBRAID and GBRAID
2. **WBRAID or GBRAID** - removes user identifiers (mutually exclusive)
3. **User Identifiers** - used when no click IDs are available

## Validations

### Required Fields by Conversion Type

#### Click Conversions

- **Required**: `conversionDateTime` (timestamp)
- **Conditional**: Either click ID (GCLID/WBRAID/GBRAID) OR user identifier (email/phone)

#### Call Conversions

- **Required**: `callerId`, `callStartDateTime`, `conversionDateTime`

#### Store Conversions

- **Required**: `transaction_amount_micros`, `currency_code`, `transaction_date_time`

### Data Type Validations

| Field Type | Validation                 | Example                    |
| ---------- | -------------------------- | -------------------------- |
| DateTime   | ISO 8601 format            | `2019-10-14T11:15:18.299Z` |
| Number     | Positive numeric value     | `123.45`                   |
| Integer    | Whole number               | `5`                        |
| Currency   | 3-letter ISO code          | `USD`                      |
| Email      | Valid email format         | `user@example.com`         |
| Phone      | E.164 format (for hashing) | `+1234567890`              |

### Business Rule Validations

1. **Mutual Exclusivity**: Cannot use both WBRAID and GBRAID
2. **User Identifier Requirement**: Must provide email or phone when no click IDs are available
3. **Currency Validation**: Must be valid ISO currency code
4. **Amount Validation**: Must be positive number for store conversions
5. **Timestamp Format**: Must be valid ISO 8601 datetime

## Error Handling

### Common Error Scenarios

1. **Missing Conversion Action**: Event name not mapped to Google Ads conversion action
2. **Invalid User Identifiers**: Missing email/phone when no click IDs provided
3. **Invalid Click IDs**: Using both WBRAID and GBRAID simultaneously
4. **Missing Required Fields**: Required fields not provided for specific conversion type
5. **Authentication Errors**: Invalid OAuth tokens or insufficient permissions

### Error Response Handling

The destination uses partial failure handling for batch operations:

```javascript
// Partial failure must be enabled for conversion uploads
payload.partialFailure = true;

// Error handling in response
if (response.partialFailureError && response.partialFailureError.code !== 0) {
  throw new NetworkError(`partialFailureError - ${response.partialFailureError.message}`);
}
```

## Use Cases

### 1. E-commerce Click Conversions

**Scenario**: Track online purchases that originated from Google Ads clicks

- **Data**: GCLID, order value, currency, product details
- **Flow**: Click conversion with cart data
- **Attribution**: Direct click attribution

### 2. Lead Generation with Enhanced Conversions

**Scenario**: Track form submissions with user data for improved attribution

- **Data**: Email, phone, conversion value, timestamp
- **Flow**: Click conversion with user identifiers
- **Attribution**: Enhanced conversion matching

### 3. Phone Call Conversions

**Scenario**: Track phone calls generated from Google Ads

- **Data**: Caller ID, call start time, conversion time, call value
- **Flow**: Call conversion upload
- **Attribution**: Call tracking attribution

### 4. Offline Store Sales

**Scenario**: Track in-store purchases from customers who clicked ads

- **Data**: Customer email/phone, transaction amount, store code, transaction time
- **Flow**: Store conversion with offline user data job
- **Attribution**: Cross-device attribution matching

### 5. Multi-Channel Attribution

**Scenario**: Track conversions across multiple touchpoints

- **Data**: External attribution model, attribution credit, conversion data
- **Flow**: Click conversion with external attribution data
- **Attribution**: Custom attribution modeling

## Custom Variables

Custom variables allow passing additional conversion data to Google Ads:

### Configuration

1. **Google Ads Setup**: Create custom conversion variables in Google Ads UI
2. **RudderStack Mapping**: Map event properties to custom variable names
3. **API Lookup**: Destination fetches custom variable resource names via SearchStream API

### Implementation

```javascript
// Custom variable mapping in destination config
customVariables: [
  { from: 'campaign_id', to: 'campaign_identifier' },
  { from: 'product_category', to: 'category' },
];

// Runtime processing
const customVariableValue = properties[customVariableKey];
const customVariableResourceName = conversionCustomVariable[customVariableName];

resultantCustomVariables.push({
  conversionCustomVariable: customVariableResourceName,
  value: String(customVariableValue),
});
```

### Limitations

- **Click/Call Only**: Custom variables not supported for store conversions
- **Pre-configuration**: Variables must exist in Google Ads before use
- **String Values**: All custom variable values converted to strings
