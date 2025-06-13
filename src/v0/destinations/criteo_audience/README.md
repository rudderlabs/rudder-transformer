# Criteo Audience

## Overview

Criteo Audience is a destination that enables you to manage user segments in Criteo's platform. It allows you to add or remove users from Criteo audience segments based on their identifiers, supporting various identifier types including email, mobile advertising ID (MAID), GUM (Criteo's Universal Match), and identityLink.

## Features

- Add users to Criteo audience segments
- Remove users from Criteo audience segments
- Support for multiple identifier types (email, MAID, GUM, identityLink)
- Batch processing with automatic chunking
- Automatic retry mechanism for failed requests
- Support for OAuth2 authentication

## Configuration

### Required Settings

- **audienceId**: Criteo Audience Segment ID - Example: `123456`
- **audienceType**: Type of identifier to use - Example: `email`, `maid`, `gum`, `identityLink`
- **gumCallerId**: Required when audienceType is 'gum' - Example: `your-gum-caller-id`

### Optional Settings

- None

## Event Types

### Supported Event Types

- **Identify**: No
- **Track**: No
- **Page**: No
- **Screen**: No
- **Group**: No
- **Alias**: No
- **AudienceList**: Yes - Special event type for managing audience segment members

### Custom Event Types

- **AudienceList**: Used for adding or removing users from Criteo audience segments
  - Requires `listData` property with `add` and/or `remove` arrays
  - Each array contains user objects with identifier properties

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

## API Details

### Endpoints

- **Audience Management**: `https://api.criteo.com/2025-04/audiences/{audienceId}/contactlist` - HTTP Method: PATCH

### Authentication

- **Method**: OAuth2 Bearer Token
- **Credentials**: Access Token in Authorization header
- **Token Expiration**: Varies based on token type

### Rate Limits

- **Rate Limiting**: 429 status code indicates rate limit exceeded
- **App Level Limit**: Maximum 250 requests per minute
- **Response Headers**:
  - `x-ratelimit-limit`: Number of calls your App can perform
  - `x-ratelimit-remaining`: Number of calls remaining (resets to 250 every minute)
  - `x-ratelimit-reset`: Timestamp for rate limit reset
- **Handling Strategy**: Automatic retry with exponential backoff
- **Batch Size**: Maximum 50,000 identifiers per request

## Error Handling

### Common Errors

- **401 Unauthorized**: Invalid or expired access token
- **404 Not Found**: Invalid audience ID
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server-side error
- **503 Service Unavailable**: Service temporarily unavailable

### Retry Strategy

- **Retryable Errors**: 429, 500, 503
- **Max Retries**: 3
- **Backoff Strategy**: Exponential backoff with jitter

## Code Examples

### Basic Usage

```javascript
// Example: Add users to audience
const event = {
  type: 'audiencelist',
  properties: {
    listData: {
      add: [{ email: 'user1@example.com' }, { email: 'user2@example.com' }],
    },
  },
};

const criteoEvent = processEvent(event);
```

### Advanced Usage

```javascript
// Example: Add and remove users from audience
const event = {
  type: 'audiencelist',
  properties: {
    listData: {
      add: [{ email: 'user1@example.com' }, { email: 'user2@example.com' }],
      remove: [{ email: 'user3@example.com' }],
    },
  },
};

const criteoEvent = processEvent(event);
```

## Testing

### Integration Tests

- **Location**: `test/integrations/destinations/criteo_audience`
- **Running Tests**: `npm run test:ts -- component --destination=criteo_audience`

## Troubleshooting

### Common Issues

- **Invalid Audience ID**: Ensure the audience ID exists in your Criteo account
- **Invalid Token**: Check if the access token is valid and not expired
- **Rate Limiting**: Monitor request frequency and implement appropriate delays
- **Invalid Identifier Type**: Ensure the identifier type matches the audience configuration

### Debugging

- **Logs**: Enable debug logging with `LOG_LEVEL=debug`
- **Criteo API Response**: Check the response body for detailed error messages
- **Network Monitoring**: Monitor API calls and response times

## References

- **Official Documentation**: [Criteo Marketing Solutions API](https://developers.criteo.com/marketing-solutions/)
- **API Reference**: [Criteo API Reference](https://developers.criteo.com/marketing-solutions/docs/api-error-types)
- **Support Channels**: [Criteo Developer Support](https://developers.criteo.com/support)
