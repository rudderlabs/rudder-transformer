# Criteo Audience Business Logic

## Overview

This document outlines the business logic and implementation details of the Criteo Audience destination integration for managing audience segments.

## Event Processing

### Event Types

The Criteo Audience destination only supports the `audiencelist` event type. This event type is used to manage audience segment members in Criteo.

### Event Structure

```javascript
{
  type: 'audiencelist',
  properties: {
    listData: {
      add: [
        { email: 'user1@example.com' },
        { email: 'user2@example.com' }
      ],
      remove: [
        { email: 'user3@example.com' }
      ]
    }
  }
}
```

### Event Validation

1. **Required Fields**:

   - `type`: Must be 'audiencelist'
   - `properties`: Must be present
   - `properties.listData`: Must be present
   - `properties.listData.add` or `properties.listData.remove`: At least one must be present

2. **Identifier Validation**:
   - Each object in `add` or `remove` arrays must contain the identifier type specified in the configuration
   - For GUM identifier type, `gumCallerId` must be provided in the configuration

## Data Processing

### Batch Processing

1. **Chunking**:

   - Identifiers are automatically chunked into batches of 50,000
   - Each batch is processed as a separate request to the audience segment
   - Chunking is handled by the `populateIdentifiers` function

2. **Payload Structure**:
   ```javascript
   {
     data: {
       type: 'ContactlistAmendment',
       attributes: {
         operation: 'add' | 'remove',
         identifierType: 'email' | 'maid' | 'gum' | 'identityLink',
         internalIdentifiers: false,
         gumCallerId: 'your-gum-caller-id', // Only for GUM type
         identifiers: ['identifier1', 'identifier2', ...]
       }
     }
   }
   ```

### Identifier Types

The Criteo Audience destination supports the following identifier types for audience segment management:

1. **Email**:

   - Used for email-based audience segment targeting
   - Supports multiple formats:
     - Plain text email
     - MD5 hashed
     - SHA256 hashed
     - SHA256MD5 hashed
   - No additional configuration required
   - Example: `user@example.com`

2. **MAID (Mobile Advertising ID)**:

   - Used for mobile device-based audience segment targeting
   - Also known as 'madid' in Criteo's API
   - No additional configuration required
   - Example: `123e4567-e89b-12d3-a456-426614174000`

3. **GUM (Criteo Universal Match)**:

   - Used for cross-device audience segment targeting
   - Requires `gumCallerId` in configuration
   - Uses Criteo GUM cookie identifier
   - Example: `gum-identifier-value`

4. **IdentityLink**:
   - Used for custom identity-based audience segment targeting
   - Represents a user's LiveRamp Identity Link
   - No additional configuration required
   - Example: `custom-identifier-value`

> Note: While Criteo's API supports additional identifier types, this integration specifically supports the above four types for audience segment management.

#### Other Criteo-Supported Identifier Types

Criteo's API also supports the following identifier types that are not currently implemented in this integration:

1. **Customer ID**:

   - Used for Retail Media Customer Lists
   - Specific to Retail Media use cases
   - Example: `customer-identifier-value`

2. **Phone Number**:
   - Used for phone number-based targeting
   - Only supported for advertisers in India
   - Supports both plain text and SHA256 hashed formats
   - Example: `+1234567890`

For more information about Criteo's audience segment capabilities and identifier types, refer to the [official Criteo Audience Segments documentation](https://developers.criteo.com/marketing-solutions/docs/audience-segments).

## Error Handling

### Error Types

1. **Configuration Errors**:

   - Missing required configuration
   - Invalid audience type
   - Missing GUM caller ID for GUM audience type

2. **Validation Errors**:

   - Missing required fields
   - Invalid event type
   - Invalid identifier format

3. **API Errors**:
   - 401: Authentication errors
   - 404: Invalid audience ID
   - 429: Rate limiting
   - 500/503: Server errors

### Retry Logic

1. **Retryable Errors**:

   - 429: Rate limiting
   - 500: Internal server error
   - 503: Service unavailable

2. **Retry Strategy**:
   - Maximum 3 retries
   - Exponential backoff with jitter
   - Retry delay increases with each attempt

## Performance Considerations

### Batch Size

- Maximum 50,000 identifiers per batch
- Automatic chunking for larger datasets
- Parallel processing of chunks

### Rate Limiting

- Automatic handling of rate limits
- Exponential backoff for retries
- Request throttling based on response headers

### Memory Usage

- Efficient chunking to manage memory usage
- Streaming of large datasets
- Cleanup of processed data

## Security

### Authentication

- OAuth2 Bearer token authentication
- Token refresh mechanism
- Secure token storage

### Data Privacy

- No PII data storage
- Secure transmission of identifiers
- Compliance with data protection regulations

## Monitoring and Logging

### Metrics

- Request success/failure rates
- Batch processing statistics
- Rate limit hits
- Retry attempts

### Logging

- Request/response logging
- Error logging with context
- Performance metrics logging
- Debug logging for troubleshooting

## Testing

### Unit Tests

- Event validation
- Payload construction
- Error handling
- Retry logic

### Integration Tests

- End-to-end flow testing
- Error scenario testing
- Performance testing
- Rate limit handling

## Future Considerations

### Planned Improvements

1. **Performance**:

   - Optimize batch processing
   - Implement caching
   - Improve retry strategy

2. **Features**:

   - Support for additional identifier types
   - Enhanced error reporting
   - Improved monitoring

3. **Security**:
   - Enhanced token management
   - Additional security measures
   - Compliance updates
