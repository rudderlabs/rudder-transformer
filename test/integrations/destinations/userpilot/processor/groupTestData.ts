import { ProcessorTestData } from '../../../testTypes';
import {
  generateMetadata,
  generateSimplifiedGroupPayload,
  transformResultBuilder,
} from '../../../testUtils';
import { destination, commonHeaders, endpoints } from '../commonConfig';

const endpoint = endpoints.GROUP;

export const groupTestData: ProcessorTestData[] = [
  {
    id: 'userpilot-group-test-1',
    name: 'userpilot',
    description: 'Group (company) test',
    scenario: 'Business',
    successCriteria: 'Response should contain company data and status code should be 200',
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
            message: generateSimplifiedGroupPayload({
              userId: 'customUserID',
              groupId: 'sample_group_id',
              traits: {
                name: 'Apple Inc.',
                location: 'USA',
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
                company_id: 'sample_group_id',
                metadata: {
                  location: 'USA',
                  name: 'Apple Inc.',
                },
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
