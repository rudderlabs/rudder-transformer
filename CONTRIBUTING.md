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

## Building your first custom RudderStack integration

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


We look forward to your feedback on improving this project.

<!----variable's---->

[slack]: https://resources.rudderstack.com/join-rudderstack-slack
[issue]: https://github.com/rudderlabs/rudder-transformer/issues/new
[cla]: https://forms.gle/845JRGVZaC6kPZy68
[config-generator]: https://github.com/rudderlabs/config-generator
