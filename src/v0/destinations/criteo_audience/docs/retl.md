# Criteo Audience RETL Documentation

## Overview

This document outlines the Real-time Event Transformation Layer (RETL) implementation for the Criteo Audience destination for managing audience segments.

## Event Types

### Supported Event Types

- **AudienceList**: Used for managing audience segment members in Criteo

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

## Configuration

### Required Settings

- **audienceId**: Criteo Audience Segment ID
- **audienceType**: Type of identifier to use (email, maid, gum, identityLink)
- **gumCallerId**: Required when audienceType is 'gum'

### Optional Settings

- None

## Data Mapping

### Standard Fields

| RudderStack Field                          | Criteo Field  | Notes                               |
| ------------------------------------------ | ------------- | ----------------------------------- |
| `properties.listData.[op].[].email`        | `identifiers` | When audienceType is 'email'        |
| `properties.listData.[op].[].maid`         | `identifiers` | When audienceType is 'maid'         |
| `properties.listData.[op].[].gum`          | `identifiers` | When audienceType is 'gum'          |
| `properties.listData.[op].[].identityLink` | `identifiers` | When audienceType is 'identityLink' |

Where `[op]` can be either `add` or `remove` to specify the operation type.

### Custom Fields

| RudderStack Field     | Criteo Field     | Notes                            |
| --------------------- | ---------------- | -------------------------------- |
| `Config.audienceType` | `identifierType` | Type of identifier being used    |
| `Config.gumCallerId`  | `gumCallerId`    | Required for GUM identifier type |

## Transformation Logic

### Event Validation

1. **Required Fields**:

   - `type`: Must be 'audiencelist'
   - `properties`: Must be present
   - `properties.listData`: Must be present
   - `properties.listData.add` or `properties.listData.remove`: At least one must be present

2. **Identifier Validation**:
   - Each object in `add` or `remove` arrays must contain the identifier type specified in the configuration
   - For GUM identifier type, `gumCallerId` must be provided in the configuration

### Payload Construction

1. **Batch Processing**:

   - Identifiers are automatically chunked into batches of 50,000
   - Each batch is processed as a separate request
   - Chunking is handled by the `populateIdentifiers` function

2. **Payload Structure**:

   ```javascript
   // For adding users
   {
     data: {
       type: 'ContactlistAmendment',
       attributes: {
         operation: 'add',
         identifierType: 'email' | 'maid' | 'gum' | 'identityLink',
         internalIdentifiers: false,
         gumCallerId: 'your-gum-caller-id', // Only for GUM type
         identifiers: ['identifier1', 'identifier2', ...]
       }
     }
   }

   // For removing users
   {
     data: {
       type: 'ContactlistAmendment',
       attributes: {
         operation: 'remove',
         identifierType: 'email' | 'maid' | 'gum' | 'identityLink',
         internalIdentifiers: false,
         gumCallerId: 'your-gum-caller-id', // Only for GUM type
         identifiers: ['identifier1', 'identifier2', ...]
       }
     }
   }
   ```

3. **Operation Handling**:
   - Each request can only perform one operation (add or remove)
   - If both add and remove operations are present in the input, they are processed as separate requests
   - The operation type is determined by the source of the identifiers (add or remove array)

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
