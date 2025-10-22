# Google Ads Offline Conversions Destination

Implementation in **JavaScript**

> **Note**: This destination is currently in **Beta** status

## Configuration

### Required Settings

- **Customer ID**: Required Google Ads customer ID for the account
  - Must be the Google Ads conversion customer that owns the conversion actions
  - Format: Numeric ID (hyphens will be automatically removed)
  - **Validation**: Maximum 100 characters, supports environment variables and template syntax
  - **Pattern**: `(^\\{\\{.*\\|\\|(.*)\\}\\}$)|(^env[.].+)|^(.{1,100})$`

### Optional Settings

- **Sub Account**: Enable if using a manager account structure
  - **Type**: Boolean (default: false)
- **Login Customer ID**: Required when Sub Account is enabled
  - Must be the manager account ID that has access to the customer account
  - **Validation**: Maximum 100 characters, supports environment variables and template syntax
- **Events to Offline Conversions Type Mapping**: Maps event names to conversion types
  - **Supported conversion types**: `click`, `call`, `store`
  - **Validation**: Event names limited to 100 characters each
  - **Format**: Array of objects with `from` (event name) and `to` (conversion type) properties
- **Events to Conversions Names Mapping**: Maps event names to Google Ads conversion action names
  - **Validation**: Both event names and conversion action names limited to 100 characters each
  - **Format**: Array of objects with `from` (event name) and `to` (conversion action name) properties
- **Custom Variables**: Maps event properties to Google Ads custom conversion variables
  - **Validation**: Property names and variable names limited to 100 characters each
  - **Format**: Array of objects with `from` (property name) and `to` (custom variable name) properties
  - **Limitation**: Only supported for click and call conversions
- **User Identifier Source**: Specifies the source of user identifiers
  - **Options**: `none` (default), `UNSPECIFIED`, `UNKNOWN`, `FIRST_PARTY`, `THIRD_PARTY`
- **Conversion Environment**: Specifies the conversion environment
  - **Options**: `none` (default), `UNSPECIFIED`, `UNKNOWN`, `APP`, `WEB`
- **Default User Identifier**: Default identifier type when multiple are available
  - **Options**: `email`, `phone`
- **Hash User Identifier**: Enable to hash user identifiers using SHA-256 (default: true)
- **Validate Only**: Enable to validate requests without importing conversions (default: false)

## Integration Functionalities

> Google Ads Offline Conversions supports **Cloud mode** only

### Supported Message Types

- Track

### Batching Support

- **Supported**: Yes (Store conversions only)
- **Message Types**: Track events mapped to store conversions
- **Batch Limits**: Multiple store conversion operations are batched into a single offline user data job

### Rate Limits

The Google Ads API enforces rate limits using a Token Bucket algorithm with variable QPS (Queries Per Second) limits that depend on overall system load and account-specific factors.

