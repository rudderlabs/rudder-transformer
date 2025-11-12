# Salesforce Marketing Cloud Destination

Implementation in **Javascript**

## Configuration

### Required Settings

- **Client ID**: Required for authentication with Salesforce Marketing Cloud API

  - Must have appropriate permissions for the operations you want to perform

- **Client Secret**: Required for authentication with Salesforce Marketing Cloud API

- **Subdomain**: The subdomain of your Salesforce Marketing Cloud instance

  - Format: `[subdomain]` (e.g., `mycompany`)
  - This is used to construct the API endpoints

- **External Key**: The external key of the data extension to use for Identify events
  - This is required for storing user profile data

### Optional Settings

- ** Do Not Create or Update Contacts**: Enable to NOT create or update contacts in Salesforce Marketing Cloud

  - When enabled, Identify events will NOT create or update contacts in addition to updating data extensions

- **Event to External Key Mapping**: Maps track events to data extension external keys

  - Format: `[event name]:[external key]`
  - Required for track events to be processed

- **Event to Primary Key Mapping**: Maps track events to data extension primary keys

  - Format: `[event name]:[primary key]`
  - Default primary key is "Contact Key" if not specified

- **Event to UUID Mapping**: Maps track events to UUID flag

  - Format: `[event name]:[true/false]`
  - Determines whether to use UUID as primary key

- **Event to Definition Mapping**: Maps track events to event definition keys
  - Format: `[event name]:[event definition key]`
  - Required for triggering journey events

## Integration Functionalities

### Supported Message Types

- Identify
- Track

### Batching Support

- **Supported**: No
- **Message Types**: N/A

### API Endpoints and Rate Limits

The SFMC destination uses several REST API endpoints to handle different types of events and operations. Below is a detailed breakdown of each endpoint, its purpose, and associated limitations.

#### Endpoints Overview

| Endpoint                                                                                    | Purpose                  | Event Types     | Use Cases                                        |
| ------------------------------------------------------------------------------------------- | ------------------------ | --------------- | ------------------------------------------------ |
| `auth.marketingcloudapis.com/v2/token`                                                      | Authentication           | All             | Obtaining access token for API calls             |
| `rest.marketingcloudapis.com/contacts/v1/contacts`                                          | Contact Creation/Update  | Identify        | Creating or updating contacts in Contact Builder |
| `rest.marketingcloudapis.com/hub/v1/dataevents/key:{externalKey}/rows/{primaryKey}:{value}` | Data Extension Update    | Identify, Track | Updating data in specified data extensions       |
| `rest.marketingcloudapis.com/interaction/v1/events`                                         | Event Definition Trigger | Track           | Triggering journeys via event definitions        |

#### Detailed Endpoint Information

##### Authentication Endpoint

- **URL**: `https://{subdomain}.auth.marketingcloudapis.com/v2/token`
- **Method**: POST
- **Used For**: All event types
- **Payload**:
  ```json
  {
    "grant_type": "client_credentials",
    "client_id": "{clientId}",
    "client_secret": "{clientSecret}"
  }
  ```
- **Response**: Access token used for subsequent API calls
- **Caching**: Token is cached for a configurable period (default: 1000 milliseconds)
- **Rate Limits**: No specific limit documented, but subject to overall API call limits

##### Contact Creation/Update Endpoint

- **URL**: `https://{subdomain}.rest.marketingcloudapis.com/contacts/v1/contacts`
- **Method**: POST
- **Used For**: Identify events (when `createOrUpdateContacts` is enabled)
- **Payload**:
  ```json
  {
    "attributeSets": [],
    "contactKey": "{userId or email}"
  }
  ```
- **Purpose**: Creates or updates a contact in Contact Builder
- **Limitations**:
  - Requires a unique contact key (userId or email)
  - Limited attribute support in this implementation

##### Data Extension Update Endpoint

- **URL**: `https://{subdomain}.rest.marketingcloudapis.com/hub/v1/dataevents/key:{externalKey}/rows/{primaryKey}:{value}`
- **Method**: PUT
- **Used For**: Identify and Track events
- **Payload**:
  ```json
  {
    "values": {
      "Contact Key": "{contactKey}",
      ...mapped fields
    }
  }
  ```
- **Purpose**: Updates data in specified data extensions
- **Variations**:
  - Single primary key: `/rows/Contact Key:{contactKey}`
  - Multiple primary keys: `/rows/{key1}:{value1},{key2}:{value2},...`
  - UUID as primary key: `/rows/Uuid:{messageId}`
- **Limitations**:
  - Data extension must exist before sending data
  - Field names in data extension must match mapped fields (in title case)
  - Primary key fields must exist in the data extension

##### Event Definition Trigger Endpoint

- **URL**: `https://{subdomain}.rest.marketingcloudapis.com/interaction/v1/events`
- **Method**: POST
- **Used For**: Track events (when mapped to event definition keys)
- **Payload**:
  ```json
  {
    "ContactKey": "{contactId}",
    "EventDefinitionKey": "{mappedEventDefinitionKey}",
    "Data": { ...properties }
  }
  ```
