import { ProcessorTestData } from '../../../testTypes';
import { generateMetadata, transformResultBuilder } from '../../../testUtils';
import { destType, channel, destination, getHeader } from '../common';

export const impressions: ProcessorTestData[] = [
  {
    id: 'Impressions-test',
    name: destType,
    description: 'Impressions call: Example Impression Event',
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
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: transformResultBuilder({
              method: 'GET',
              endpoint: destination.Config.apiBaseUrl + '?action=impression',
              headers: getHeader,
              userId: '',
              params: {
                trackingData: 'dummy-tracking-data',
                rank: 1,
                beaconIssued: '2024-03-04T15:32:56.409Z',
                ts: '2024-03-04T15:32:56.409Z',
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
