import {
  Connection,
  Destination,
  Metadata,
  ProcessorTransformationRequest,
  RouterTransformationRequestData,
  RudderMessage,
} from '../../types';
import { ControllerUtility } from './index';
import lodash from 'lodash';

type timestampTestCases = {
  caseName: string;
  expectedOutputEvents: Array<ProcessorTransformationRequest | RouterTransformationRequestData>;
  inputEvents: Array<ProcessorTransformationRequest | RouterTransformationRequestData>;
};

const metadata = {
  sourceId: '27O0bmEEx3GgfmEhZHUcPwJQVWC',
  workspaceId: '27O0bhB6p5ehfOWeeZlOSsSDTLg',
  namespace: '',
  instanceId: '1',
  sourceType: 'HTTP',
  sourceCategory: '',
  trackingPlanId: '',
  trackingPlanVersion: 0,
  sourceTpConfig: {},
  mergedTpConfig: {},
  destinationId: '2JH9GMQf2YFJFaTw7rz1pxHAJPx',
  jobRunId: '',
  jobId: 1,
  sourceBatchId: '',
  sourceJobId: '',
  sourceJobRunId: '',
  sourceTaskId: '',
  sourceTaskRunId: '',
  recordId: {},
  destinationType: 'WEBHOOK',
  messageId: 'e3a51e9a-6313-4389-ae73-07e487c8d9d0',
  oauthAccessToken: '',
  messageIds: [],
  rudderId: '<<>>2073230<<>>2564871',
  receivedAt: '2022-12-23T00:29:10.189+05:30',
  eventName: 'Test',
  eventType: 'track',
  sourceDefinitionId: '1b6gJdqOPOCadT3cddw8eidV591',
  destinationDefinitionId: '',
  transformationId: '',
} as unknown as Metadata;

const destination: Destination = {
  ID: 'string',
  Name: 'string',
  DestinationDefinition: {
    ID: 'defid1',
    Name: 'INTERCOM',
    DisplayName: 'intercom',
    Config: {},
  },
  Config: {},
  Enabled: true,
  WorkspaceID: 'wspId',
  Transformations: [],
};

const message: RudderMessage = {
  anonymousId: '2073230',
  event: 'Test',
  messageId: 'e3a51e9a-6313-4389-ae73-07e487c8d9d0',
  originalTimestamp: '2022-12-23T00:29:12.117+05:30',
  channel: 'sources',
  properties: {
    timestamp: '2023-01-23T00:29:12.117+05:30',
  },
  sentAt: '2022-12-23T00:29:12.117+05:30',
  timestamp: '2023-01-23T00:29:12.117+05:30',
  type: 'track',
  userId: '2564871',
};

function getMetadata(overrides: Metadata): Metadata {
  return lodash.merge({}, metadata, overrides);
}

function getDestination(overrides: Destination): Destination {
  return lodash.merge({}, destination, overrides);
}

function getMessage(overrides: object): RudderMessage {
  return lodash.merge({}, message, overrides);
}

function getMessageWithShallowMerge(overrides: object): RudderMessage {
  return lodash.assign({}, message, overrides);
}