- **Purpose**: Triggers journeys via event definitions
- **Limitations**:
  - Event definition must exist before triggering
  - Contact must exist in Contact Builder
  - `contactId` must be provided in the event properties

#### Rate Limits and Batch Sizes

Salesforce Marketing Cloud enforces API rate limits based on your subscription level:

| Edition    | API Calls Per Year |
| ---------- | ------------------ |
| Pro        | 2 million          |
| Corporate  | 6 million          |
| Enterprise | 200 million        |

There are no specific hourly or daily limits, but it's recommended to not exceed 2,000 SOAP API calls per minute.

##### Endpoint-Specific Considerations

- **Authentication**: Token requests should be minimized through caching
- **Contact Creation/Update**: High-volume operations should be batched through data extensions instead
- **Data Extension Updates**:
  - No documented batch size limit, but large payloads may impact performance
  - Updates are upserts - they create new rows or update existing ones based on primary keys
- **Event Definition Triggers**:
  - Each trigger potentially starts a journey
  - High volumes of triggers may impact journey performance

### Intermediate Calls

#### Identify Flow (with Create or Update Contacts enabled)

- **Supported**: Yes
- **Use Case**: Creating or updating contacts in Salesforce Marketing Cloud
- **Endpoint**: `/contacts/v1/contacts`
- This functionality creates or updates a contact before updating the data extension

```javascript
// The condition that leads to intermediate identify call:
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

### [Transformer Logic](docs/transformerlogic.md)

### Proxy Delivery

- **Supported**: No

### User Deletion

- **Supported**: No

### Additional Functionalities

#### Data Extension Updates

- **Supported**: Yes
- **How It Works**:
  - For Identify events, user profile data is stored in a data extension specified by the External Key configuration
  - For Track events, event data is stored in data extensions specified by the Event to External Key mapping
  - Primary keys can be configured for each event type to determine how data is updated in the data extension

#### Event Definition Triggers

- **Supported**: Yes
- **How It Works**:
  - Track events can be mapped to event definition keys using the Event to Definition Mapping configuration
  - When a track event is received with a matching event name, the corresponding event definition is triggered
  - This can be used to trigger journeys in Salesforce Marketing Cloud

## General Queries

### Event Ordering

#### Identify

Identify events require strict event ordering as they update user profiles in data extensions. Processing events out of order could result in older data overwriting newer data.

#### Track

Track events that update data extensions also require strict event ordering to ensure data integrity. However, track events that trigger event definitions (journeys) are less sensitive to ordering as they typically represent discrete events.

### Data Replay Feasibility

#### Missing Data Replay

- **Identify Events**: Not recommended. Replaying missing identify events could overwrite newer data with older data.
- **Track Events (Data Extension Updates)**: Not recommended for the same reason as identify events.
- **Track Events (Event Definition Triggers)**: Feasible, as these typically represent discrete events that trigger journeys.

#### Already Delivered Data Replay

- **Identify Events**: Not recommended. Replaying already delivered identify events would update the same records again, potentially overwriting changes made after the original event.
- **Track Events (Data Extension Updates)**: Not recommended for the same reason as identify events.
- **Track Events (Event Definition Triggers)**: Not recommended, as this would trigger the same journey multiple times.

### Multiplexing

#### Identify Events with Create or Update Contacts Enabled

- **Multiplexing**: YES
- First API Call: `/contacts/v1/contacts` - To create or update the contact
- Second API Call: `/hub/v1/dataevents/key:{externalKey}/rows/Contact Key:{contactKey}` - To update the data extension

#### Track Events with Event Definition Mapping

- **Multiplexing**: NO
- Single API Call: `/interaction/v1/events` - To trigger the event definition

#### Track Events with Data Extension Updates

- **Multiplexing**: NO
- Single API Call: `/hub/v1/dataevents/key:{externalKey}/rows/{primaryKey}:{value}` - To update the data extension

## Version Information

### Current Version

Salesforce Marketing Cloud uses REST API v1 for the endpoints used by this destination.

## Documentation Links

### REST API Documentation

- [Salesforce Marketing Cloud REST API Overview](https://developer.salesforce.com/docs/marketing/marketing-cloud/guide/rest-api-overview.html)
- [Authentication](https://developer.salesforce.com/docs/marketing/marketing-cloud/guide/authentication.html)
- [Data Extensions](https://developer.salesforce.com/docs/marketing/marketing-cloud/guide/data-extension-rows-via-rest.html)
- [Event Definitions](https://developer.salesforce.com/docs/marketing/marketing-cloud/guide/event-definition-key.html)

### RETL Functionality

#### RETL Flow

The RETL (Reverse ETL) flow is a specialized path for handling events that have been mapped to the destination through RudderStack's Reverse ETL feature. This flow is triggered when the message contains `context.mappedToDestination` set to a truthy value.

When a message is received with the `mappedToDestination` flag:

1. The destination extracts destination-specific external ID information
2. Currently, only "data extension" is supported as an object type
3. The destination constructs a PUT request to update the Data Extension row
4. All traits from the message are included in the values object

For detailed RETL functionality, please refer to [docs/retl.md](docs/retl.md)

### Business Logic and Mappings

For business logic and mappings information, please refer to [docs/businesslogic.md](docs/businesslogic.md)
