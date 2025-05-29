# Salesforce Marketing Cloud RETL Functionality

## Overview

RETL (Real-time Extract, Transform, Load) functionality allows you to sync data from your data warehouse to Salesforce Marketing Cloud. This document outlines how RETL works with the SFMC destination.

## Connection Configuration

To use RETL with SFMC, you need to configure the following:

1. **Client ID**: Your SFMC API client ID
2. **Client Secret**: Your SFMC API client secret
3. **Subdomain**: Your SFMC instance subdomain
4. **External Key**: The external key of the data extension to use for RETL data

## RETL Flow

The RETL (Reverse ETL) flow is a specialized path for handling events that have been mapped to the destination through RudderStack's Reverse ETL feature. This flow is triggered when the message contains `context.mappedToDestination` set to a truthy value.

### RETL Processing Logic

1. When a message is received, the processor first checks for the presence of `mappedToDestination` flag:

    ```javascript
    const mappedToDestination = get(message, MappedToDestinationKey);
    if (mappedToDestination && GENERIC_TRUE_VALUES.includes(mappedToDestination?.toString())) {
      return retlResponseBuilder(message, destination, metadata);
    }
    ```

2. If the flag is present and truthy, the message is processed by the `retlResponseBuilder` function:
   - Retrieves authentication token using client credentials
   - Extracts destination-specific external ID information:

      ```javascript
      const { destinationExternalId, objectType, identifierType } = getDestinationExternalIDInfoForRetl(
        message,
        'SFMC'
      );
      ```

3. Currently, RETL flow only supports Data Extension object type:

    ```javascript
    if (objectType?.toLowerCase() === 'data extension') {
      // Process for Data Extension
    } else {
      throw new PlatformError('Unsupported object type for rETL use case');
    }
    ```

4. For Data Extension objects, the flow:
   - Constructs a PUT request to update the Data Extension row
   - Endpoint: `https://{subdomain}.rest.marketingcloudapis.com/hub/v1/dataevents/key:{externalKey}/rows/{identifierType}:{destinationExternalId}`
   - Method: `PUT`
   - Body: `{ values: { ...message.traits } }`
   - The `identifierType` and `destinationExternalId` are extracted from the message's `context.externalId` array
   - All traits from the message are included in the values object

### Code Implementation

```javascript
const retlResponseBuilder = async (message, destination, metadata) => {
  const { clientId, clientSecret, subDomain, externalKey } = destination.Config;
  const token = await accessTokenCache.get(metadata.destinationId, () =>
    getToken(clientId, clientSecret, subDomain, metadata),
  );
  const { destinationExternalId, objectType, identifierType } = getDestinationExternalIDInfoForRetl(
    message,
    'SFMC',
  );
  if (objectType?.toLowerCase() === 'data extension') {
    const response = defaultRequestConfig();
    response.method = defaultPutRequestConfig.requestMethod;
    response.endpoint = `https://${subDomain}.${ENDPOINTS.INSERT_CONTACTS}${externalKey}/rows/${identifierType}:${destinationExternalId}`;
    response.headers = {
      'Content-Type': JSON_MIME_TYPE,
      Authorization: `Bearer ${token}`,
    };
    response.body.JSON = {
      values: {
        ...message.traits,
      },
    };
    return response;
  }
  throw new PlatformError('Unsupported object type for rETL use case');
};
```

### RETL External ID Format

For RETL to work with SFMC, the message must include an external ID in the following format:

```json
{
  "context": {
    "externalId": [
      {
        "type": "SFMC-data extension",
        "id": "value-of-identifier",
        "identifierType": "identifier-field-name"
      }
    ]
  }
}
```

Where:

- `type`: Must start with "SFMC-" followed by the object type (currently only "data extension" is supported)
- `id`: The value of the identifier field in the Data Extension
- `identifierType`: The name of the identifier field in the Data Extension

## Limitations

1. **Object Types**: Only "data extension" is supported as an object type
2. **Authentication**: The destination uses the same authentication mechanism as regular events
3. **Rate Limits**: RETL requests are subject to the same rate limits as regular API requests

## Best Practices

1. **Identifier Selection**: Choose an appropriate identifier type and value that uniquely identifies the row in the data extension
2. **Data Structure**: Ensure that the traits in your RETL messages match the structure of your data extension
3. **Rate Limit Management**: Be mindful of API rate limits when syncing large volumes of data