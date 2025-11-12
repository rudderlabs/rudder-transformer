# Salesforce Marketing Cloud Business Logic

## Overview

This document outlines the business logic implemented in the Salesforce Marketing Cloud (SFMC) destination. It covers how different event types are processed, the mappings used, and the flow of logic for each event type.

## Mappings

The SFMC destination uses two main mapping configurations:

1. **SFMCInsertIdentifyContactsConfig**: Used for mapping Identify events to data extension fields
2. **SFMCInsertTrackContactsConfig**: Used for mapping Track events to data extension fields

### Identify Event Mapping

The following fields are mapped from RudderStack Identify events to SFMC data extension fields:

| SFMC Field          | RudderStack Source               | Required |
| ------------------- | -------------------------------- | -------- |
| App Name            | context.app.name                 | No       |
| App Version         | context.app.version              | No       |
| App Build           | context.app.build                | No       |
| UTM Campaign        | context.campaign.name            | No       |
| UTM Source          | context.campaign.source          | No       |
| UTM Medium          | context.campaign.medium          | No       |
| UTM Term            | context.campaign.term            | No       |
| UTM Content         | context.campaign.content         | No       |
| Locale              | context.locale                   | No       |
| User Agent          | context.userAgent                | No       |
| IP Address          | context.ip, request_ip           | No       |
| Last Name           | lastName                         | No       |
| First Name          | firstName                        | No       |
| Ad Tracking Enabled | context.device.adTrackingEnabled | No       |
| Device Manufacturer | context.device.manufacturer      | No       |
| Device-model        | context.device.model             | No       |
| Device Name         | context.device.name              | No       |
| Device Type         | context.device.type              | No       |
| Bluetooth Enabled   | context.network.bluetooth        | No       |
| Network Carrier     | context.network.carrier          | No       |
| Cellular Enabled    | context.network.cellular         | No       |
| Wifi Enabled        | context.network.wifi             | No       |
| Screen Density      | context.screen.density           | No       |
| Screen Height       | context.screen.height            | No       |
| Screen Width        | context.screen.width             | No       |
| Email               | email                            | No       |

### Track Event Mapping

Track events use the same mapping as Identify events, with the addition of event-specific properties.

## Flow of Logic

### Authentication Flow

All requests to the SFMC API require authentication. The destination implements a token-based authentication flow:

1. The destination obtains an access token using the client ID and client secret
2. The token is cached for a configurable period (default: 1000 milliseconds)
3. The token is included in all subsequent API requests

```javascript
const getToken = async (clientId, clientSecret, subDomain, metadata) => {
  const response = defaultRequestConfig();
  response.endpoint = `https://${subDomain}.${ENDPOINTS.GET_TOKEN}`;
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = {
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  };

  const res = await handleHttpRequest(response, metadata);
  if (res.response.statusCode !== 200) {
    throw new NetworkError(
      `Failed to get access token with status code ${res.response.statusCode}`,
    );
  }
  return res.response.body.access_token;
};
```

### Event Stream to Data Extension Updates

#### Identify Event Flow

When a message with `type = identify` is received:

1. **Validation**: Checks if the event has a userId or email (required)
2. Check if `createOrUpdateContacts` is set to `false` (default behavior)
   - If `false`, two API calls are made:
     1. First call to identify/create the contact:
        - Endpoint: `https://{subdomain}.rest.marketingcloudapis.com/contacts/v1/contacts`
        - Method: `POST`
        - Uses `contactKey` (userId or email) as the unique identifier
        - Body: `{ attributeSets: [], contactKey: "{userId or email}" }`
     2. Second call to insert/update data in the Data Extension:
        - Endpoint: `https://{subdomain}.rest.marketingcloudapis.com/hub/v1/dataevents/key:{externalKey}/rows/Contact Key:{contactKey}`
        - Method: `PUT`
        - Uses `contactKey` (userId or email) as row identifier
        - Body: `{ values: { "Contact Key": "{contactKey}", ...payload } }`
   - If `true`, throws a configuration error indicating that creating/updating contacts is disabled

```javascript
if (category.type === 'identify' && !createOrUpdateContacts) {
  // first call to identify the contact
  const identifyContactsPayload = responseBuilderForIdentifyContacts(message, subDomain, authToken);
  await handleHttpRequest(identifyContactsPayload, metadata);
  // second call to update data extension
  return responseBuilderForInsertData(
    message,
    externalKey,
    subDomain,
    category,
    authToken,
    'identify',
  );
}
```

#### Track Event Flow

When a message with `type = track` is received:

1. **Validation**: Checks if the event has a name (required)
2. Check if the event name is mapped to an Event Definition Key
   - If mapped, use Event Definition trigger flow (see below)
3. If not mapped to an Event Definition, check if event is mapped to a Data Extension External Key
   - If not mapped, throw a configuration error
4. If mapped to a Data Extension, determine the primary key strategy:
   - If `uuid` is set to `true` for this event:
     - Endpoint: `https://{subdomain}.rest.marketingcloudapis.com/hub/v1/dataevents/key:{externalKey}/rows/Uuid:{messageId}`
     - Method: `PUT`
     - Uses message ID as the primary key
     - Body: `{ values: { "Uuid": "{messageId}", ...payload } }`
   - If custom primary keys are defined:
     - Endpoint: `https://{subdomain}.rest.marketingcloudapis.com/hub/v1/dataevents/key:{externalKey}/rows/{key1}:{value1},{key2}:{value2},...`
     - Method: `PUT`
     - Uses specified primary key fields and values
     - Body: `{ values: { ...payload } }`
   - If no primary key strategy is defined:
     - Endpoint: `https://{subdomain}.rest.marketingcloudapis.com/hub/v1/dataevents/key:{externalKey}/rows/Contact Key:{contactKey}`
     - Method: `PUT`
     - Uses `contactKey` (userId or email) as row identifier (default)
     - Body: `{ values: { "Contact Key": "{contactKey}", ...payload } }`

