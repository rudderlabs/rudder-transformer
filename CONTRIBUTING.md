# Contributing to RudderStack

Thanks for taking the time and for your help improving this project!

## Getting Help

If you have a question about rudder or have encountered problems using it,
start by asking a question on [Slack][slack].

## Rudder Labs Contributor Agreement

To contribute to this project, we need you to sign to [Contributor License Agreement (“CLA”)][cla] for the first commit you make. By agreeing to the [CLA][cla]
we can add you to list of approved contributors and review the changes proposed by you.

## Installing and Setting Up rudder-transformer

See the project's [README](README.md) for further information about working in this repository.

## Submitting a Pull Request

### Do you have an improvement?

1. Submit an [issue][issue] describing your proposed change.
2. We will try to respond to your issue promptly.
3. Fork this repo, develop and test your code changes. See the project's [README](README.md) for further information about working in this repository.
4. Submit a pull request against this repo's `develop` branch.
   - Include instructions on how to test your changes.
5. Your branch may be merged once all configured checks pass, including:
   - A review from appropriate maintainers

### Are you developing a new Integration with us?

1. Fork this repo, develop and test your code changes. See the project's [README](README.md) for further information about working in this repository.
2. Submit a pull request against this repo's `develop` branch.
   - Include instructions on how to test your changes.
3. Your branch may be merged once all configured checks pass, including:
   - A review from appropriate maintainers

#### Test-Driven Development (Recommended)

1. **Write Component Test Cases First:**  
   Before developing a new integration (whether for a source or destination), start by writing [component test cases](./test/integrations/). This approach ensures clarity on expected behavior and outcomes.  

2. **Use Skipped Tests for Context:**  
   Write your test cases with the `skip` option to prevent them from running initially. This allows reviewers to understand the business context and requirements before the actual integration is developed. Once the test cases are approved, proceed with the implementation.  

3. **Skipping Entire Test Files:**  
   To skip an entire test file, use the following syntax. See this [example](./test/integrations/destinations/examples/processor/data.ts):  
   ```ts
   export const skip = true;
   export const data = [...]
   ```

4. **Skipping Individual Test Cases:**  
   To skip specific test cases within a file, use this syntax. See this [example](./test/integrations/destinations/examples/router/data.ts):  
   ```ts
   export const data = [
     {
       skip: true,
       ...
     }
   ]
   ```
#### TypeScript Guidelines for New Integrations

1. **Mandatory Use of TypeScript**  
   - All new integrations on RudderStack must be developed using TypeScript.

2. **Leverage Common Types**  
   - Refer to the [common types](./src/types/) and define destination-specific types using these shared types.  
   - For key entities like **Destination** and **Connection**, prioritize using generic common types and customize them as needed for each integration.

3. **Adopt Zod for Type Definitions**  
   - Use **Zod schemas** to define types, enabling both runtime validation and TypeScript type inference via Zod's `infer` feature.

4. **Follow Recommended Structure**  
   - Refer to this [example](./src/v0/destinations/customerio_audience/) and maintain a similar project structure for consistency.


## Committing

We prefer squash or rebase commits so that all changes from a branch are
committed to main branch as a single commit. All pull requests are squashed when
merged, but rebasing prior to merge gives you better control over the commit
message.

----

Now, that you have a basic overview of the contibution guidelines. Let's dive into a detailed guide to contribute by creating a new custom RudderStack integration.

## Building your first custom RudderStack **source** integration

