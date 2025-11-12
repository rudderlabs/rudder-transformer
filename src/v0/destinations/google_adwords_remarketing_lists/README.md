# Google Ads Remarketing Lists (Customer Match) Destination

Implementation in **Javascript**

## Configuration

### Required Settings

- **Customer ID**: The Google Ads customer ID for the account

  - Format: Numeric string (e.g., "1234567890")
  - Hyphens are automatically removed during processing

- **RudderStack Account ID**: Required for authentication and tracking

### OAuth Settings

- **OAuth Provider**: Google
- **Required Scopes**: Google Ads API access with delivery permissions
- **Authentication Type**: OAuth 2.0

### Optional Settings

- **Sub Account**: Enable if using a manager account to access sub-accounts

  - When enabled, **Login Customer ID** becomes required
  - Login Customer ID: The manager account customer ID

- **List ID**: Target user list ID (required for cloud mode)

  - Can be provided via destination config or event properties

- **Audience ID**: Alternative parameter name for List ID

  - Used in VDM v2 flows and some configurations
  - Functionally equivalent to List ID

- **User Schema**: Defines which user identifiers to use

  - Options: `email`, `phone`, `addressInfo`
  - Default: `["email"]`

- **Type of List**: Specifies the list type

  - Options: `General`, `userID`, `mobileDeviceID`
  - Default: `General`

- **Hash Required**: Whether to hash user identifiers

  - Default: `true`
  - When enabled, email and phone numbers are SHA-256 hashed

- **User Data Consent**: Consent status for ad user data

  - Options: `UNSPECIFIED`, `UNKNOWN`, `GRANTED`, `DENIED`
  - Default: `UNSPECIFIED`

- **Personalization Consent**: Consent status for ad personalization
  - Options: `UNSPECIFIED`, `UNKNOWN`, `GRANTED`, `DENIED`
  - Default: `UNSPECIFIED`

## Integration Functionalities

> Google Ads Remarketing Lists supports **Cloud mode** only

### Supported Message Types

- **Audience List**: For managing user lists with add/remove operations
- **Record**: For VDM v2 (Warehouse) data synchronization

### Batching Support

- **Supported**: Yes
- **Message Types**: Both Audience List and Record events
- **Batch Limits**:
  - User identifiers: 20 per operation (automatically chunked)
  - Operations: Multiple operations per job, subject to API quotas
  - Total user identifiers: 100,000 per offline user data job
  - The destination automatically chunks user identifiers into groups of 20, with each chunk becoming a separate operation within the same job

### Rate Limits

The Google Ads API enforces the following limits for offline user data jobs:

| Operation Type               | Rate Limit          | Batch Limits                   | Description                                |
| ---------------------------- | ------------------- | ------------------------------ | ------------------------------------------ |
| Create Offline User Data Job | Standard API limits | -                              | Creates a new job for user list operations |
| Add Operations               | Standard API limits | 100,000 user identifiers total | Adds user data operations to a job         |
| Run Job                      | Standard API limits | -                              | Executes the job with all operations       |

**Important Notes:**

- Jobs may take 6+ hours to complete processing
- Daily API operation limits apply based on developer token access level
- Basic access: 15,000 API operations per day
- Each job creation, operation addition, and job execution counts as separate API operations
- Maximum 100,000 user identifiers per job
- Concurrent modification errors may occur with simultaneous updates

**Error Handling:**

- `CONCURRENT_MODIFICATION` errors are retried with 500 status
- Partial failure errors are handled gracefully
- Invalid user identifiers are logged and skipped

