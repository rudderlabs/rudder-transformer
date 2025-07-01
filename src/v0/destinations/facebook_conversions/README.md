# Facebook Conversions API Destination

Implementation in **JavaScript**

## Configuration

### Required Settings

- **Dataset ID**: The unique identifier for your Facebook dataset
  - Format: Numeric string (e.g., `1234567898765`)
  - Obtained from the Facebook Dataset creation page in Events Manager
  - Used to construct the API endpoint for sending events
  - **Important**: Your dataset ID will be the same as your existing pixel ID if an existing pixel is connected to the dataset

- **Access Token**: System user access token for authentication
  - Must have appropriate permissions for the Conversions API
  - Required for all API requests to Facebook
  - Should be kept secure and rotated regularly

### Optional Settings

- **Action Source**: Specifies where the conversion event occurred
  - Available values: `email`, `website`, `app`, `phone_call`, `chat`, `physical_store`, `system_generated`, `other`
  - Default: Determined automatically based on event context
  - Used for attribution and optimization

- **Limited Data Usage**: Enable for California Consumer Privacy Act (CCPA) compliance
  - When enabled, adds data processing options to requests
  - Helps comply with privacy regulations

- **Remove External ID**: Option to exclude external_id from user data
  - When enabled, removes external_id from the payload
  - Useful for privacy compliance scenarios

- **Test Destination**: Enable test mode for debugging
  - When enabled, events are sent to Facebook's test environment
  - Requires a test event code for validation

- **Test Event Code**: Code for test event validation
  - Required when test destination is enabled
  - Obtained from Facebook Events Manager

### PII Data Handling

- **Blacklist PII Properties**: Properties to exclude or hash
  - Configure which PII fields should be removed or hashed
  - Supports custom hashing options

- **Whitelist PII Properties**: Properties to explicitly include
  - Override blacklist settings for specific fields
  - Ensures important data is preserved

### Event Mapping

- **Events to Events**: Custom event name mapping
  - Map RudderStack event names to Facebook standard events
  - Supports dynamic configuration via UI
  - Example: Map "Product Searched" to "Search"

- **Category to Content**: Product category mapping
  - Map product categories to Facebook content types
  - Used for e-commerce event optimization
  - Example: Map "electronics" to "product"

### Event Filtering

- **Event Filtering Option**: Control which events are sent
  - **Disabled**: Send all events (default)
  - **Allowlist**: Only send specified events
  - **Denylist**: Send all events except specified ones

- **Allowlisted Events**: Events to include when allowlist filtering is enabled
- **Denylisted Events**: Events to exclude when denylist filtering is enabled

### Consent Management

- **Consent Management Providers**: Support for multiple consent management platforms
  - **OneTrust**: Integration with OneTrust consent platform
  - **Ketch**: Integration with Ketch consent platform
  - **iubenda**: Integration with iubenda consent platform
  - **Custom**: Custom consent management implementation

- **Resolution Strategy**: Logic for handling multiple consent requirements
  - **AND**: All specified consents must be granted
  - **OR**: Any of the specified consents must be granted

- **Consent Categories**: Configure specific consent category IDs for each provider

## Integration Functionalities

> Facebook Conversions API supports **Cloud mode** only

### Supported Message Types

- **Track**: Custom events and standard e-commerce events
- **Page**: Page view events (mapped to Facebook PageView)
- **Screen**: Screen view events (mapped to Facebook PageView)

### Batching Support

- **Supported**: No true batching, but concurrent processing is available
- **Implementation**: Uses RudderStack's concurrent processing (`simpleProcessRouterDest`)
- **Processing Method**: Events are processed concurrently for better performance, but each event results in a separate API call
- **Note**: While Facebook Graph API supports batch requests (limited to 50 requests per batch), the current RudderStack implementation does not utilize this batching capability
- **Individual Request Limits**: Each request is limited to ~1MB payload size

### API Endpoints

| Endpoint | Event Types | Description |
|----------|-------------|-------------|
| `/v22.0/{dataset_id}/events` | Track, Page, Screen | Primary endpoint for sending conversion events |

### Standard Event Mapping

The destination automatically maps RudderStack e-commerce events to Facebook standard events:

