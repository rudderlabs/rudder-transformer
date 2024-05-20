import { ProcessorTestData } from '../../../testTypes';
import { generateMetadata, transformResultBuilder } from '../../../testUtils';
import { destType, channel, destination, getHeader } from '../common';

export const clicks: ProcessorTestData[] = [
  {
    id: 'Clicks-test',
    name: destType,
    description: 'Clicks call: Example Clicks Event',
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
              method: 'GET',
              endpoint: destination.Config.apiBaseUrl + '?action=click',
              headers: getHeader,
              userId: '',
              params: {
                trackingData: 'dummy-tracking-data',
                rank: 1,
                beaconIssued: '2024-03-04T15:32:56.409Z',
                userGuid: 'userId123',
                clientName: destination.Config.clientName,
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
];