[Google Ads API Rate Limits Documentation](https://developers.google.com/google-ads/api/docs/best-practices/quotas)

### Intermediate Calls

- **Supported**: Yes
- **Use Case**: Three-step process for uploading user data to Customer Match lists

#### Offline User Data Job Flow

1. **Create Job**: `/customers/{customerId}/offlineUserDataJobs:create`

   - Creates a new offline user data job
   - Specifies the target user list and consent information

2. **Add Operations**: `/customers/{customerId}/offlineUserDataJobs/{jobId}:addOperations`

   - Adds user identifier operations (create/remove) to the job
   - Supports batching of operations

3. **Run Job**: `/customers/{customerId}/offlineUserDataJobs/{jobId}:run`
   - Executes the job to process all operations
   - Asynchronous operation that may take hours to complete

### Proxy Delivery

- **Supported**: Yes
- **Source Code Path**: `src/v0/destinations/google_adwords_remarketing_lists/networkHandler.js`
- **Implementation**: Custom proxy handler for the three-step offline user data job process

### User Deletion

- **Supported**: Yes (via remove operations)
- **Method**: Remove operations in offline user data jobs
- **Scope**: Individual users can be removed using their identifiers

### Additional Functionalities

#### User Identifier Types

- **Email Addresses**: Hashed email addresses (SHA-256)
- **Phone Numbers**: Hashed phone numbers (SHA-256)
- **Address Information**: First name, last name, country code, postal code
- **Third Party User IDs**: For userID type lists
- **Mobile Device IDs**: For mobileDeviceID type lists

#### Consent Management

- **User Data Consent**: Controls consent for ad user data usage
- **Personalization Consent**: Controls consent for ad personalization
- **Integration**: Supports OneTrust, Ketch, and custom consent providers

#### Data Hashing

- **Automatic Hashing**: Email and phone numbers are automatically SHA-256 hashed
- **Configurable**: Can be disabled via `isHashRequired` setting
- **Normalized**: Data is normalized before hashing (lowercase, trimmed)
- **Hash Algorithm**: SHA-256 with UTF-8 encoding

#### Validations

- **Customer ID**: Must be numeric, hyphens automatically removed
- **List ID**: Required for cloud mode operations
- **User Identifiers**: Must match configured user schema
- **Email Format**: Validated before hashing
- **Phone Format**: Normalized before hashing
- **Address Info**: Country code must be valid ISO format
- **Consent Values**: Must be one of the specified enum values

#### Data Processing

- **Chunking**: User identifiers automatically chunked into groups of 20 per operation
- **Deduplication**: Google Ads handles duplicate user identifiers
- **Normalization**: Email addresses converted to lowercase, phone numbers normalized
- **Error Handling**: Partial failures supported, invalid identifiers logged and skipped

## General Queries

### Event Ordering

#### Audience List Events

**Event ordering is NOT strictly required** for Customer Match user list operations. Google Ads Customer Match is designed to handle:

- **Add Operations**: Users are added to the list regardless of order
- **Remove Operations**: Users are removed from the list regardless of order
- **Duplicate Operations**: Google handles deduplication automatically

The destination processes operations in batches, and Google Ads applies the final state based on the most recent job execution.

#### Record Events (VDM v2)

**Event ordering is NOT strictly required** for record-based operations as they follow the same Customer Match principles.

### Data Replay Feasibility

#### Missing Data Replay

- **Feasible**: Yes, missing data can be replayed safely
- **Reason**: Customer Match operations are idempotent - adding existing users or removing non-existent users doesn't cause issues
- **Recommendation**: Safe to replay missing audience list or record events

#### Already Delivered Data Replay

- **Feasible**: Yes, with considerations
- **Add Operations**: Replaying add operations is safe as Google Ads handles duplicates
- **Remove Operations**: Replaying remove operations may unintentionally remove users that were re-added
- **Recommendation**: Generally safe for add operations, use caution with remove operations

### Multiplexing

- **Supported**: Yes (limited scenarios)
- **Description**: Single input events can generate multiple output API calls in specific cases

#### Multiplexing Scenarios

1. **Audience List Events**:

   - **Multiplexing**: YES (when both add and remove operations are present)
   - Single event with both add AND remove operations creates two separate offline user data jobs
   - Single event with only add OR only remove operations creates one offline user data job
   - Multiple operations of the same type within an event are batched into a single job

2. **Record Events**:
   - **Multiplexing**: NO
   - Each record event creates operations for a single offline user data job
   - Multiple records are batched together but represent one logical operation

## Version Information

### Current Version

- **Google Ads API Version**: v19
- **Endpoint Base**: `https://googleads.googleapis.com/v19/customers`

### Version Deprecation

- Google Ads API follows a regular deprecation cycle
- Typically maintains 3-4 versions simultaneously
- Older versions are deprecated approximately 12 months after new version release
- **Current Status**: v20 is the latest stable version (as of July 2025)
- **Upgrade Path**: When new versions are released, update the `API_VERSION` constant in `config.js`

### Breaking Changes

- **NEEDS REVIEW**: Specific breaking changes between API versions require investigation
- **Migration**: Version upgrades may require code changes for new field requirements
- **Testing**: Thoroughly test with new API versions before production deployment

## Documentation Links

### Google Ads API Documentation

- [Customer Match Overview](https://developers.google.com/google-ads/api/docs/remarketing/audience-segments/customer-match/get-started)
- [Manage Customer Lists](https://developers.google.com/google-ads/api/docs/remarketing/audience-segments/customer-match/manage)
- [Offline User Data Jobs](https://developers.google.com/google-ads/api/reference/rpc/v19/OfflineUserDataJobService)
- [API Rate Limits](https://developers.google.com/google-ads/api/docs/best-practices/quotas)

### RETL Functionality

For RETL (Real-time Extract, Transform, Load) functionality, please refer to [docs/retl.md](docs/retl.md)

### Business Logic and Mappings

For business logic and mappings information, please refer to [docs/businesslogic.md](docs/businesslogic.md)

## FAQ

### Why do jobs take so long to complete?

Google Ads offline user data jobs are processed asynchronously and may take 6+ hours to complete. This is a limitation of the Google Ads API, not the RudderStack integration. The job status can be monitored through the Google Ads API.

### Can I use the same list for multiple campaigns?

Yes, once a Customer Match list is created and populated, it can be used for targeting across multiple campaigns and ad groups within the same Google Ads account.

### What happens if I send duplicate user identifiers?

Google Ads automatically handles duplicate user identifiers. Sending the same user multiple times will not create duplicates in the list.

### How do I handle consent requirements?

Configure the `userDataConsent` and `personalizationConsent` settings according to your privacy compliance requirements. These settings are passed to Google Ads with each job.

### Why are some users not being added to the list?

Common reasons include:

- Invalid email format or phone number format
- Users not matching Google's Customer Match requirements
- Insufficient user data for matching
- Privacy settings preventing matching

### Can I remove all users from a list?

Yes, use the `remove_all` operation in an offline user data job. This operation must be the first operation in the job if other operations are included.
