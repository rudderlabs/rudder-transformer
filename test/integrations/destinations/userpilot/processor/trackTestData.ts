import { ProcessorTestData } from '../../../testTypes';
import {
  generateMetadata,
  generateSimplifiedTrackPayload,
  transformResultBuilder,
} from '../../../testUtils';
import { destination, commonHeaders, endpoints } from '../commonConfig';

const endpoint = endpoints.TRACK;

export const trackTestData: ProcessorTestData[] = [
  {
    id: 'userpilot-track-test-1',
    name: 'userpilot',
    description: 'Track event test',
    scenario: 'Business',
    successCriteria:
      'Response should contain event data with properties and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
          {
            destination,
            metadata: generateMetadata(1),
            message: generateSimplifiedTrackPayload({
              userId: 'customUserID',
              event: 'test track event 1',
              properties: {
                revenue: 30,
                currency: 'USD',
                user_actual_id: 12345,
              },
              context: {
                traits: {
                  name: 'John Doe',
                  title: 'CEO',
                  email: 'name.surname@domain.com',
                  company: 'Company123',
                  phone: '123-456-7890',
                  rating: 'Hot',
                  city: 'Austin',
                  postalCode: '12345',
                  country: 'US',
                  street: 'Sample Address',
                  state: 'TX',
                },
              },
              anonymousId: 'd681c65d-f3fd-4f2e-b9a7-d5c2ae3c8b9b',
            }),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            metadata: generateMetadata(1),
            output: transformResultBuilder({
              method: 'POST',
              endpoint,
              headers: commonHeaders,
              JSON: {
                event_name: 'test track event 1',
                metadata: {
                  currency: 'USD',
                  revenue: 30,
                  user_actual_id: 12345,
                },
                user_id: 'customUserID',
              },
              userId: '',
            }),
            statusCode: 200,
          },
        ],
      },
    },
  },
];