const timestampEventsCases: timestampTestCases[] = [
  {
    caseName: 'when events(all track), timestamp should be taken from properties.timestamp',
    expectedOutputEvents: [
      {
        message: message,
        metadata: metadata,
        destination: destination,
      },
    ],
    inputEvents: [
      {
        message: getMessage({
          timestamp: '2022-12-23T00:29:10.188+05:30',
        }),
        metadata: metadata,
        destination: destination,
      },
    ],
  },
  {
    caseName:
      'when events(all track) without properties.timestamp, timestamp should be taken from timestamp',
    expectedOutputEvents: [
      {
        message: getMessageWithShallowMerge({
          properties: {
            someTime: '2023-01-23T00:29:12.117+05:30',
          },
          timestamp: '2022-11-22T00:29:10.188+05:30',
        }),
        metadata: metadata,
        destination: destination,
      },
    ],
    inputEvents: [
      {
        message: getMessageWithShallowMerge({
          properties: {
            someTime: '2023-01-23T00:29:12.117+05:30',
          },
          timestamp: '2022-11-22T00:29:10.188+05:30',
        }),
        metadata: metadata,
        destination: destination,
      },
    ],
  },
  {
    caseName:
      'when events(all identify) without context.timestamp, timestamp should be taken from timestamp',
    expectedOutputEvents: [
      {
        message: getMessage({
          context: {
            timestamp: '2023-01-12T00:29:12.117+05:30',
          },
          timestamp: '2023-01-12T00:29:12.117+05:30',
          type: 'identify',
        }),
        metadata: metadata,
        destination: destination,
      },
    ],
    inputEvents: [
      {
        message: getMessage({
          context: {
            timestamp: '2023-01-12T00:29:12.117+05:30',
          },
          timestamp: '2022-11-22T00:29:10.188+05:30',
          type: 'identify',
        }),
        metadata: metadata,
        destination: destination,
      },
    ],
  },
  {
    caseName:
      'when proc events(identify, track, group) are mixed, timestamp should be taken from relevant places for identify & track, skipped for group',
    expectedOutputEvents: [
      {
        message: getMessage({
          context: {
            traits: {
              timestamp: '2023-01-22T00:29:12.117+05:30',
            },
          },
          timestamp: '2023-01-22T00:29:12.117+05:30',
          type: 'identify',
        }),
        metadata: metadata,
        destination: destination,
      },
      {
        message: getMessage({
          anonymousId: '2073231',
          traits: {
            timestamp: '2023-01-11T00:29:12.117+05:30',
          },
          timestamp: '2023-01-11T00:29:12.117+05:30',
          type: 'identify',
        }),
        metadata: metadata,
        destination: destination,
      },
      {
        message: getMessage({
          anonymousId: '2073232',
          properties: {
            timestamp: '2023-01-13T00:29:12.117+05:30',
          },
          timestamp: '2023-01-13T00:29:12.117+05:30',
        }),
        metadata: metadata,
        destination: destination,
      },
      {
        message: getMessage({
          anonymousId: '2073232',
          properties: {
            timestamp: '2023-01-13T00:29:12.117+05:30',
          },
          timestamp: '2022-11-22T00:29:10.188+05:30',
          type: 'group',
        }),
        metadata: metadata,
        destination: destination,
      },
    ],
    inputEvents: [
      {
        message: getMessage({
          context: {
            traits: {
              timestamp: '2023-01-22T00:29:12.117+05:30',
            },
          },
          timestamp: '2022-11-22T00:29:10.188+05:30',
          type: 'identify',
        }),
        metadata: metadata,
        destination: destination,
      },
      {
        message: getMessage({
          anonymousId: '2073231',
          traits: {
            timestamp: '2023-01-11T00:29:12.117+05:30',
          },
          timestamp: '2022-11-22T00:29:10.188+05:30',
          type: 'identify',
        }),
        metadata: metadata,
        destination: destination,
      },
      {
        message: getMessage({
          anonymousId: '2073232',
          properties: {
            timestamp: '2023-01-13T00:29:12.117+05:30',
          },
          timestamp: '2022-11-22T00:29:10.188+05:30',
        }),
        metadata: metadata,
        destination: destination,
      },
      {
        message: getMessage({
          anonymousId: '2073232',
          properties: {
            timestamp: '2023-01-13T00:29:12.117+05:30',
          },
          timestamp: '2022-11-22T00:29:10.188+05:30',
          type: 'group',
        }),
        metadata: metadata,
        destination: destination,
      },
    ],
  },
  {
    caseName:
      'when a mix of VDM enabled & non-VDM destinations are available, the timestamp will be applied to only non-VDM destination',
    expectedOutputEvents: [
      {
        message: getMessage({
          context: {
            traits: {
              timestamp: '2023-01-22T00:29:12.117+05:30',
            },
            mappedToDestination: true,
          },
          timestamp: '2022-11-22T00:29:10.188+05:30',
          type: 'identify',
        }),
        metadata: metadata,
        destination: destination,
      },
      {
        message: getMessage({
          anonymousId: '2073231',
          traits: {
            timestamp: '2023-01-11T00:29:12.117+05:30',
          },
          timestamp: '2023-01-11T00:29:12.117+05:30',
          type: 'identify',
        }),
        metadata: getMetadata({
          destinationId: '2JH9GMQf2YFJFaTw7rz1pxHAJPy',
        } as any),
        destination: getDestination({
          ID: 'string-2',
        } as any),
      },
      {
        message: getMessage({
          anonymousId: '2073232',
          context: {
            mappedToDestination: true,
          },
          properties: {
            timestamp: '2023-01-13T00:29:12.117+05:30',
          },
          timestamp: '2022-11-22T00:29:10.188+05:30',
        }),
        metadata: metadata,
        destination: destination,
      },
      {
        message: getMessage({
          anonymousId: '2073232',
          context: {
            mappedToDestination: true,
          },
          properties: {
            timestamp: '2023-01-13T00:29:12.117+05:30',
          },
          timestamp: '2022-11-22T00:29:10.188+05:30',
          type: 'group',
        }),
        metadata: metadata,
        destination: destination,
      },
    ],
    inputEvents: [
      {
        message: getMessage({
          context: {
            traits: {
              timestamp: '2023-01-22T00:29:12.117+05:30',
            },
            mappedToDestination: true,
          },
          timestamp: '2022-11-22T00:29:10.188+05:30',
          type: 'identify',
        }),
        metadata: metadata,
        destination: destination,
      },
      {
        message: getMessage({
          anonymousId: '2073231',
          traits: {
            timestamp: '2023-01-11T00:29:12.117+05:30',
          },
          timestamp: '2022-11-22T00:29:10.188+05:30',
          type: 'identify',
        }),
        metadata: getMetadata({
          destinationId: '2JH9GMQf2YFJFaTw7rz1pxHAJPy',
        } as any),
        destination: getDestination({
          ID: 'string-2',
        } as any),
      },
      {
        message: getMessage({
          anonymousId: '2073232',
          context: {
            mappedToDestination: true,
          },
          properties: {
            timestamp: '2023-01-13T00:29:12.117+05:30',
          },
          timestamp: '2022-11-22T00:29:10.188+05:30',
        }),
        metadata: metadata,
        destination: destination,
      },
      {
        message: getMessage({
          anonymousId: '2073232',
          context: {
            mappedToDestination: true,
          },
          properties: {
            timestamp: '2023-01-13T00:29:12.117+05:30',
          },
          timestamp: '2022-11-22T00:29:10.188+05:30',
          type: 'group',
        }),
        metadata: metadata,
        destination: destination,
      },
    ],
  },
];

describe('controller utility tests -- handleTimestampInEvents for retl connections', () => {
  test.each(timestampEventsCases)(
    '$caseName',
    ({ inputEvents, expectedOutputEvents: outputEvents }) => {
      const actualEvents = ControllerUtility.handleTimestampInEvents(inputEvents);
      expect(actualEvents).toStrictEqual(outputEvents);
    },
  );
});