Before starting to work on your first RudderStack integration, it is highly recommended to get a high-level overview of [RudderStack Event Specification](https://www.rudderstack.com/docs/event-spec/standard-events/).



* When developing a **source integration**, you'll be transforming your events data received from the source to this specification.
* When developing a **destination integration**, you'll be parsing the event data according to this event spec and transforming it to your destination's data spec.


### Overview of integration development journey



1. Add integration code to [rudder-transformer](https://github.com/rudderlabs/rudder-transformer) `src/sources` or `src/v0/destinations` folder \
This is the codebase that controls how raw event data (received from the source) is transformed to RudderStack Event Data Specification and then finally to the destination specific data format
2. Add RudderStack UI configurations in [rudder-integrations-config](https://github.com/rudderlabs/rudder-integrations-config) `src/configurations/sources` or `src/configurations/destinations` folder \
This enables your integration users to setup/configure the integration via RudderStack Dashboard
3. Write the documentation for your integration (or share the [integration plan document](https://rudderstacks.notion.site/Integration-planning-document-example-Slack-Source-integration-46863d6041ec48258f9c5433eab93b28?pvs=25) with the RudderStack team)
4. RudderStack team will deploy your integration to production and post an announcement in the [Release Notes](https://www.rudderstack.com/docs/releases/)

RudderStack team will be available to help you by giving feedback and answering questions either directly on your GitHub PR or the [RudderStack Slack community](https://www.rudderstack.com/join-rudderstack-slack-community/). Before diving into code, writing an integration plan document helps a lot, here's an [example document](https://rudderstacks.notion.site/Integration-planning-document-example-Slack-Source-integration-46863d6041ec48258f9c5433eab93b28?pvs=25).


### 1. Setup rudder-transformer and understand the code structure

Setup [rudder-transformer](https://github.com/rudderlabs/rudder-transformer) on your local machine



* Clone [this repository](https://github.com/rudderlabs/rudder-transformer)
* Setup the repository with `npm run setup`
* Build the service with `npm run build:clean`
* Start the server with `npm start`

Understand the code structure



* `src/v0/destinations` - Destination integrations
* `src/v1/destinations` - Destination integrations (used for network handlers)
* `src/cdk/v2/destinations` - Destination Integrations that are written in CDK (no longer being developed now)
* `src/sources` - Source integrations
* `test/integrations/sources` - Integration tests for source integrations
* `test/integrations/destinations` - Integration tests for destination integrations


### 2. Write code for a v0 source integration {#2-write-code-for-a-v0-source-integration}

Here, we will explain the code for a v0 source integration but most of the learning will apply to other integrations as well (destination and v1).



* Create a new directory with the integration name under `src/v0` (follow the snake case naming convention)
* Add `transform.js`, add a `process(eventData)` function and export it. This is the function which will be called to transform the event data received from the source
* Add `config.js` to separate the source configuration and mapping

A simple example of `process` function and `transform.js` file looks like this

```javascript
/**
 * src/sources/slack/transform.js
 * An example transform.js file for Slack integration with v0 integration method
 */

const Message = require('../message'); // Standard RudderStacj event message object
const { TransformationError } = require('@rudderstack/integrations-lib'); // Standard errors
const { generateUUID, removeUndefinedAndNullValues } = require('../../util'); // Common utilities for v0 source integrations

/**
 * Transform the input event data to RudderStack Standard Event Specification - https://www.rudderstack.com/docs/event-spec/standard-events/
 * @param {Object} eventPayload - The event object received from the source. 
 *   For example, Slack sends this payload which Slack source integration transforms to match the RudderStack Event Specs (e.g. Slack's team_join event to RudderStack's IDENTIFY event spec)
 *   { 
 *     "event": { 
          "type": "team_join",
 *        "user": {
 *          "id": "W012CDE",
 *          "real_name": "John Doe"
 *        }
 *     },
 *     "type": "event_callback",
 *     ...restOfTheEventPayload 
 *   }
 * @returns {Object} transformedEvent - Transformed event
 */
function process(eventPayload) {
  const transformedEvent = new Message(`SLACK`); // SLACK is the integration name here. It will be different for your integration.
  if (!eventPayload?.event) {
    throw new TransformationError('Missing the required event data');
  }
  switch (eventPayload.event.type) {
    case 'team_join':
      // Transform Slack's team_join event to RudderStack's standard IDENTIFY event schema
      transformedEvent.setEventType(EventType.IDENTIFY);
      break;
  }
  // Normalize event names e.g. "team_join" to "Team Join"
  transformedEvent.setEventName(normalizeEventName(eventPayload.event.type)); 
  const stringifiedUserId = eventPayload?.event?.user?.id;
  // anonymousId is an important property of RudderStack event specification to identify user across different user events
  transformedEvent.setProperty(
    'anonymousId',
    stringifiedUserId ? sha256(stringifiedUserId).toString().substring(0, 36) : generateUUID(),
  );
  // externalId is another important property of RudderStack event specification that helps connect user identities from different channels
  transformedEvent.context.externalId = [
    {
      type: 'slackUserId',
      id: stringifiedUserId,
    },
  ];
  // Set the standard common event fields. More info at https://www.rudderstack.com/docs/event-spec/standard-events/common-fields/
  // originalTimestamp - The actual time (in UTC) when the event occurred
  transformedEvent.setProperty(
    'originalTimestamp',
    tsToISODate(eventPayload.event.ts)
  );
  // Map the remaining standard event properties according to mappings for the payload properties
  const mapping = [
    {
      "sourceKeys": "event.type",
      "destKeys": "event"
    },
    {
      "sourceKeys": "event.user.profile.real_name",
      "destKeys": "context.traits.name"
    },
  ]
  // Using a fixed json mapping structure (sourceKeys <> destKeys), it is the quickest way to map source fields with the destination fields
  transformedEvent.setPropertiesV2(eventPayload, mapping);
  // Copy the complete event payload to transformedEvent.properties
  Object.assign(transformedEvent.properties, eventPayload.event);
  return removeUndefinedAndNullValues(transformedEvent);
}

// Make sure to export the `process` function. All other details of the integration code can remain hidden.
exports.process = process;
```

### 3. Test your v0 source integration


#### Manual testing

You'll need some API request client (e.g. Postman, Bruno, etc.) to make a POST test request to 

`/{$integration-version-type e.g. v0 or v1}/{$integration-type e.g. sources or destinations}/{$integration-name e.g. slack}`



* Request endpoint example for Slack source - `POST /v0/sources/slack`
* Body - An array of event data object received from the source i.e. `[{ …eventData }]`
* Headers - `Content-Type: application/json`

Depending upon your integration behavior for different types of event, you can get different types of output.


##### Testing standard event response

This is what you'd want to do most of the time. The standard case, when you only transform the incoming event and hand it over to RudderStack to deliver to the destination.

For a successful event processing in such case, you should receive HTTP 200 OK response status with data in the following structure

```javascript
[
    {
        "output": {
            "batch": [
                {
                    ...transformedEventData
                }
            ]
        }
    }
]
```

##### Testing custom event response

You can customize the response to the HTTP request from the source beyond the standard event response format sent by RudderStack. You can customize the response body, content type header, status code, etc. Such customization is useful in some cases when you do not want to receive the standard response from RudderStack e.g. url_verification event for Slack webhook url ownership verification needs to respond back with the challenge parameter in the response body and the HTTP response status code to be 200.

In such a case, you need to return the response in a specific format containing `outputToSource` and `statusCode`. Your integration code can send the `outputToSource.body` and `outputToSource.contentType` as per your requirements.

In this case, a successful event response should match the following structure


```javascript
[
  { 
     outputToSource: {
       body: ...base64EncodedResponseBody, // e.g. eyJjaGFsb2UiOiIzZVpicncxYUIxMEZFTUFHQVpkNEZ5RlEifQ== (base64 encoding of the response body)
       contentType: ...contentType // e.g. application/json
     },
     statusCode: ...httpStatusCode, // e.g. 200
  }
]
```

### 4. Write automated tests

Follow the test structure similar to other integrations in `test/integrations/sources` or `test/integrations/destinations`.

You may reuse the same request data from the manual tests i.e. use them in place of `replaceThisWithYourEventPayloadProps` and `replaceThisWithYourTransformedEventOutput` (including the enclosing `[{ }]`). But make sure to redact any personal or secret information.

Here's an example

```javascript
/** test/sources/slack/data.ts **/

export const data = [

/** Test 1 - Testing standard event response **/

  {
    name: 'slack', // Replace with your integration name
    description: 'Team joined event', // Replace with your event description
    module: 'source', // Replace with your integration type - destination or source
    version: 'v0', // Replace with your integration approach - v0 or v1
    input: {
      request: {
        body: ...replaceThisWithYourEventPayload
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
    output: {
              batch: ...replaceThisWithYourTransformedEventOutput
            },
          },
        ],
      },
    },
  },

/** Test 2 - Testing custom event response **/

  {
    name: 'slack', // Replace with your integration name
    description: 'Webhook url verificatin event (not a standard RudderStack event, returns a custom response)', // Replace with your event description
    module: 'source', // Replace with your integration type - destination or source
    version: 'v0', // Replace with your integration approach - v0 or v1
    input: {
      request: {
        body: ...replaceThisWithYourEventPayload
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            outputToSource: {
              body: 'eyJjaGFsb2UiOiIzZVpicncxYUIxMEZFTUFHQVpkNEZ5RlEifQ==', // Replace this with the Base64 encoding of the response body your integrations sends
              contentType: 'application/json', // Replace this with the content type your integration sends
            },
            statusCode: 200, // Replace this with the custom response status your integration sends for this event
          },
        ],
      },
    },
  },
];
```

#### Running automated tests

You can run tests only for the specific integration, for example



* To test Slack destination -  `npm run test:ts -- component --destination=slack`
* To test Slack source - `npm run test:ts -- component --source=slack`

These tests will automatically be run on each commit, making sure that any new development does not break the existing integrations.

**Note:** After creating your test files, make sure to add your destination entry in the `INTEGRATIONS_WITH_UPDATED_TEST_STRUCTURE` list in `component.test.ts` to ensure your tests are included in the test suite.

**Reference:** Take a look at existing destinations like `tiktok_ads`, `loops`, `klaviyo`, etc. in the `test/integrations/destinations/` folder for reference on how to structure your tests.


### 5. Add RudderStack UI configurations in integrations-config

Add configuration for your integration in [rudder-integrations-config](https://github.com/rudderlabs/rudder-integrations-config) repo under `src/configurations/sources/` or `src.configurations/destinations`. At bare minimum, a db-config file is needed, here's [an example](https://github.com/rudderlabs/rudder-integrations-config/blob/develop/src/configurations/sources/slack/db-config.json) of the same for Slack source. Duplicate it in the directory for your integration config folder and change the relevant values for your integration.

Alternatively, the easier path to do this is by running a script which will generate these files for you. For this, first create a copy of this `[test/configData/inputData.json](https://github.com/rudderlabs/rudder-integrations-config/blob/develop/test/configData/inputData.json)` and adjust it to what you want to see in the RudderStack dashboard ui. And use that placeholder file in the following command

`python3 scripts/configGenerator.py &lt;path of the placeholder file>` 

Run this command from the root directory of the rudder-integrations-config repo. The PR can then be raised after checking if everything looks good.


### 6. Run the transformer locally

```bash

nvm use v20

npm ci

npm run build:start

```


### References


* [Contributing.md](https://github.com/rudderlabs/rudder-server/blob/master/CONTRIBUTING.md\) in all github repositories
* [https://www.rudderstack.com/docs/resources/community/](https://www.rudderstack.com/docs/resources/community/)
* [https://www.rudderstack.com/docs/event-spec/standard-events/](https://www.rudderstack.com/docs/event-spec/standard-events/)
* [Recording of the community event for new contributors](https://youtu.be/OD2vCYG-P7k?feature=shared)



## Building your first custom RudderStack **destination** integration

Before diving into this tutorial, it is highly recommended to get a high-level overview of [RudderStack Event Specification](https://www.rudderstack.com/docs/event-spec/standard-events/).

* When developing a **destination integration**, you'll be transforming the data from RudderStack Event Specification to your target destination's data specification.
* When developing a **source integration**, you'll be transforming your events data received from the source to RudderStack Event Specification.

In this tutorial, we will specifically focus on developing a destination integration.


### Overview of integration development journey


1. Add integration code to [rudder-transformer](https://github.com/rudderlabs/rudder-transformer) `src/sources` or `src/v0/destinations` folder. This is the codebase that controls how raw event data from [RudderStack Event Data Specification](https://www.rudderstack.com/docs/event-spec/standard-events/) to destination specific data format
2. Add RudderStack UI configurations in [rudder-integrations-config](https://github.com/rudderlabs/rudder-integrations-config) `src/configurations/destinations` folder \
This enables your integration users to setup/configure the integration via RudderStack Dashboard
3. Write the documentation for your integration (or share the [integration plan document](https://rudderstacks.notion.site/Integration-planning-document-example-Slack-Source-integration-46863d6041ec48258f9c5433eab93b28?pvs=25) with the RudderStack team)
4. RudderStack team will deploy your integration to production and post an announcement in the [Release Notes](https://www.rudderstack.com/docs/releases/)

RudderStack team will be available to help you by giving feedback and answering questions either directly on your GitHub PR or the [RudderStack Slack community](https://www.rudderstack.com/join-rudderstack-slack-community/). Before diving into code, writing an integration plan document helps a lot, here's an [example document](https://rudderstacks.notion.site/Integration-planning-document-example-Slack-Source-integration-46863d6041ec48258f9c5433eab93b28?pvs=25).


### 1. Setup rudder-transformer and understand the code structure

Setup [rudder-transformer](https://github.com/rudderlabs/rudder-transformer) on your local machine



* Clone [this repository](https://github.com/rudderlabs/rudder-transformer)
* Setup the repository with `npm run setup`
* Build the service with `npm run build:clean`
* Start the server with `npm start`

Understand the code structure


* `src/v0/destinations` - Destination integrations
* `src/v1/destinations` - Destination integrations (used for network handlers)
* `src/cdk/v2/destinations` - Destination Integrations that are written in CDK (no longer being developed now)
* `src/sources` - Source integrations
* `test/integrations/sources` - Integration tests for source integrations
* `test/integrations/destinations` - Integration tests for destination integrations


### 2. Write code for a destination integration

Here, we will explain the code for a destination integration for single event processing as well as batch events processing.

Before diving into the code, we recommend exploring the code for different destinations under the `src/v0/destinations` folder. This is the same structure you'll follow for your integration. This is a high-level overview of the code structure which you'll be creating



* `src/v0/destinations/**my_destination**` (follow the snake_case naming convention) - Your integration code for `my_destination`
* `src/v0/destinations/**my_destination/transform.ts**` - Main transformation logic with router and processor functions
* `src/v0/destinations/**my_destination/types.ts**` - TypeScript types with Zod schemas for validation
* `src/v0/destinations/**my_destination/config.ts**` - Configuration constants and endpoints
* `src/v0/destinations/**my_destination/utils.ts**` - Utility functions (optional, only if needed)
* `src/v0/destinations/**my_destination/utils.test.ts**` - Unit tests for utilities (optional, only if needed)

Before we dive into the code for a simple transformation for a destination, let's address the potential questions you might have at this point

**Why is the integration code for destination transformation written in TypeScript instead of JavaScript?**

TypeScript provides better type safety, improved developer experience, and better maintainability. It helps catch errors at compile time and provides better IntelliSense support. This is why we moved from JavaScript to TypeScript for the data transformation code.

**Does using TypeScript limit our flexibility to write complex transformation logic?**

No. TypeScript is a superset of JavaScript, so you have all the flexibility of JavaScript plus the benefits of static typing. You can write any kind of complex transformation logic while maintaining type safety and better code organization.

**What exactly is the TypeScript transformation approach?**

In the [rudder-transformer](https://github.com/rudderlabs/rudder-transformer/) service, we handle data transformation from customer events to destination events. The rudder-transformer service uses TypeScript with Zod schemas to organize this transformation process into clear, manageable functions. This includes validation, data mapping, enriching with API calls, and handling various event types. These steps were earlier implemented in JavaScript, which, while flexible, was challenging to maintain and standardize. To improve readability, testability, and development speed, we transitioned to a TypeScript-first approach with Zod schemas for runtime validation and type inference.

**To develop an integration, how much do I need to understand about TypeScript?**

Basic TypeScript knowledge is sufficient. The key concepts you'll need are:
1. **Type definitions** - Using interfaces and types
2. **Zod schemas** - For runtime validation and type inference
3. **Function signatures** - Understanding input/output types
4. **Error handling** - Using try-catch blocks and proper error types

A simple example of `transform.ts` looks like this:

```typescript
/**
 * src/v0/destinations/my_destination/transform.ts
 * A simple transform.ts example for My Destination integration
 * 
 * This file contains the core transformation logic for converting events
 * to destination-specific format and building HTTP responses.
 */

import { z } from 'zod';
import { Destination, Metadata } from '../../../types';
import { 
  ProcessorTransformationRequest, 
  ProcessorTransformationResponse,
  RouterTransformationRequest,
  RouterTransformationResponse
} from '../../../types/destinationTransformation';
import { constructPayload, defaultRequestConfig } from '../../util';
import { ConfigurationError } from '@rudderstack/integrations-lib';
import { MappingConfig, ConfigCategory, API_CONFIG, ENDPOINT_CONFIG } from './config';

/**
 * Transform identify event
 * 
 * This function converts identify events to destination-specific format
 * using the mapping configuration defined in the JSON files.
 * 
 * @param message - The message object containing user identification data
 * @param destination - The destination configuration object
 * @returns Transformed payload ready for the destination API
 */
const transformIdentifyPayload = (message: MyDestinationMessage, destination: MyDestinationDestination): MyDestinationIdentifyPayload  => {
  // Get the identify category configuration for mapping
  const category = ConfigCategory.IDENTIFY;
  
  // Use the mapping configuration to transform the message
  // This applies the rules defined in MyDestinationIdentifyConfig.json
  const payload = constructPayload(message, MappingConfig[category.name]);
  
  // any additional transformation logic
  if (!payload.user_id && message.anonymousId) {
    payload.user_id = message.anonymousId;
  }
  
  return payload;
};

/**
 * Transform track event
 * 
 * This function converts track events to destination-specific format
 * using the mapping configuration defined in the JSON files.
 * 
 * @param message - The message object containing event tracking data
 * @param destination - The destination configuration object
 * @returns Transformed payload ready for the destination API
 */
const transformTrackPayload = (message: MyDestinationMessage, destination: MyDestinationDestination): MyDestinationTrackPayload => {
  // Get the track category configuration for mapping
  const category = ConfigCategory.TRACK;
  
  // Use the mapping configuration to transform the message
  // This applies the rules defined in MyDestinationTrackConfig.json
  const payload = constructPayload(message, MappingConfig[category.name]);
  
  // any additional transformation logic
  if (!payload.user_id && message.anonymousId) {
    payload.user_id = message.anonymousId;
  }
  
  return payload;
};

/**
 * Common response handler
 * 
 * This function creates a standardized HTTP response
 * 
 * @param endpoint - The API endpoint URL
 * @param method - HTTP method (GET, POST, etc.)
 * @param headers - HTTP headers including authorization and content type
 * @param payload - The transformed payload to send
 * @returns Properly formatted response object for processing
 */
const responseHandler = (
  endpoint: string,
  method: string,
  headers: MyDestinationHeaders,
  payload: MyDestinationPayload,
): MyDestinationProcessorResponse => {
  // Create a new response object using the utility
  const response = defaultRequestConfig();
  
  // Set the endpoint URL
  response.endpoint = endpoint;
  
  // Set the HTTP method
  response.method = method;
  
  // Set the headers (Authorization, Content-Type, etc.)
  response.headers = headers;
  
  // Set the request body as JSON
  response.body.JSON = payload;
  
  return response;
};

/**
 * Build identify response
 * 
 * Creates a complete HTTP response for identify events by:
 * 1. Transforming the message payload
 * 2. Using the endpoint configuration for identify events
 * 3. Adding proper headers and authentication
 * 
 * @param input - The processor request containing message and destination config
 * @returns Complete HTTP response ready for the destination API
 */
const constructIdentifyResponse = (input: MyDestinationProcessorRequest): MyDestinationProcessorResponse => {
  const { message, destination } = input;
  
  // Transform the message to destination-specific format
  const payload = transformIdentifyPayload(message, destination);
  
  // Build the response using the identify endpoint configuration
  return responseHandler(
    ENDPOINT_CONFIG.IDENTIFY.url,
    ENDPOINT_CONFIG.IDENTIFY.method,
    {
      'Authorization': `Bearer ${destination.Config.apiKey}`,
      'Content-Type': ENDPOINT_CONFIG.IDENTIFY.contentType
    },
    payload
  );
};

/**
 * Build track response
 * 
 * Creates a complete HTTP response for track events by:
 * 1. Transforming the message payload
 * 2. Using the endpoint configuration for track events
 * 3. Adding proper headers and authentication
 * 
 * @param input - The processor request containing message and destination config
 * @returns Complete HTTP response ready for the destination API
 */
const constructTrackResponse = (input: MyDestinationProcessorRequest): MyDestinationProcessorResponse => {
  const { message, destination } = input;
  
  // Transform the message to destination-specific format
  const payload = transformTrackPayload(message, destination);
  
  // Build the response using the track endpoint configuration
  return responseHandler(
    ENDPOINT_CONFIG.TRACK.url,
    ENDPOINT_CONFIG.TRACK.method,
    {
      'Authorization': `Bearer ${destination.Config.apiKey}`,
      'Content-Type': ENDPOINT_CONFIG.TRACK.contentType
    },
    payload
  );
};

/**
 * Process single event
 * 
 * This is the main entry point for processing individual events.
 * It validates the configuration and routes the event to the appropriate
 * handler based on the event type.
 * 
 * @param input - The processor request containing message and destination config
 * @returns Processed response for the event
 * @throws ConfigurationError if API key is missing
 * @throws Error if event type is not supported
 */
const processEvent = (input: MyDestinationProcessorRequest) : MyDestinationProcessorResponse => {
  const { message, destination } = input;
  
  // any other validation
  if (!destination.Config.apiKey) {
    throw new ConfigurationError('API key is required');
  }

  // Route the event to the appropriate handler based on event type
  switch (message.type) {
    case 'identify':
      return constructIdentifyResponse(input);
    case 'track':
      return constructTrackResponse(input);
    default:
      throw new Error(`Unsupported message type: ${message.type}`);
  }
};

/**
 * Process single events
 * 
 * This function is called for single event processing.
 * It's the main export that handles individual events.
 * 
 * @param input - The processor request containing message and destination config
 * @returns Promise resolving to the processed response
 */
export const process = async (
  input: MyDestinationProcessorRequest
): Promise<MyDestinationProcessorResponse> => {
  const processedEvent = await processEvent(event);
  return processedEvent;
};

/**
 * Process batch events
 * 
 * This function is called for batch event processing.
 * It uses the utility function to handle multiple events efficiently.
 * 
 * @param inputs - Array of router requests for batch processing
 * @returns Promise resolving to array of processed responses
 */
export const processRouterDest = async (
  inputs: MyDestinationRouterRequest[]
): Promise<MyDestinationRouterResponse[]> => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};
```

And here's the corresponding `types.ts` file with Zod schemas:

```typescript
/**
 * src/v0/destinations/my_destination/types.ts
 * TypeScript types for My Destination integration
 * 
 * This file defines all the TypeScript types and Zod schemas for runtime validation.
 * Zod schemas provide both compile-time type safety and runtime validation.
 */

import { z } from 'zod';
import { Destination, Metadata } from '../../../types';
import { 
  ProcessorTransformationRequest, 
  ProcessorTransformationResponse,
  RouterTransformationRequest,
  RouterTransformationResponse
} from '../../../types/destinationTransformation';

// Configuration schema - defines the structure of destination configuration
// This validates the API key and any other config parameters
export const MyDestinationDestinationConfigSchema = z
  .object({
    apiKey: z.string().min(1, 'API key is required'), // Ensures API key is not empty
  })
  .passthrough(); // Allows additional properties beyond the defined schema

// Message schema - defines the structure of incoming RudderStack events
// This validates the event data before processing
export const MyDestinationMessageSchema = z
  .object({
    type: z.enum(['identify', 'track']), // Only allow these event types
    userId: z.string().optional(), // User identifier (optional)
    anonymousId: z.string().optional(), // Anonymous user identifier (optional)
    event: z.string().optional(), // Event name for track events (optional)
    properties: z.record(z.any()).optional(), // Event properties (optional)
    traits: z.record(z.any()).optional(), // User traits for identify events (optional)
    originalTimestamp: z.string().optional(), // Original event timestamp (optional)
  })
  .passthrough(); // Allows additional properties beyond the defined schema

// TypeScript types derived from Zod schemas using 'infer'
// This provides compile-time type safety
export type MyDestinationDestinationConfig = z.infer<typeof MyDestinationDestinationConfigSchema>;
export type MyDestinationMessage = z.infer<typeof MyDestinationMessageSchema>;
export type MyDestinationDestination = Destination<MyDestinationDestinationConfig>;

// Request/response types for processor (single event processing)
// These types define the input/output structure for the main processing functions
export type MyDestinationProcessorRequest = ProcessorTransformationRequest<
  MyDestinationMessage,
  Metadata,
  MyDestinationDestination
>;

export type MyDestinationProcessorResponse = ProcessorTransformationResponse;

// Request/response types for router (batch event processing)
// These types define the input/output structure for batch processing
export type MyDestinationRouterRequest = RouterTransformationRequest<
  MyDestinationMessage,
  MyDestinationDestination
>;

export type MyDestinationRouterResponse = RouterTransformationResponse;

// Type definitions for headers and payloads
// These define the structure of HTTP requests to the destination API
export type MyDestinationHeaders = {
  'Authorization': string; // Bearer token or API key
  'Content-Type': string; // Usually 'application/json'
};

// Union type for all possible payload types
export type MyDestinationPayload = MyDestinationIdentifyPayload | MyDestinationTrackPayload;

// Identify event payload structure
// Define the exact fields your destination expects for user identification
export type MyDestinationIdentifyPayload = {
  // Define identify payload structure based on your destination's requirements
  // Example: user_id, email, name, properties, etc.
}

// Track event payload structure
// Define the exact fields your destination expects for event tracking
export type MyDestinationTrackPayload = {
  // Define track payload structure based on your destination's requirements
  // Example: user_id, event, properties, timestamp, etc.
}
```

And here's the corresponding `config.ts` file:

```typescript
/**
 * src/v0/destinations/my_destination/config.ts
 * Configuration for My Destination integration
 * 
 * This file contains all configuration constants, API endpoints, and mapping setup.
 * It centralizes all configuration to make the integration easy to maintain.
 */

import { getMappingConfig } from '../../util';

// Destination type identifier - used for logging and error tracking
const destType = 'MY_DESTINATION';

// API configuration - defines the base URL, endpoints, and HTTP methods
// This makes it easy to change API endpoints or add new ones
const API_CONFIG = {
  BASE_URL: 'https://api.mydestination.com', // Base URL for all API calls
  ENDPOINTS: {
    USERS: '/users', // Endpoint for user identification
    EVENTS: '/events' // Endpoint for event tracking
  },
  METHODS: {
    POST: 'POST' // HTTP method for sending data
  },
  HEADERS: {
    CONTENT_TYPE_JSON: 'application/json', // Content type for JSON payloads
    // CONTENT_TYPE_FORM: 'application/x-www-form-urlencoded' // Alternative for form data
  }
} as const; // 'as const' makes the object immutable and provides better type inference

// Simplified endpoint configuration - combines base URL with specific endpoints
// This creates complete URLs for each event type
const ENDPOINT_CONFIG = {
  IDENTIFY: {
    url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`, // Full URL for identify events
    method: API_CONFIG.METHODS.POST, // HTTP method for identify events
    contentType: API_CONFIG.HEADERS.CONTENT_TYPE_JSON // Content type for identify events
  },
  TRACK: {
    url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EVENTS}`, // Full URL for track events
    method: API_CONFIG.METHODS.POST, // HTTP method for track events
    contentType: API_CONFIG.HEADERS.CONTENT_TYPE_JSON // Content type for track events
  }
} as const; // 'as const' makes the object immutable and provides better type inference

// Configuration categories - defines the mapping configuration files for each event type
// This tells the system which JSON files to use for field mapping
const ConfigCategory = {
  IDENTIFY: {
    name: 'MyDestinationIdentifyConfig', // Maps to MyDestinationIdentifyConfig.json
  },
  TRACK: {
    name: 'MyDestinationTrackConfig', // Maps to MyDestinationTrackConfig.json
  },
};

// Load mapping configuration from JSON files
// This reads the mapping rules from the data/ folder
const MappingConfig = getMappingConfig(ConfigCategory, __dirname);

// Export all configuration for use in other files
export {
  destType,
  ConfigCategory,
  MappingConfig,
  API_CONFIG,
  ENDPOINT_CONFIG
};
```

And here's an example of the mapping configuration files:

```json
// src/v0/destinations/my_destination/data/MyDestinationIdentifyConfig.json
// This file defines how to map RudderStack identify event fields to destination fields
[
  {
    "destKey": "user_id", // Destination field name
    "sourceKeys": "userIdOnly", // RudderStack field name (special mapping)
    "sourceFromGenericMap": true // Use generic mapping utility
  },
  {
    "destKey": "email", // Destination field name
    "sourceKeys": "email", // RudderStack field name
    "sourceFromGenericMap": true // Use generic mapping utility
  },
  {
    "destKey": "name", // Destination field name
    "sourceKeys": ["traits.name", "context.traits.name"] // Multiple possible source fields
  },
  {
    "destKey": "properties", // Destination field name
    "sourceKeys": ["traits", "context.traits"] // Map all traits as properties
  }
]
```

```json
// src/v0/destinations/my_destination/data/MyDestinationTrackConfig.json
// This file defines how to map RudderStack track event fields to destination fields
[
  {
    "destKey": "user_id", // Destination field name
    "sourceKeys": "userIdOnly", // RudderStack field name (special mapping)
    "sourceFromGenericMap": true // Use generic mapping utility
  },
  {
    "destKey": "event", // Destination field name
    "sourceKeys": "event" // RudderStack event name
  },
  {
    "destKey": "properties", // Destination field name
    "sourceKeys": "properties" // RudderStack event properties
  },
  {
    "destKey": "timestamp", // Destination field name
    "sourceKeys": "originalTimestamp" // RudderStack original timestamp
  }
]
```

### 3. Test your destination integration


#### Manual testing

You'll need some API request client (e.g. Postman, Bruno, curl, etc.) for manual testing. 



* Make a `POST` request to this endpoint - `POST /v1/destinations/my_destination`
* Body - An array of event data object received from the source i.e. `[{ …eventData }]`
* Headers - `Content-Type: application/json`

Depending upon your integration behavior for different types of event, you can get different types of output.


##### Testing standard event response

This is what you'd want to do most of the time. The standard case, when you only transform the incoming event and hand it over to RudderStack to deliver to the destination.

For a successful event processing in such case, you should receive HTTP 200 OK response status with data in the following structure

```javascript
[
    {
        "output": {
            "batch": [
                {
                    ...transformedEventData
                }
            ]
        }
    }
]
```


##### Testing custom event response

You can customize the response to the HTTP request from the source beyond the standard event response format sent by RudderStack. You can customize the response body, content type header, status code, etc. Such customization is useful in some cases when you do not want to receive the standard response from RudderStack e.g. you want a custom response body and the HTTP response status code.


### 4. Write automated tests for your destination integration {#4-write-automated-tests-for-your-destination-integration}

Follow the test structure similar to other integrations in `test/integrations/destinations`. Here's an overview of the test code structure which you will be creating



* `test/integrations/destinations/my_destination` - To contain all your test code for `my_destination`
* `test/integrations/destinations/my_destination/processor` - Test code for single event processing logic using `ProcessorTestData` type
    * `data.ts`
    * `identify.ts` - Test for [`identify`](https://www.rudderstack.com/docs/event-spec/standard-events/identify/) event
    * `track.ts` - Test for [`track`](https://www.rudderstack.com/docs/event-spec/standard-events/track/) event
* `test/integrations/destinations/my_destination/router` - Test code for batch events processing logic using `RouterTestData` type

You may reuse the same request data from the manual tests i.e. use them in place of `replaceThisWithYourEventPayloadProps` and `replaceThisWithYourTransformedEventOutput` (including the enclosing `[{ }]`). But make sure to redact any personal or secret information.

Here's an example

```typescript
import { ProcessorTestData } from '../../../types/testTypes';

export const data: ProcessorTestData[] = [
  {
    name: 'my_destination',
    description: 'Complete track event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '78c53c15-32a1-4b65-adac-bec2d7bb8fab',
              channel: 'web',
              context: {
                app: {
                  name: 'RSPM',
                  version: '1.9.0',
                },
                campaign: {
                  name: 'sales campaign',
                  source: 'google',
                  medium: 'medium',
                  term: 'event data',
                  content: 'Make sense of the modern data stack',
                },
                ip: '192.0.2.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '2.9.1',
                },
                locale: 'en-US',
                device: {
                  manufacturer: 'Nokia',
                  model: 'N2023',
                },
                page: {
                  path: '/best-seller/1',
                  initial_referrer: 'https://www.google.com/search',
                  initial_referring_domain: 'google.com',
                  referrer: 'https://www.google.com/search?q=estore+bestseller',
                  referring_domain: 'google.com',
                  search: 'estore bestseller',
                  title: 'The best sellers offered by EStore',
                  url: 'https://www.estore.com/best-seller/1',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                  innerHeight: 200,
                  innerWidth: 100,
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; Android SDK built for x86 Build/PSR1.180720.075)',
              },
              event: 'Product Reviewed',
              integrations: {
                All: true,
              },
              messageId: '1578564113557-af022c68-429e-4af4-b99b-2b9174056383',
              properties: {
                userId: 'u001',
                sessionId: 's001',
                review_id: 'review_id_1',
                product_id: 'product_id_1',
                rating: 5,
                review_body: 'Sample Review Body',
                latitude: 44.56,
                longitude: 54.46,
                region: 'Atlas',
                city: 'NY',
                country: 'USA',
              },
              originalTimestamp: '2020-01-09T10:01:53.558Z',
              type: 'track',
              sentAt: '2020-01-09T10:02:03.257Z',
            },
            destination: {
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'My Destination',
              DestinationDefinition: {
                Config: {},
              },
              Config: {
                apiKey: 'dummyMyDestinationAPIKey',
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
              JSON: {
                  event: 'Product Reviewed',
                  user_id: 'u001',
                  properties: {
                    userId: 'u001',
                    sessionId: 's001',
                    review_id: 'review_id_1',
                    product_id: 'product_id_1',
                    rating: 5,
                    review_body: 'Sample Review Body',
                    latitude: 44.56,
                    longitude: 54.46,
                    region: 'Atlas',
                    city: 'NY',
                    country: 'USA',
                  },
                  timestamp: '2020-01-09T10:01:53.558Z',
                  context: {
                    browser: {
                      url: 'https://www.estore.com/best-seller/1',
                      user_agent:
                        'Dalvik/2.1.0 (Linux; U; Android 9; Android SDK built for x86 Build/PSR1.180720.075)',
                      initial_referrer: 'https://www.google.com/search',
                    },
                    mobile: {
                      app_name: 'RSPM',
                      app_version: '1.9.0',
                    },
                    device: {
                      manufacturer: 'Nokia',
                      model: 'N2023',
                    },
                    location: {
                      ip_address: '192.0.2.0',
                      latitude: 44.56,
                      longitude: 54.46,
                      city: 'NY',
                      region: 'Atlas',
                      country: 'USA',
                    },
                  },
                  session: {
                    id: 's001',
                  },
                  user: {
                    uid: 'u001',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mydestination.com/events',
              headers: {
                authorization: 'Bearer dummyMyDestinationAPIKey',
                'content-type': 'application/json',
              },
              params: {},
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'my_destination',
    description: 'Missing event name',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                device: {
                  manufacturer: 'Nokia',
                  model: 'N2023',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; Android SDK built for x86 Build/PSR1.180720.075)',
              },
              integrations: {
                All: true,
              },
              properties: {
                userId: 'u001',
                latitude: 44.56,
                longitude: 54.46,
                region: 'Atlas',
                city: 'NY',
                country: 'USA',
              },
              originalTimestamp: '2020-01-09T10:01:53.558Z',
              type: 'track',
              sentAt: '2020-01-09T10:02:03.257Z',
            },
            destination: {
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'My Destination',
              DestinationDefinition: {
                Config: {},
              },
              Config: {
                apiKey: 'dummyMyDestinationAPIKey',
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 400,
            error:
              'event is required for track call',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'MY_DESTINATION',
              module: 'destination',
              feature: 'processor',
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
  {
    name: 'my_destination',
    description: 'Complete identify event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'dummy-user001',
              channel: 'web',
              context: {
                traits: {
                  company: 'Initech',
                  address: {
                    country: 'USA',
                    state: 'CA',
                    street: '101 dummy street',
                  },
                  email: 'dummyuser@domain.com',
                  name: 'dummy user',
                  phone: '099-999-9999',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
              },
              integrations: {
                All: true,
              },
              originalTimestamp: '2020-01-27T12:20:55.301Z',
              receivedAt: '2020-01-27T17:50:58.657+05:30',
              request_ip: '14.98.244.60',
              sentAt: '2020-01-27T12:20:56.849Z',
              timestamp: '2020-01-27T17:50:57.109+05:30',
              type: 'identify',
            },
            destination: {
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'My Destination',
              DestinationDefinition: {
                Config: {},
              },
              Config: {
                apiKey: 'dummyMyDestinationAPIKey',
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
                JSON: {
              properties: {
                    company: 'Initech',
                    address: {
                      country: 'USA',
                      state: 'CA',
                      street: '101 dummy street',
                    },
                    email: 'dummyuser@domain.com',
                    name: 'dummy user',
                    phone: '099-999-9999',
                  },
                  uid: 'dummy-user001',
                  email: 'dummyuser@domain.com',
                  display_name: 'dummy user',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mydestination.com/v2/users',
              headers: {
                authorization: 'Basic dummyMyDestinationAPIKey',
                'content-type': 'application/json',
              },
              params: {},
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'my_destination',
    description: 'Identify event with needed traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'dummy-user001',
              channel: 'web',
              context: {
                traits: {
                  email: 'dummyuser@domain.com',
                  name: 'dummy user',
                  phone: '099-999-9999',
                },
              },
              timestamp: '2020-01-27T17:50:57.109+05:30',
              type: 'identify',
            },
            destination: {
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'My Destination',
              DestinationDefinition: {
                Config: {},
              },
              Config: {
                apiKey: 'dummyMyDestinationAPIKey',
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
              JSON: {
                properties: {
                    email: 'dummyuser@domain.com',
                    name: 'dummy user',
                    phone: '099-999-9999',
                  },
                  uid: 'dummy-user001',
                  email: 'dummyuser@domain.com',
                  display_name: 'dummy user',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://api.mydestination.com/v2/users',
              headers: {
                authorization: 'Basic dummyMyDestinationAPIKey',
                'content-type': 'application/json',
              },
              params: {},
              files: {},
              userId: '',
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
```

#### Running automated tests

You can run tests only for the specific integration, for example



* To test destination -  `npm run test:ts -- component --destination=my_destination`

These tests will automatically be run on each commit, making sure that any new development does not break the existing integrations.

**Note:** After creating your test files, make sure to add your destination entry in the `INTEGRATIONS_WITH_UPDATED_TEST_STRUCTURE` list in `component.test.ts` to ensure your tests are included in the test suite.

**Reference:** Take a look at existing destinations like `tiktok_ads`, `loops`, `klaviyo`, etc. in the `test/integrations/destinations/` folder for reference on how to structure your tests.


### 5. Add RudderStack UI configurations in integrations-config

Add configuration for your destination integration in [rudder-integrations-config](https://github.com/rudderlabs/rudder-integrations-config) repo under `src.configurations/destinations`. At bare minimum, a db-config file is needed, here's [an example](https://github.com/rudderlabs/rudder-integrations-config/blob/develop/src/configurations/destinations/fullstory/db-config.json) of the same for FullStory destination. Duplicate it in the directory for your integration config folder and change the relevant values for your integration.

Alternatively, the easier path to do this is by running a script which will generate these files for you. For this, first create a copy of this `[test/configData/inputData.json](https://github.com/rudderlabs/rudder-integrations-config/blob/develop/test/configData/inputData.json)` and adjust it to what you want to see in the RudderStack dashboard ui. And use that placeholder file in the following command

`python3 scripts/configGenerator.py &lt;path of the placeholder file>` 

Run this command from the root directory of the rudder-integrations-config repo. The PR can then be raised after checking if everything looks good.


### 6. Run the transformer locally

```bash

nvm use v20

npm ci

npm run build:start

```

### References

* [Contributing.md](https://github.com/rudderlabs/rudder-server/blob/master/CONTRIBUTING.md\) in all github repositories
* [https://www.rudderstack.com/docs/resources/community/](https://www.rudderstack.com/docs/resources/community/)
* [https://www.rudderstack.com/docs/event-spec/standard-events/](https://www.rudderstack.com/docs/event-spec/standard-events/)
* [RudderStack Workflow Engine](https://github.com/rudderlabs/rudder-workflow-engine)
* [RudderStack JSON Templating Engine](https://github.com/rudderlabs/rudder-json-template-engine)
* [Recording of the community event for new contributors](https://youtu.be/OD2vCYG-P7k?feature=shared)

We look forward to your feedback on improving this project.

<!----variable's---->

[slack]: https://resources.rudderstack.com/join-rudderstack-slack
[issue]: https://github.com/rudderlabs/rudder-transformer/issues/new
[cla]: https://forms.gle/845JRGVZaC6kPZy68
[config-generator]: https://github.com/rudderlabs/config-generator
