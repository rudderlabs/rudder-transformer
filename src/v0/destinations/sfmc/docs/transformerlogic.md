# Transformer Logic Flow

## Event Stream to Data Extension Updates

### Identify Flow

When a message with `type = identify` is received:

1. Check if `createOrUpdateContacts` is set to `false` (default behavior)
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

### Track Flow

When a message with `type = track` is received:

1. Check if the event name is mapped to an Event Definition Key
   - If mapped, use Event Definition trigger flow (see below)
2. If not mapped to an Event Definition, check if event is mapped to a Data Extension External Key
   - If not mapped, throw a configuration error
3. If mapped to a Data Extension, determine the primary key strategy:
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

## Contact Object Updates

For Contact Object updates (via Identify events):

1. The Contact is identified by `contactKey` (userId or email)
2. API call is made to create or update the contact:
   - Endpoint: `https://{subdomain}.rest.marketingcloudapis.com/contacts/v1/contacts`
   - Method: `POST`
   - Body: `{ attributeSets: [], contactKey: "{userId or email}" }`
3. This creates the Contact record in the Contact Builder if it doesn't exist
4. Note: This step is skipped if `createOrUpdateContacts` is set to `true`

## Event Definition Triggers

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
