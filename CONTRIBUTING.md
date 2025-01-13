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
4. Submit a pull request against this repo's `main` branch.
   - Include instructions on how to test your changes.
5. Your branch may be merged once all configured checks pass, including:
   - A review from appropriate maintainers

### Are you developing a new Integration with us?

1. Fork this repo, develop and test your code changes. See the project's [README](README.md) for further information about working in this repository.
2. Submit a pull request against this repo's `main` branch.
   - Include instructions on how to test your changes.
3. Your branch may be merged once all configured checks pass, including:
   - A review from appropriate maintainers

## Committing

We prefer squash or rebase commits so that all changes from a branch are
committed to main branch as a single commit. All pull requests are squashed when
merged, but rebasing prior to merge gives you better control over the commit
message.

----

Now, that you have a basic overview of the contibution guidelines. Let's dive into a detailed guide to contribute by creating a new custom RudderStack integration.

## Building your first custom RudderStack **source** integration

Before starting to work on your first RudderStack integration, it is highly recommended to get a high-level overview of [RudderStack Event Specification](https://www.rudderstack.com/docs/event-spec/standard-events/).



* When developing a **source integration**, you’ll be transforming your events data received from the source to this specification.
* When developing a **destination integration**, you’ll be parsing the event data according to this event spec and transforming it to your destination’s data spec.


### Overview of integration development journey



1. Add integration code to [rudder-transformer](https://github.com/rudderlabs/rudder-transformer) `src/v1/sources` or `src/cdk/v2/destinations` folder \
This is the codebase that controls how raw event data (received from the source) is transformed to RudderStack Event Data Specification and then finally to the destination specific data format
2. Add RudderStack UI configurations in [rudder-integrations-config](https://github.com/rudderlabs/rudder-integrations-config) `src/configurations/sources` or `src/configurations/destinations` folder \
This enables your integration users to setup/configure the integration via RudderStack Dashboard
3. Write the documentation for your integration (or share the [integration plan document](https://rudderstacks.notion.site/Integration-planning-document-example-Slack-Source-integration-46863d6041ec48258f9c5433eab93b28?pvs=25) with the RudderStack team)
4. RudderStack team will deploy your integration to production and post an announcement in the [Release Notes](https://www.rudderstack.com/docs/releases/)

RudderStack team will be available to help you by giving feedback and answering questions either directly on your GitHub PR or the [RudderStack Slack community](https://www.rudderstack.com/join-rudderstack-slack-community/). Before diving into code, writing an integration plan document helps a lot, here’s an [example document](https://rudderstacks.notion.site/Integration-planning-document-example-Slack-Source-integration-46863d6041ec48258f9c5433eab93b28?pvs=25).


### 1. Setup rudder-transformer and understand the code structure

Setup [rudder-transformer](https://github.com/rudderlabs/rudder-transformer) on your local machine



* Clone [this repository](https://github.com/rudderlabs/rudder-transformer)
* Setup the repository with `npm run setup`
* Build the service with `npm run build:clean`
* Start the server with `npm start`

Understand the code structure



* `src/v1/sources` - Source integrations
* `src/cdk/v2/destinations` - Destination integrations
* `src/v0` and `src/v1` have older integrations, will be useful only if you’re fixing a bug or adding feature in older integrations
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
 * src/v0/sources/slack/transform.js
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

You’ll need some API request client (e.g. Postman, Bruno, etc.) to make a POST test request to 

`/{$integration-version-type e.g. v0 or v1}/{$integration-type e.g. sources or destinations}/{$integration-name e.g. slack}`



* Request endpoint example for Slack source developed under v0 folder - `POST /v0/sources/slack`
* Body - An array of event data object received from the source i.e. `[{ …eventData }]`
* Headers - `Content-Type: application/json`

Depending upon your integration behavior for different types of event, you can get different types of output.


##### Testing standard event response

This is what you’d want to do most of the time. The standard case, when you only transform the incoming event and hand it over to RudderStack to deliver to the destination.

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
       body: ...base64EncodedResponseBody, // e.g. eyJjaGFsbG2UiOiIzZVpicncxYUIxMEZFTUFHQVpkNEZ5RlEifQ (base64 encoding of the response body)
       contentType: ...contentType // e.g. application/json
     },
     statusCode: ...httpStatusCode, // e.g. 200
  }
]
```

### 4. Write automated tests

Follow the test structure similar to other integrations in `test/integrations/sources` or `test/integrations/destinations`.

You may reuse the same request data from the manual tests i.e. use them in place of `replaceThisWithYourEventPayloadProps` and `replaceThisWithYourTransformedEventOutput` (including the enclosing `[{ }]`). But make sure to redact any personal or secret information.

Here’s an example

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


### 5. Add RudderStack UI configurations in integrations-config

Add configuration for your integration in [rudder-integrations-config](https://github.com/rudderlabs/rudder-integrations-config) repo under `src/configurations/sources/` or `src.configurations/destinations`. At bare minimum, a db-config file is needed, here’s [an example](https://github.com/rudderlabs/rudder-integrations-config/blob/develop/src/configurations/sources/slack/db-config.json) of the same for Slack source. Duplicate it in the directory for your integration config folder and change the relevant values for your integration.

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

* When developing a **destination integration**, you’ll be transforming the data from RudderStack Event Specification to your target destination’s data specification.
* When developing a **source integration**, you’ll be transforming your events data received from the source to RudderStack Event Specification.

In this tutorial, we will specifically focus on developing a destination integration.


### Overview of integration development journey


1. Add integration code to [rudder-transformer](https://github.com/rudderlabs/rudder-transformer) `src/cdk/v2/destinations` folder. This is the codebase that controls how raw event data from [RudderStack Event Data Specification](https://www.rudderstack.com/docs/event-spec/standard-events/) to destination specific data format
2. Add RudderStack UI configurations in [rudder-integrations-config](https://github.com/rudderlabs/rudder-integrations-config) `src/configurations/destinations` folder \
This enables your integration users to setup/configure the integration via RudderStack Dashboard
3. Write the documentation for your integration (or share the [integration plan document](https://rudderstacks.notion.site/Integration-planning-document-example-Slack-Source-integration-46863d6041ec48258f9c5433eab93b28?pvs=25) with the RudderStack team)
4. RudderStack team will deploy your integration to production and post an announcement in the [Release Notes](https://www.rudderstack.com/docs/releases/)

RudderStack team will be available to help you by giving feedback and answering questions either directly on your GitHub PR or the [RudderStack Slack community](https://www.rudderstack.com/join-rudderstack-slack-community/). Before diving into code, writing an integration plan document helps a lot, here’s an [example document](https://rudderstacks.notion.site/Integration-planning-document-example-Slack-Source-integration-46863d6041ec48258f9c5433eab93b28?pvs=25).


### 1. Setup rudder-transformer and understand the code structure

Setup [rudder-transformer](https://github.com/rudderlabs/rudder-transformer) on your local machine



* Clone [this repository](https://github.com/rudderlabs/rudder-transformer)
* Setup the repository with `npm run setup`
* Build the service with `npm run build:clean`
* Start the server with `npm start`

Understand the code structure


* `src/cdk/v2/destinations` - Destination integrations
* `src/v1/sources` - Source integrations
* `src/v0` and `src/v1` - Older integrations. If you’re fixing bugs in one of the older integrations, you might find your integration in these folders if it is an older integration.
* `test/integrations/sources` - Integration tests for source integrations
* `test/integrations/destinations` - Integration tests for destination integrations


### 2. Write code for a destination integration

Here, we will explain the code for a destination integration for single event processing as well as batch events processing.

Before diving into the code, we recommend exploring the code for different destinations under the `src/cdk/v2/destinations` folder. This is the same structure you'll follow for your integration. This is a high-level overview of the code structure which you’ll be creating



* `src/cdk/v2/destinations/**my_destination**` (follow the snake_case naming convention) - Your integration code for `my_destination`
* `src/cdk/v2/destinations/**my_destination/procWorkflow.yaml**` (processor workflow) - This is where you write the `yaml` configuration specifying how to transform an event from standard RudderStack format to destination format. This `yaml` code will later automatically get converted to javascript code using our RudderStack Workflow Engine. You will need to familiarize yourself with [RudderStack Workflow Engine](https://github.com/rudderlabs/rudder-workflow-engine) to understand what key/value you should be using. We will cover a quickstart for the same in this tutorial but whenever in doubt, refer to the [RudderStack Workflow Engine docs/readme](https://github.com/rudderlabs/rudder-workflow-engine).
* `src/cdk/v2/destinations/**my_destination/rtWorflow.yaml**` (router workflow) - For batch events integration code. This will call the processor workflow to process individual events.
* `src/cdk/v2/destinations/**my_destination/config.js**` - Configurations for the integration

Before we dive into the code for a simple transformation for a destination, let’s address the potential questions you might have at this point

**Why is the integration code for destination transformation written in `yaml` instead of `javascript`?**

`yaml` is a great language for data serialization. It also makes the code short and consistent to read. This is why we moved from `javascript` to `yaml` for the data transformation code. It helped us move to a config-driven approach.

**Does using `yaml` limit our flexibility to write complex transformation logic?**

No. We use a templating language to support any kind of complex transformation logic in `yaml`, so we have the extensibility as well as the key benefit - concise and simple `yaml` for common transformation requirements. This was made possible by the RudderStack Workflow Engine.

**What exactly is RudderStack Workflow Engine?**

In the [rudder-transformer](https://github.com/rudderlabs/rudder-transformer/) service, we handle data transformation from customer events to destination events. The rudder-transformer service uses the [RudderStack Workflow Engine](https://github.com/rudderlabs/rudder-workflow-engine) to organize this transformation process into clear, manageable steps. This includes validation, data mapping, enriching with API calls, and handling various event types. These steps were earlier implemented in JavaScript, which, while flexible, was challenging to maintain and standardize. To improve readability, testability, and development speed, we transitioned to a config-driven workflow engine using template languages like JSONata and JsonTemplate, with the capability to extend to additional languages. In short, this is what helped us move transformation code from `javascript` to `yaml`.

**To develop an integration, how much do I need to understand about RudderStack Workflow Engine?**

Not more than what can not be covered in 10 mins. The RudderStack Workflow Engine will convert the `yaml` file to `javascript` for transformation. The key question is - how to write this `yaml` file? And the answer lies in the `keys` you can use in the `yaml`. Get familiar following keys, and you should be able to write your first integration



1. `bindings` - To import external javascript functions and data
    1. `path` - The file path where we want to import from e.g. `./config` (can omit the extension `.js`)
    2. `name` - The name by which we want import e.g. `Config` (can be accessed as `$Config` or `$Config.something`)
    3. `exportAll` - If `true`, imports everything from the file. Default: `false` i.e. imports only the object matching the `name`
2. **`steps` - To express the destination transformation logic as a series of steps. If you have used GitHub action, this will sound familiar.**
    4. `name` (mandatory) - A name to track outputs
    5. `description` - Mention what does this step do
    6. `functionName` - The function we want to execute in this step. This function must be defined in the bindings and must have following definition \
        ```javascript
            (input: any, bindings: Record&lt;string, any>) => {
            error?: any,
            output?: any
          }
        ```

    7. `condition` - The step will get executed only when this condition is satisfied
    8. `inputTemplate` - To customize the input. Passed while executing the step. By default, all steps receive the same input as the workflow input, but when we want to modify the input before executing the step, we can use this feature.
    9. `contextTemplate` - By default, all steps receive the current context, but we can use this feature when we want to modify the context before executing the step. This is useful when using external workflows, workflow steps, or template paths.
    10. `loopOverInput` - We can use this feature when the input is an array, and we want to execute the step logic for each element independently. This is mainly used for batch processing.
    11. `steps` - You may define a series of steps inside a step. We will call such a step a `WorkflowStep` as opposed to `SimpleStep`.
    12. `workflowStepPath` - We can import the steps from another `yaml` file
    13. `batches` - To batch the inputs using filter and by length
        1. `key` - The input name e.g. “heroes”
        2. `filter` - The filter logic e.g. `.type === “hero”`
        3. `size` - The size of the batch

A simple example of `procWorkflow.yaml` looks like this:

```yaml
bindings:
  - name: EventType
    path: ../../../../constants
  - path: ../../bindings/jsontemplate
    exportAll: true
  - name: removeUndefinedAndNullValues
    path: ../../../../v0/util

steps:
  - name: validateInput
    template: |
      $.assert(.message.type, "message Type is not present. Aborting message.");
      $.assert(.message.type in {{$.EventType.([.TRACK, .IDENTIFY])}}, 
        "message type " + .message.type + " is not supported");
  - name: prepareContext
    template: |
      $.context.messageType = .message.type.toLowerCase();
      $.context.payload = {};
      $.context.finalHeaders = {
          "authorization": "Basic " + .destination.Config.apiKey,
          "content-type": "application/json"
        };
  - name: identifyPayload
    condition: $.context.messageType == "identify"
    template: |
      $.context.endpoint = "https://api.fullstory.com/v2/users";
      $.context.payload.properties = .message.traits ?? .message.context.traits;
      $.context.payload.uid = .message.userId;
      $.context.payload.email = .message.context.traits.email;
      $.context.payload.display_name = .message.context.traits.name;

  - name: trackPayload
    condition: $.context.messageType == "track"
    template: |
      $.context.endpoint = "https://api.fullstory.com/v2/events";
      $.context.payload.name = .message.event;
      $.context.payload.properties = .message.properties;
      $.context.payload.timestamp = .message.originalTimestamp;
      $.context.payload.context = {};

  - name: validateEventName
    condition: $.context.messageType == "track"
    template: |
      $.assert(.message.event, "event is required for track call")

  - name: mapContextFieldsForTrack
    condition: $.context.messageType == "track"
    template: |
      $.context.payload.context.browser = {
        "url": .message.context.page.url,
        "user_agent": .message.context.userAgent,
        "initial_referrer": .message.context.page.initial_referrer,
      };
      $.context.payload.context.mobile = {
        "app_name": .message.context.app.name,
        "app_version": .message.context.app.version,
      };
      $.context.payload.context.device = {
        "manufacturer": .message.context.device.manufacturer,
        "model": .message.context.device.model,
      };
      $.context.payload.context.location = {
        "ip_address": .message.context.ip,
        "latitude": .message.properties.latitude,
        "longitude": .message.properties.longitude,
        "city": .message.properties.city,
        "region": .message.properties.region,
        "country": .message.properties.country,
      };

  - name: mapIdsForTrack
    condition: $.context.messageType == "track"
    template: |
      $.context.payload.session = {
        "id": .message.properties.sessionId,
        "use_most_recent": .message.properties.useMostRecent,
      };
      $.context.payload.user = {
        "uid": .message.properties.userId ?? .message.userId,
      }

  - name: cleanPayload
    template: |
      $.context.payload = $.removeUndefinedAndNullValues($.context.payload);
  - name: buildResponseForProcessTransformation
    template: |
      $.context.payload.({
         "body": {
           "JSON": .,
           "JSON_ARRAY": {},
           "XML": {},
           "FORM": {}
         },
         "version": "1",
         "type": "REST",
         "method": "POST",
         "endpoint": $.context.endpoint,
         "headers": $.context.finalHeaders,
         "params": {},
         "files": {}
       })
```

### 3. Test your destination integration


#### Manual testing

You’ll need some API request client (e.g. Postman, Bruno, curl, etc.) for manual testing. 



* Make a `POST` request to this endpoint - `POST /v1/destinations/my_integration`
* Body - An array of event data object received from the source i.e. `[{ …eventData }]`
* Headers - `Content-Type: application/json`

Depending upon your integration behavior for different types of event, you can get different types of output.


##### Testing standard event response

This is what you’d want to do most of the time. The standard case, when you only transform the incoming event and hand it over to RudderStack to deliver to the destination.

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

Follow the test structure similar to other integrations in `test/integrations/destinations`. Here’s an overview of the test code structure which you will be creating



* `test/integrations/destinations/my_destination` - To contain all your test code for `my_destination`
* `test/integrations/destinations/my_destination/processor` - Test code for single event processing logic
    * `data.ts`
    * `identify.ts` - Test for [`identify`](https://www.rudderstack.com/docs/event-spec/standard-events/identify/) event
    * `track.ts` - Test for [`track`](https://www.rudderstack.com/docs/event-spec/standard-events/track/) event
* `test/integrations/destinations/my_destination/router` - Test code for batch events processing logic

You may reuse the same request data from the manual tests i.e. use them in place of `replaceThisWithYourEventPayloadProps` and `replaceThisWithYourTransformedEventOutput` (including the enclosing `[{ }]`). But make sure to redact any personal or secret information.

Here’s an example

```javascript
export const data = [
  {
    name: 'fullstory',
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
              Name: 'Fullstory',
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'dummyfullstoryAPIKey',
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
                  name: 'Product Reviewed',
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
              endpoint: 'https://api.fullstory.com/v2/events',
              headers: {
                authorization: 'Basic dummyfullstoryAPIKey',
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
    name: 'fullstory',
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
              Name: 'Fullstory',
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'dummyfullstoryAPIKey',
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
              'event is required for track call: Workflow: procWorkflow, Step: validateEventName, ChildStep: undefined, OriginalError: event is required for track call',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              implementation: 'cdkV2',
              destType: 'FULLSTORY',
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
    name: 'fullstory',
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
              Name: 'Fullstory',
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'fullstoryAPIKey',
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
              endpoint: 'https://api.fullstory.com/v2/users',
              headers: {
                authorization: 'Basic fullstoryAPIKey',
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
    name: 'fullstory',
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
              Name: 'Fullstory',
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                apiKey: 'fullstoryAPIKey',
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
              endpoint: 'https://api.fullstory.com/v2/users',
              headers: {
                authorization: 'Basic fullstoryAPIKey',
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



* To test Slack destination -  `npm run test:ts -- component --destination=my_destination`

These tests will automatically be run on each commit, making sure that any new development does not break the existing integrations.


### 5. Add RudderStack UI configurations in integrations-config

Add configuration for your destination integration in [rudder-integrations-config](https://github.com/rudderlabs/rudder-integrations-config) repo under `src.configurations/destinations`. At bare minimum, a db-config file is needed, here’s [an example](https://github.com/rudderlabs/rudder-integrations-config/blob/develop/src/configurations/destinations/fullstory/db-config.json) of the same for FullStory destination. Duplicate it in the directory for your integration config folder and change the relevant values for your integration.

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