| RudderStack Event | Facebook Event | Description |
|-------------------|----------------|-------------|
| `Product List Viewed` | `ViewContent` | User viewed a product catalog or list |
| `Product Viewed` | `ViewContent` | User viewed a specific product |
| `Product Added` | `AddToCart` | User added product to cart |
| `Order Completed` | `Purchase` | User completed a purchase |
| `Products Searched` | `Search` | User searched for products |
| `Checkout Started` | `InitiateCheckout` | User started checkout process |
| `Payment Info Entered` | `AddPaymentInfo` | User entered payment information |
| `Product Added to Wishlist` | `AddToWishlist` | User added product to wishlist |

### Additional Standard Events

The following Facebook standard events are also supported:
- `Lead`
- `CompleteRegistration`
- `Contact`
- `CustomizeProduct`
- `Donate`
- `FindLocation`
- `Schedule`
- `StartTrial`
- `SubmitApplication`
- `Subscribe`

### User Data Mapping

The destination maps RudderStack user properties to Facebook user data fields:

| RudderStack Field | Facebook Field | Hashed | Description |
|-------------------|----------------|---------|-------------|
| `userId` | `external_id` | Yes | Primary user identifier |
| `traits.email` | `em` | Yes | Email address |
| `traits.phone` | `ph` | Yes | Phone number |
| `traits.firstName` | `fn` | Yes | First name |
| `traits.lastName` | `ln` | Yes | Last name |
| `traits.gender` | `ge` | No | Gender (m/f) |
| `traits.birthday` | `db` | Yes | Date of birth |
| `traits.address.city` | `ct` | Yes | City |
| `traits.address.state` | `st` | Yes | State |
| `traits.address.zip` | `zp` | Yes | ZIP/Postal code |
| `traits.address.country` | `country` | Yes | Country |
| `context.ip` | `client_ip_address` | No | IP address |
| `context.userAgent` | `client_user_agent` | No | User agent |
| `context.fbc` | `fbc` | No | Facebook click ID |
| `context.fbp` | `fbp` | No | Facebook browser ID |

## Additional Functionalities

### Data Processing Options (CCPA Compliance)

When `limitedDataUsage` is enabled, the destination automatically includes data processing options from the event context:

```javascript
// Example context for CCPA compliance
{
  "context": {
    "dataProcessingOptions": ["LDU", 1, 1000]
  }
}
```

### App Data Support

For mobile app events (when `action_source` is `app`), the destination includes additional app-specific data:
- App version
- Device information
- SDK version

### Custom Data Handling

- **Custom Properties**: All event properties not in the exclusion list are included as custom data
- **Default Exclusions**: `opt_out`, `event_id`, `action_source` are excluded by default
- **Currency Handling**: Automatically sets USD as default currency if not specified
- **Value Mapping**: Maps `revenue` property to `value` for Facebook optimization

## Validations

### Required Fields

- **Dataset ID**: Must be provided in destination configuration
- **Access Token**: Must be provided in destination configuration
- **Event Name**: Required for track events and must be a string

### Event Duration Validation

