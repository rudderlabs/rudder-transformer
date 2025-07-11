# Facebook Custom Audience Destination

Implementation in **Javascript**

> **Note**: This destination is implemented using the legacy JavaScript transformer architecture, not CDK v2. The implementation is located in `src/v0/destinations/fb_custom_audience/` rather than `src/cdk/`.

## Configuration

### Required Settings

- **Access Token**: Required for authentication with Facebook Graph API
  - Must have appropriate permissions for Custom Audience operations
  - Should have `ads_read` and `ads_management` permissions for reading and managing custom audiences

### Optional Settings

- **App Secret**: Used for enhanced security with app secret proof generation

  - When provided, generates `appsecret_proof` parameter for additional security
  - Follows Facebook's security recommendations for server-to-server API calls

- **Max User Count**: Maximum number of users to process in a single batch

  - Default: 10,000 users (Facebook's maximum limit)
  - Used for chunking large audience lists

- **User Schema**: Defines the user data fields to be sent to Facebook

  - Available fields: `EMAIL`, `PHONE`, `GEN`, `MADID`, `EXTERN_ID`, `DOBY`, `DOBM`, `DOBD`, `LN`, `FN`, `FI`, `CT`, `ST`, `ZIP`, `COUNTRY`, `LOOKALIKE_VALUE`
  - Default: `["EMAIL"]`
  - Multiple fields can be selected for better matching rates

- **Is Hash Required**: Controls whether user data should be hashed

  - Default: `true`
  - When enabled, most fields (except `MADID` and `EXTERN_ID`) are SHA-256 hashed
  - Required for compliance with Facebook's data handling requirements

- **Is Raw**: Controls whether to send raw (unhashed) data

  - Default: `false`
  - When enabled, data is sent without hashing (use with caution)

- **Disable Format**: Controls whether to apply Facebook's formatting rules

  - Default: `false`
  - When enabled, skips data normalization and formatting

- **Type**: Specifies the audience type for data source classification

  - Available values: `UNKNOWN`, `FILE_IMPORTED`, `EVENT_BASED`, `SEED_BASED`, `THIRD_PARTY_IMPORTED`, `COPY_PASTE`, `CONTACT_IMPORTER`, `HOUSEHOLD_AUDIENCE`
  - Default: `NA`

- **Sub Type**: Specifies the audience sub-type for data source classification

  - Available values: Multiple options including `ANYTHING`, `NOTHING`, `HASHES`, `USER_IDS`, `EXTERNAL_IDS`, etc.
  - Default: `NA`

- **Audience ID**: Required for event stream mode

  - The Facebook Custom Audience ID where users will be added/removed
  - Must be provided when using cloud connection mode

- **Ad Account ID**: Required for RETL mode
  - The Facebook Ad Account ID for warehouse-based audience management
  - Must be provided when using warehouse connection mode

## Integration Functionalities

> Facebook Custom Audience supports **Cloud mode** only

### Supported Message Types

- **Audience List**: For audience management
- **Record**: For RETL (Reverse ETL) audience management

### Batching Support

- **Supported**: Yes
- **Message Types**: Both Audience List and Record events
- **Batch Limits**:
  - User count: 10,000 users per batch (Facebook's maximum limit)
  - Payload size: 60,000 bytes per request (empirically determined limit)
  - When payload exceeds size limit, automatic chunking is applied

### Rate Limits

**NEEDS REVIEW**: Facebook's official documentation for Custom Audience API rate limits is not publicly accessible. Based on general Facebook Graph API patterns:

| Endpoint               | Event Types           | Estimated Rate Limit | Batch Limits           | Description                                          |
| ---------------------- | --------------------- | -------------------- | ---------------------- | ---------------------------------------------------- |
| `/{audience-id}/users` | Audience List, Record | **NEEDS REVIEW**     | 10,000 users per batch | Used for adding/removing users from custom audiences |

**Note**: Facebook implements dynamic rate limiting based on various factors including:

- App usage patterns
- Historical API call volume
- Account standing
- Time of day and overall platform load

#### Monitoring Rate Limits

Facebook API responses may include rate limiting headers, though specific header names for Custom Audience API need verification.

#### Handling Rate Limit Errors

The destination implements retry logic through the Facebook utilities network handler to handle rate limit errors (HTTP 429 responses).

[Docs Reference](https://developers.facebook.com/docs/graph-api/overview/rate-limiting/)

### Intermediate Calls

- **Supported**: No
- **Description**: Facebook Custom Audience destination does not make intermediate API calls. All operations are direct calls to the Custom Audience users endpoint.

### Proxy Delivery

- **Supported**: Yes
- **Source Code Path**: `src/v0/destinations/fb_custom_audience/networkHandler.js`
- **Implementation**: Uses shared Facebook utilities network handler for consistent error handling and response processing

### User Deletion

- **Supported**: No
- **Description**: Facebook Custom Audience destination does not implement a dedicated user deletion API. User removal from audiences is handled through the standard audience management operations (remove operation in audience list events).

### OAuth Support

- **Supported**: No
- **Authentication**: Uses access token-based authentication

### Destination Type

- **Type**: Router destination
- **Configuration**: `transformAtV1: "router"` in db-config.json

### Partial Batching Response Handling

- **Supported**: No
- **Implementation**: Facebook Custom Audience destination does not support partial batch response handling. All records in a batch are treated as a single unit - either all succeed or all fail based on the overall API response.

### Additional Functionalities

#### Data Formatting and Validation

- **Automatic Data Normalization**: When `disableFormat` is false, applies Facebook-specific formatting rules:
  - **EMAIL**: Converted to lowercase and trimmed
  - **PHONE**: Removes non-numeric characters and leading zeros
  - **GEN**: Normalizes to 'f' or 'm' format
  - **Names (LN, FN, FI)**: Removes special characters and converts to lowercase
  - **Geographic fields (CT, ST, ZIP, COUNTRY)**: Standardized formatting
  - **Dates (DOBY, DOBM, DOBD)**: Proper date formatting with zero-padding

#### Hashing

- **SHA-256 Hashing**: Applied to most fields when `isHashRequired` is true
- **Exceptions**: `MADID` and `EXTERN_ID` are never hashed
- **Special Handling**: `LOOKALIKE_VALUE` for value-based audiences is not hashed

#### Value-Based Custom Audiences

- **Supported**: Yes
- **Special Field**: `LOOKALIKE_VALUE` for value-based audience targeting
- **Validation**: Ensures `LOOKALIKE_VALUE` is present for value-based audiences
- **Data Type**: Numeric values (defaults to 0 if invalid)

#### App Secret Proof

- **Security Enhancement**: When app secret is provided, generates `appsecret_proof` parameter
- **Implementation**: HMAC SHA-256 hash of access token and timestamp
- **Purpose**: Enhanced security for server-to-server API calls

### Validations

#### Configuration Validations

- **Access Token**: Required field, must be valid Facebook access token with appropriate permissions
- **Audience ID**: Required for event stream mode (cloud connection)
- **Ad Account ID**: Required for RETL mode (warehouse connection)
- **User Schema**: Must be a subset of supported schema fields
- **Value-Based Audiences**: Must include `LOOKALIKE_VALUE` field when `isValueBasedAudience` is enabled

#### Data Validations

- **Message Type**: Only `audiencelist` and `record` message types are supported
- **Schema Field Support**: All configured schema fields must be in the supported list
- **Field Format Validation**: Each field type has specific format requirements (see business logic documentation)
- **Batch Size Limits**: User count cannot exceed 10,000 per batch, payload size cannot exceed 60KB
- **Null Data Handling**: Tracks and reports users with all null field values

#### Runtime Validations

- **Empty Payload Detection**: Throws error if no valid users are present after processing
- **Value-Based Audience Requirements**: Enforces `LOOKALIKE_VALUE` presence for value-based audiences
- **Field Mapping Validation**: For RETL flows, validates that `context.destinationFields` is present

### Error Handling

The destination implements comprehensive error handling for various failure scenarios:

#### Abortable Error Codes

The following Facebook API error codes are configured as abortable (will not be retried):

- **Code 200**: Permissions error
- **Code 100**: Invalid parameter or general API error
- **Code 2650**: Custom audience related error
- **Code 368**: Temporarily blocked for policies violations
- **Code 105**: Unsupported get request
- **Code 294**: Permission denied
- **Code 190**: Invalid OAuth access token

#### Common Error Scenarios

- **Authentication Errors**: Invalid or expired access tokens
- **Permission Errors**: Insufficient permissions for audience operations
- **Audience Errors**: Invalid audience ID or audience not found
- **Data Format Errors**: Invalid user data that cannot be processed
- **Rate Limit Errors**: Too many requests (handled with retry logic)
- **Value-Based Audience Errors**: Missing `LOOKALIKE_VALUE` for value-based audiences

## General Queries

### Event Ordering

#### Audience List Events

- **Required**: No
- **Reasoning**: Facebook Custom Audience operations are idempotent. Adding the same user multiple times or removing a user that doesn't exist doesn't cause issues. The final state of the audience is what matters, not the order of operations.

#### Record Events (RETL)

- **Required**: No
- **Reasoning**: Similar to audience list events, RETL operations for audience management are idempotent. The destination processes insert, update, and delete actions, but the order doesn't affect the final audience composition.

### Data Replay Feasibility

#### Missing Data Replay

- **Feasible**: Yes
- **Reasoning**: Since event ordering is not required, missing data can be replayed without issues. Facebook Custom Audience operations are idempotent, so replaying missing add/remove operations will result in the correct final audience state.

#### Already Delivered Data Replay

- **Feasible**: Yes
- **Reasoning**: Facebook Custom Audience operations are idempotent. Re-adding users who are already in the audience or re-removing users who are already removed will not cause duplicates or errors. The API handles these scenarios gracefully.

### Multiplexing

- **Supported**: No
- **Description**: The Facebook Custom Audience destination does not multiplex events. Each input event generates exactly one output API call to the Facebook Custom Audience users endpoint.

#### Event Processing Scenarios

1. **Audience List Events**:

   - **Multiplexing**: NO
   - Single API Call: `POST/DELETE /{audience-id}/users` - To add or remove users from the audience
   - **Note**: Each audience list event results in one API call per batch (due to batching limits)

2. **Record Events (RETL)**:
   - **Multiplexing**: NO
   - Single API Call: `POST/DELETE /{audience-id}/users` - Based on the record action (insert/update = add, delete = remove)
   - **Note**: Multiple records may be batched into single API calls, but each record doesn't generate multiple calls

## Version Information

### Current Version

- **API Version**: v22.0
- **Endpoint**: `https://graph.facebook.com/v22.0/{audience-id}/users`
- **Implementation**: Hardcoded in `config.js`

### Version Support Policy

**NEEDS REVIEW**: Facebook's specific version support policy for Graph API needs verification. Based on general industry patterns:

- Facebook typically supports API versions for approximately 2 years
- New versions are released quarterly
- Deprecation notices are usually provided well in advance

### Version Deprecation

**NEEDS REVIEW**: Current deprecation timeline for v22.0 needs verification from official Facebook documentation.

### Upgrade Considerations

**NEEDS REVIEW**: Breaking changes between v22.0 and newer versions need to be documented when upgrading.

## Documentation Links

### Facebook API Documentation

**NEEDS REVIEW**: Official Facebook documentation links are currently inaccessible. The following links should be verified:

- [Facebook Custom Audience API](https://developers.facebook.com/docs/marketing-api/reference/custom-audience/)
- [Custom Audience Users Endpoint](https://developers.facebook.com/docs/marketing-api/reference/custom-audience/users/)
- [Facebook Graph API Rate Limiting](https://developers.facebook.com/docs/graph-api/overview/rate-limiting/)
- [Marketing API Versioning](https://developers.facebook.com/docs/marketing-api/overview/versioning/)

### RETL Functionality

For RETL (Real-time Extract, Transform, Load) functionality, please refer to [docs/retl.md](docs/retl.md)

### Business Logic and Mappings

For business logic and mappings information, please refer to [docs/businesslogic.md](docs/businesslogic.md)