| Endpoint                                         | Conversion Types                         | Rate Limiting                                    | Batch Limits                                                                                                                                                       | Description                                                  |
| ------------------------------------------------ | ---------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| `/customers/{customerId}:uploadClickConversions` | Click conversions                        | Variable QPS per customer ID and developer token | [2,000 conversions per request](https://developers.google.com/google-ads/api/docs/best-practices/quotas) but we have not implemented batching for call conversions | Used for uploading click-based offline conversions           |
| `/customers/{customerId}:uploadCallConversions`  | Call conversions                         | Variable QPS per customer ID and developer token | [2,000 conversions per request](https://developers.google.com/google-ads/api/docs/best-practices/quotas) but we have not implemented batching for call conversions | Used for uploading call-based offline conversions            |
| `/customers/{customerId}/offlineUserDataJobs`    | Store conversions                        | Variable QPS per customer ID and developer token | Multiple operations per job                                                                                                                                        | Used for store sales conversions via offline user data jobs  |
| `/customers/{customerId}/googleAds:searchStream` | All types (for conversion action lookup) | Variable QPS per customer ID and developer token | -                                                                                                                                                                  | Used for fetching conversion action IDs and custom variables |

#### Rate Limiting Details

- **Algorithm**: Token Bucket algorithm meters requests to determine appropriate QPS limits
- **Scope**: Rate limiting is applied per client customer ID (CID) and developer token combination
- **Dynamic Limits**: Actual QPS limits vary based on total server load and are not fixed values
- **Error Response**: Rate limit violations result in `RESOURCE_TEMPORARILY_EXHAUSTED` errors

#### Best Practices for Rate Limiting

- Implement exponential backoff when receiving rate limit errors
- Distribute requests across time rather than sending bursts
- Consider client-side throttling to stay within limits
- Monitor error rates and adjust request frequency accordingly

[Docs Reference](https://developers.google.com/google-ads/api/docs/productionize/rate-limits)

### Intermediate Calls

#### Conversion Action ID Lookup

- **Supported**: Yes
- **Use Case**: Fetching conversion action resource names using conversion action names
- **Endpoint**: `/customers/{customerId}/googleAds:searchStream`
- **Caching**: Results are cached for 24 hours (configurable via `CONVERSION_ACTION_ID_CACHE_TTL`)

```javascript
// The query used to fetch conversion action ID:
const queryString =
  'SELECT conversion_action.id FROM conversion_action WHERE conversion_action.name = ?';
```

#### Custom Variables Lookup (Click/Call Conversions)

- **Supported**: Yes
- **Use Case**: Fetching custom conversion variable resource names for click and call conversions
- **Endpoint**: `/customers/{customerId}/googleAds:searchStream`
- **Caching**: Results are cached for 24 hours (configurable via `CONVERSION_CUSTOM_VARIABLE_CACHE_TTL`)

```javascript
// The query used to fetch custom variables:
const query = 'SELECT conversion_custom_variable.name FROM conversion_custom_variable';
```

#### Store Conversions Multi-Step Process

- **Supported**: Yes
- **Use Case**: Store conversions require a three-step process
- **Steps**:
  1. **Create Job**: `POST /customers/{customerId}/offlineUserDataJobs:create`
  2. **Add Operations**: `POST /customers/{customerId}/offlineUserDataJobs/{jobId}:addOperations`
  3. **Run Job**: `POST /customers/{customerId}/offlineUserDataJobs/{jobId}:run`

> No intermediate calls are made for simple click and call conversions (without custom variables)

### Proxy Delivery

- **Supported**: Yes
- **Source Code Path**: `src/v0/destinations/google_adwords_offline_conversions/networkHandler.js`

### User Deletion

- **Supported**: No
- Google Ads Offline Conversions API does not provide user deletion capabilities

### OAuth Support

- **Supported**: Yes
- **Provider**: Google
- **Required Scopes**: Google Ads API access
- **Authentication**: OAuth 2.0 with Google

### Additional Functionalities

#### Three Conversion Types

The destination supports three types of offline conversions:

1. **Click Conversions**: Track conversions from ad clicks

   - Supports enhanced conversions with user identifiers (email, phone, address)
   - Supports GCLID, WBRAID, and GBRAID for attribution
   - Can include custom variables and cart data

2. **Call Conversions**: Track conversions from ad-driven phone calls

   - Requires call tracking setup in Google Ads
   - Supports conversion date/time and value

3. **Store Conversions**: Track offline store sales
   - Uses offline user data jobs for batch processing
   - Supports user identifier matching (email, phone, address)
   - Includes transaction details and store metadata

#### User Identifier Hashing

- **Supported**: Yes
- **Configuration**: Controlled by `hashUserIdentifier` setting (default: true)
- **Algorithm**: SHA-256
- **Hashed Fields**: Email addresses, phone numbers, first names, last names, street addresses
- **Non-Hashed Fields**: Country, state, city, zip code
- **Normalization**: Data is normalized before hashing (lowercase, trimmed, E.164 for phone numbers)

<augment_code_snippet path="src/v0/destinations/google_adwords_offline_conversions/utils.js" mode="EXCERPT">

```javascript
const userIdentifierInfo = {
  email:
    hashUserIdentifier && isString(email) && isDefinedAndNotNull(email)
      ? sha256(email.trim()).toString()
      : email,
  phone:
    hashUserIdentifier && isDefinedAndNotNull(phone) && isString(phone)
      ? sha256(phone.trim()).toString()
      : phone,
  address: buildAndGetAddress(message, hashUserIdentifier),
};
```

</augment_code_snippet>

#### Enhanced Conversions Support

- **Supported**: Yes (Click conversions)
- **User Data**: Email, phone, address information
- **Privacy**: Automatic SHA-256 hashing of sensitive data
- **Matching**: Improves conversion attribution accuracy

#### Custom Variables

- **Supported**: Yes (Click and call conversions only)
- **Configuration**: Must be pre-configured in Google Ads UI
- **Mapping**: Event properties mapped to Google Ads custom conversion variables
- **Limitation**: Not supported for store conversions

#### Consent Management

- **Supported**: Yes
- **Integration**: Uses RudderStack's consent management framework
- **Consent Types**:
  - `adPersonalization` → `ad_personalization`
  - `adUserData` → `ad_user_data`
- **Configuration**: Can be set at event level via integrations object

#### Validations

The destination enforces several validation rules:

- **Event Name Mapping**: Event names must be mapped to both conversion types and conversion action names
- **User Identifiers**: Either click ID (GCLID/WBRAID/GBRAID) or user identifier (email/phone) required for click conversions
- **Mutual Exclusivity**: Cannot use both WBRAID and GBRAID in the same conversion
- **Required Fields**: Each conversion type has specific required fields (see business logic documentation)
- **Data Types**: Strict validation of data types (numbers, dates, currencies)
- **Customer ID**: Must be valid Google Ads customer ID with access to conversion actions

## General Queries

### Event Ordering

#### Track Events (All Conversion Types)

Event ordering is **required** for Google Ads Offline Conversions. Here's why:

- **Conversion Attribution**: Google Ads uses timestamps to determine the correct attribution window
- **Duplicate Prevention**: Out-of-order events can lead to incorrect conversion counting
- **Bidding Optimization**: Machine learning models rely on accurate temporal data

The destination includes timestamp handling:

- Uses `originalTimestamp` or `timestamp` from the event
- Converts to Google Ads format: `yyyy-mm-dd hh:mm:ss+|-hh:mm`
- Example: `2019-10-14T11:15:18.299Z` → `2019-10-14 16:10:29+0530`

> Google Ads Offline Conversions requires strict event ordering for accurate attribution and reporting.

### Data Replay Feasibility

#### Missing Data Replay

- **Not Recommended**: Due to event ordering requirements
- **Risk**: May cause attribution issues if replayed events are processed out of chronological order
- **Alternative**: Use Google Ads' conversion import features for historical data

#### Already Delivered Data Replay

- **Not Feasible**: Google Ads treats each conversion upload as unique
- **Duplication Risk**: Replaying data will create duplicate conversions
- **Impact**: Will inflate conversion metrics and affect campaign performance

According to Google Ads documentation: "Each conversion upload is treated as a separate event, so duplicate uploads will result in duplicate conversions in your account."

### Multiplexing

- **Supported**: Yes (Store conversions only)
- **Description**: The destination can generate multiple API calls from a single input event for store conversions.

#### Multiplexing Scenarios

1. **Store Conversions**:

   - **Multiplexing**: YES
   - **API Calls**:
     - First: `POST /offlineUserDataJobs:create` - Creates the offline user data job
     - Second: `POST /offlineUserDataJobs/{jobId}:addOperations` - Adds conversion data
     - Third: `POST /offlineUserDataJobs/{jobId}:run` - Executes the job
   - **Note**: This is true multiplexing as all three calls are required to complete a single store conversion upload.

2. **Click Conversions with Intermediate Calls**:

   - **Multiplexing**: NO
   - **API Calls**:
     - First: `/googleAds:searchStream` - Fetches conversion action ID (intermediary call)
     - Second: `:uploadClickConversions` - Uploads the conversion (primary call)
   - **Note**: This is not multiplexing as the first call is only for data lookup before the main upload.

3. **Call Conversions**:

   - **Multiplexing**: NO
   - **API Calls**: Single call to `:uploadCallConversions`
   - **Note**: No multiplexing involved.

4. **Click Conversions with Custom Variables**:
   - **Multiplexing**: NO
   - **API Calls**:
     - First: `/googleAds:searchStream` - Fetches custom variable mappings (intermediary call)
     - Second: `:uploadClickConversions` - Uploads conversion with custom variables (primary call)
   - **Note**: This is not multiplexing as the first call is only for configuration lookup.

## Version Information

### Current Version

- **Google Ads API Version**: v19 (in use by this destination)
- **Endpoint Base**: `https://googleads.googleapis.com/v19/customers/{customerId}`
- **Latest Available Version**: v20 (released June 2025)

### Version Deprecation

Google Ads API follows a regular deprecation schedule based on the 2025 release schedule:

- **v19**: Current version used by this destination, will be deprecated in **February 2026**
- **v20**: Latest version (released June 2025), supported until **June 2026**
- **v21**: Planned release October/November 2025, supported until **October 2026**
- **Support period**: Each version is supported for approximately 12 months
- **Deprecation notice**: 6 months advance notice before deprecation

### Available Versions

Google Ads API maintains multiple versions simultaneously. The destination currently uses v19 but v20 is available with additional features. Check the [Google Ads API versioning documentation](https://developers.google.com/google-ads/api/docs/concepts/versioning) and [2025 release schedule](http://ads-developers.googleblog.com/2024/11/google-ads-api-2025-release-and-sunset.html) for the latest version information and migration guides.

## Documentation Links

### Google Ads API Documentation

- [Google Ads API Overview](https://developers.google.com/google-ads/api/docs/start)
- [Offline Conversions Management](https://developers.google.com/google-ads/api/docs/conversions/upload-offline)
- [Click Conversions Upload (v19 - current)](https://developers.google.com/google-ads/api/rest/reference/rest/v19/customers/uploadClickConversions)
- [Call Conversions Upload (v19 - current)](https://developers.google.com/google-ads/api/rest/reference/rest/v19/customers/uploadCallConversions)
- [Click Conversions Upload (v20 - latest)](https://developers.google.com/google-ads/api/rest/reference/rest/v20/customers/uploadClickConversions)
- [Call Conversions Upload (v20 - latest)](https://developers.google.com/google-ads/api/rest/reference/rest/v20/customers/uploadCallConversions)
- [Store Sales Conversions](https://developers.google.com/google-ads/api/docs/conversions/upload-store-sales-transactions)
- [Rate Limits and Quotas](https://developers.google.com/google-ads/api/docs/productionize/rate-limits)
- [API Versioning and Migration](https://developers.google.com/google-ads/api/docs/concepts/versioning)
- [2025 Release Schedule](http://ads-developers.googleblog.com/2024/11/google-ads-api-2025-release-and-sunset.html)

## Troubleshooting

### Common Issues

#### Configuration Errors

- **Customer ID not found**: Ensure the `customerId` is configured and valid
- **Login Customer ID required**: When `subAccount` is enabled, `loginCustomerId` must be provided
- **Conversion action not found**: Verify conversion action names match between RudderStack and Google Ads

#### Authentication Errors

- **OAuth token expired**: Refresh OAuth credentials in RudderStack dashboard
- **Insufficient permissions**: Ensure Google Ads account has proper API access and conversion permissions
- **Developer token issues**: Verify developer token is valid and has appropriate access level

#### Data Validation Errors

- **Missing user identifiers**: Provide either click ID (GCLID/WBRAID/GBRAID) or user identifier (email/phone)
- **Invalid conversion type mapping**: Check event name mappings in destination configuration
- **Timestamp format errors**: Ensure timestamps are in valid ISO 8601 format

#### Rate Limiting

- **RESOURCE_TEMPORARILY_EXHAUSTED**: Implement exponential backoff and reduce request frequency
- **QPS exceeded**: Distribute requests across time or implement client-side throttling

### Business Logic and Mappings

For business logic and mappings information, please refer to [docs/businesslogic.md](docs/businesslogic.md)
