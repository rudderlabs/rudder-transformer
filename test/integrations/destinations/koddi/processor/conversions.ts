import { ProcessorTestData } from '../../../testTypes';
import { generateMetadata, transformResultBuilder } from '../../../testUtils';
import {
  destType,
  channel,
  destination,
  postHeader,
  bidders,
  alternateBidders,
  processorInstrumentationErrorStatTags,
} from '../common';

export const conversions: ProcessorTestData[] = [
  {
    id: 'Conversions-test-1',
    name: destType,
    description: 'Conversions call: Example Conversions Event',
    scenario: 'Framework+Business',
    successCriteria:
      'Response should contain the input payload with mappings configured in transformer and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'POST',
              endpoint: destination.Config.apiBaseUrl + '/conversion',
              headers: postHeader,
              userId: '',
              JSON: {
                client_name: destination.Config.clientName,
                culture: 'en-US',
                currency: 'USD',
                transaction_id: 'ABC123',
                unixtime: 1709566376,
                user_guid: 'userId123',
                user_ip: '127.0.0.1',
                bidders: bidders,
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'Conversions-test-2',
    name: destType,
    description: 'Conversions call: Example Conversions Event with missing required field',
    scenario: 'Framework+Business',
    successCriteria: 'Response should contain error and status code should be 400',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                alternateBidders,
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
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              'Missing required value from "properties.bidders": Workflow: procWorkflow, Step: preparePayload, ChildStep: undefined, OriginalError: Missing required value from "properties.bidders"',
            statusCode: 400,
            metadata: generateMetadata(1),
            statTags: processorInstrumentationErrorStatTags,
          },
        ],
      },
    },
  },
];
