import { RouterTransformationRequest } from '../../../../../src/types';
import { generateMetadata } from '../../../testUtils';
import {
  destType,
  channel,
  destination,
  getHeader,
  postHeader,
  RouterInstrumentationErrorStatTags,
  bidders,
} from '../common';

const routerRequest: RouterTransformationRequest = {
  input: [
    {
      destination,
      message: {
        type: 'track',
        channel,
        anonymousId: 'anonId123',
        userId: 'userId123',
        event: 'Example Impression Event',
        properties: {
          tracking_data: 'dummy-tracking-data',
          rank: 1,
          beacon_issued: '2024-03-04T15:32:56.409Z',
        },
        integrations: {
          All: true,
          koddi: {
            eventType: 'Impressions',
          },
        },
        originalTimestamp: '2024-03-04T15:32:56.409Z',
      },
      metadata: generateMetadata(1),
    },
    {
      destination,
      message: {
        type: 'track',
        channel,
        anonymousId: 'anonId123',
        userId: 'userId123',
        event: 'Example Clicks Event',
        properties: {
          tracking_data: 'dummy-tracking-data',
          rank: 1,
          beacon_issued: '2024-03-04T15:32:56.409Z',
        },
        integrations: {
          All: true,
          koddi: {
            eventType: 'Clicks',
          },
        },
        originalTimestamp: '2024-03-04T15:32:56.409Z',
      },
      metadata: generateMetadata(2),
    },
    {
      destination,
      message: {
        type: 'track',
        channel,
        anonymousId: 'anonId123',
        userId: 'userId123',
        event: 'Example Conversions Event',
        properties: {
          currency: 'USD',
          transaction_id: 'ABC123',
          bidders,
        },
        context: {
          locale: 'en-US',
          ip: '127.0.0.1',
        },
        integrations: {
          All: true,
          koddi: {
            eventType: 'Conversions',
          },
        },
        originalTimestamp: '2024-03-04T15:32:56.409Z',
      },
      metadata: generateMetadata(3),
    },
    {
      destination,
      message: {
        type: 'track',
        channel,
        anonymousId: 'anonId123',
        userId: 'userId123',
        event: 'Example Impression Event',
        properties: {
          rank: 1,
          beacon_issued: '2024-03-04T15:32:56.409Z',
        },
        integrations: {
          All: true,
          koddi: {
            eventType: 'Impressions',
          },
        },
        originalTimestamp: '2024-03-04T15:32:56.409Z',
      },
      metadata: generateMetadata(4),
    },
    {
      destination,
      message: {
        type: 'track',
        channel,
        anonymousId: 'anonId123',
        userId: 'userId123',
        properties: {
          tracking_data: 'dummy-tracking-data',
          rank: 1,
          beacon_issued: '2024-03-04T15:32:56.409Z',
        },
        integrations: {
          All: true,
          koddi: {
            eventType: 'Unknown',
          },
        },
        originalTimestamp: '2024-03-04T15:32:56.409Z',
      },
      metadata: generateMetadata(5),
    },
  ],
  destType,
};

export const data = [
  {
    id: 'koddi-router-test',
    name: destType,
    description: 'Basic Router Test to test payloads and missing field error',
    scenario: 'Framework',
    successCriteria:
      'Some events should be transformed successfully and some should fail for missing fields and status code should be 200',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: routerRequest,
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: false,
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'GET',
                endpoint: destination.Config.apiBaseUrl + '?action=impression',
                headers: getHeader,
                params: {
                  trackingData: 'dummy-tracking-data',
                  rank: 1,
                  beaconIssued: '2024-03-04T15:32:56.409Z',
                  ts: '2024-03-04T15:32:56.409Z',
                  clientName: destination.Config.clientName,
                },
                body: {
                  JSON: {},
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              destination,
              metadata: [generateMetadata(1)],
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'GET',
                endpoint: destination.Config.apiBaseUrl + '?action=click',
                headers: getHeader,
                params: {
                  trackingData: 'dummy-tracking-data',
                  rank: 1,
                  beaconIssued: '2024-03-04T15:32:56.409Z',
                  userGuid: 'userId123',
                  clientName: destination.Config.clientName,
                },
                body: {
                  JSON: {},
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              destination,
              metadata: [generateMetadata(2)],
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: destination.Config.apiBaseUrl + '/conversion',
                headers: postHeader,
                params: {},
                body: {
                  JSON: {
                    client_name: 'test-client',
                    culture: 'en-US',
                    currency: 'USD',
                    transaction_id: 'ABC123',
                    unixtime: 1709566376,
                    user_guid: 'userId123',
                    user_ip: '127.0.0.1',
                    bidders: bidders,
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              destination,
              metadata: [generateMetadata(3)],
              statusCode: 200,
            },
            {
              batched: false,
              error: 'Missing required value from "properties.tracking_data"',
              destination,
              metadata: [generateMetadata(4)],
              statTags: RouterInstrumentationErrorStatTags,
              statusCode: 400,
            },
            {
              batched: false,
              error: 'event type unknown is not supported',
              destination,
              metadata: [generateMetadata(5)],
              statTags: RouterInstrumentationErrorStatTags,
              statusCode: 400,
            },
          ],
        },
      },
    },
  },
];