- Events must be within Facebook's acceptable time window
- Future events are rejected
- Very old events may be rejected (specific limits depend on Facebook's policies)

### User Data Validation

- At least one user identifier is required (external_id, email, phone, etc.)
- PII data is automatically hashed using SHA-256
- Email addresses are normalized (trimmed and lowercased) before hashing

## Rate Limits

Based on Facebook's official documentation:

- **Conversions API**: No specific rate limits for the Conversions API
- **Graph API Limits**: General Graph API rate limits do not apply to Conversions API calls
- **Marketing API Separation**: Conversions API calls are separate from Marketing API rate limits
- **Request Size**: Individual requests limited to ~1MB payload size
- **Best Practices**:
  - Implement exponential backoff for error handling
  - Monitor response headers for any rate limit information
  - Use concurrent processing for better throughput

## Event Ordering and Replayability

### Event Ordering

- **Required**: No specific ordering requirements
- **Recommendation**: Send events in chronological order when possible
- **Impact**: Out-of-order events may affect attribution accuracy

### Event Replayability

- **Supported**: Yes, events can be replayed
- **Deduplication**: Facebook handles deduplication using event_id and event_time
- **Best Practice**: Include unique event_id for each event to prevent duplicates
- **Considerations**: Replaying events may affect attribution and optimization

## Multiplexing

- **Multiplexing**: NO
- **Single Event Output**: Each input event generates exactly one output event
- **No Intermediary Calls**: All API calls are final destination calls
- **Event Transformation**: Events are transformed but not multiplied

## Version Information

### Current Version

- **Facebook Graph API**: v23.0 (Latest)
- **Implementation**: JavaScript (v0) - **NEEDS UPDATE**
- **Current Implementation Uses**: v22.0 (Outdated)
- **v23.0 Release Date**: May 29, 2025
- **Deprecation**: Facebook typically maintains API versions for 2+ years

### Version Update Required

**⚠️ IMPORTANT**: The current implementation uses v22.0, but v23.0 is now available and should be updated.

### Version Features (v23.0)

- Latest privacy controls and compliance features
- Enhanced attribution modeling
- Updated data processing options
- Improved debugging and monitoring capabilities
- Performance optimizations

**Recommendation**: Update the implementation to use v23.0 for latest features and long-term support.

## Documentation Links

### Facebook API Documentation

- [Facebook Conversions API Overview](https://developers.facebook.com/docs/marketing-api/conversions-api/)
- [Graph API v23.0 Documentation](https://developers.facebook.com/docs/graph-api/)
- [Server Events API](https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api/)
- [Data Processing Options](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/data-processing-options/)
- [Graph API Changelog](https://developers.facebook.com/docs/graph-api/changelog/)
- [Rate Limiting Information](https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api/)

### RudderStack Documentation

- [Facebook Conversions API Destination](https://www.rudderstack.com/docs/destinations/streaming-destinations/facebook-conversions-api/)
- [Event Specification](https://www.rudderstack.com/docs/event-spec/)

## RETL Functionality

**RETL Support**: Not Available

This destination does not support RETL (Real-time Extract, Transform, Load) functionality as it does not handle `record` event types. For warehouse-to-Facebook data flows, consider:

1. **Alternative Approaches**: Use Facebook's bulk import capabilities
2. **Custom ETL**: Implement custom processes using Facebook's APIs
3. **Real-time Streaming**: Use standard cloud mode for real-time data

## Known Issues and Recommendations

### API Version Update Required

**Current Status**: The implementation uses Facebook Graph API v22.0, but v23.0 is now available (released May 29, 2025).

**Impact**:
- Missing latest features and improvements
- Potential future compatibility issues
- Not using the most current API capabilities

**Recommendation**: Update the implementation to use v23.0 for:
- Latest privacy and compliance features
- Enhanced performance optimizations
- Long-term API support

**Files to Update**:
- `src/v0/destinations/facebook_conversions/config.js` - Update ENDPOINT URL
- Test files and documentation references

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - **Cause**: Invalid or expired access token
   - **Solution**: Regenerate access token with proper permissions

2. **Dataset ID Errors**
   - **Cause**: Incorrect or missing dataset ID
   - **Solution**: Verify dataset ID from Facebook Events Manager

3. **Event Validation Errors**
   - **Cause**: Missing required fields or invalid data format
   - **Solution**: Ensure proper event structure and required user identifiers

4. **Rate Limiting**
   - **Cause**: Exceeding Facebook's API limits
   - **Solution**: Implement exponential backoff and reduce request frequency

5. **Test Events Not Appearing**
   - **Cause**: Missing test event code or test destination not enabled
   - **Solution**: Enable test destination and provide valid test event code

### Debugging Tips

- **Enable Test Mode**: Use test destination for debugging without affecting live data
- **Check Event Quality**: Monitor Facebook's event quality score in Events Manager
- **Validate User Matching**: Ensure sufficient user identifiers for Facebook matching
- **Monitor Logs**: Check RudderStack logs for transformation errors

### Performance Optimization

- **Use Concurrent Processing**: RudderStack processes events concurrently for better throughput
- **Optimize User Data**: Include multiple user identifiers for better matching
- **Event Deduplication**: Use unique event IDs to prevent duplicates
- **Monitor Attribution**: Track conversion attribution in Facebook Ads Manager

## Business Logic

For detailed information about event processing logic, data transformations, and implementation details, see [Business Logic Documentation](docs/businesslogic.md).