```javascript
if (category.type === 'track') {
  if (isEmpty(message.event)) {
    throw new ConfigurationError('Event name is required for track events');
  }
  if (typeof message.event !== 'string') {
    throw new ConfigurationError('Event name must be a string');
  }
  if (hashMapEventDefinition[message.event.toLowerCase()]) {
    return responseBuilderForMessageEvent(message, subDomain, authToken, hashMapEventDefinition);
  }
  if (!isDefinedAndNotNull(hashMapExternalKey[message.event.toLowerCase()])) {
    throw new ConfigurationError('Event not mapped for this track call');
  }
  return responseBuilderForInsertData(
    message,
    hashMapExternalKey[message.event.toLowerCase()],
    subDomain,
    category,
    authToken,
    'track',
    hashMapPrimaryKey[message.event.toLowerCase()] || CONTACT_KEY_KEY,
    hashMapUUID[message.event.toLowerCase()],
  );
}
```

### Contact Object Updates

For Contact Object updates (via Identify events):

1. The Contact is identified by `contactKey` (userId or email)
2. API call is made to create or update the contact:
   - Endpoint: `https://{subdomain}.rest.marketingcloudapis.com/contacts/v1/contacts`
   - Method: `POST`
   - Body: `{ attributeSets: [], contactKey: "{userId or email}" }`
3. This creates the Contact record in the Contact Builder if it doesn't exist
4. Note: This step is skipped if `createOrUpdateContacts` is set to `true`

### Event Definition Triggers

For Event Definition triggers (via Track events mapped to Event Definition Keys):

1. Check if the event name is mapped to an Event Definition Key in the configuration
2. If mapped, construct an event trigger payload:
   - Endpoint: `https://{subdomain}.rest.marketingcloudapis.com/interaction/v1/events`
   - Method: `POST`
   - Body:
     ```
     {
       "ContactKey": "{contactId}",
       "EventDefinitionKey": "{mappedEventDefinitionKey}",
       "Data": { ...properties }
     }
     ```
3. The `contactId` is expected to be in `message.properties.contactId`
4. The Event Definition Key is retrieved from the mapping configuration
5. All other properties from the track event are passed in the `Data` field
6. This triggers any Journey that is listening for this Event Definition Key

## Data Extension Update Logic

The destination uses different approaches for updating data extensions based on the event type and configuration:

### Identify Events

For Identify events, the destination constructs a PUT request to the data extension API with the following structure:

```
PUT https://{subdomain}.rest.marketingcloudapis.com/hub/v1/dataevents/key:{externalKey}/rows/Contact Key:{contactKey}
```

The payload includes all mapped fields from the Identify event.

### Track Events with Single Primary Key

For Track events with a single primary key set to "Contact Key", the destination constructs a PUT request similar to Identify events:

```
PUT https://{subdomain}.rest.marketingcloudapis.com/hub/v1/dataevents/key:{externalKey}/rows/Contact Key:{contactKey}
```

### Track Events with Multiple Primary Keys

For Track events with multiple primary keys or a single primary key that is not "Contact Key", the destination constructs a PUT request with all primary keys in the URL:

```
PUT https://{subdomain}.rest.marketingcloudapis.com/hub/v1/dataevents/key:{externalKey}/rows/{key1}:{value1},{key2}:{value2}
```

### Track Events with UUID

For Track events with UUID enabled, the destination constructs a POST request to create a new row in the data extension:

```
POST https://{subdomain}.rest.marketingcloudapis.com/hub/v1/dataevents/key:{externalKey}/rows
```

## Event Definition Trigger Logic

For Track events mapped to event definition keys, the destination constructs a POST request to the event API:

```
POST https://{subdomain}.rest.marketingcloudapis.com/interaction/v1/events
```

The payload includes:

- ContactKey: The contact ID from the event properties
- EventDefinitionKey: The mapped event definition key
- Data: All properties from the event

## Validations

### Required Fields

- **Identify Events**: Either userId or email is required
- **Track Events**: Event name is required and must be a string

### Field Formatting

- All field names in data extensions are converted to title case
- All values are flattened and undefined/null values are removed

### Error Handling

The destination throws specific errors for different validation failures:

- **Missing Event Type**: InstrumentationError - "Event type is required"
- **Unsupported Event Type**: InstrumentationError - "Event type {type} is not supported"
- **Missing Contact Key**: InstrumentationError - "Either userId or email is required"
- **Missing Event Name**: ConfigurationError - "Event name is required for track events"
- **Invalid Event Name**: ConfigurationError - "Event name must be a string"
- **Unmapped Event**: ConfigurationError - "Event not mapped for this track call"

## Use Cases

### User Profile Management

The SFMC destination can be used to manage user profiles in SFMC data extensions. Identify events update user profile data in the specified data extension.

### Event Tracking

Track events can be used to record user activities in SFMC data extensions. Each track event can be mapped to a specific data extension.

### Journey Triggering

Track events can be mapped to event definition keys to trigger journeys in SFMC. This allows you to start automated marketing journeys based on user activities tracked through RudderStack.
