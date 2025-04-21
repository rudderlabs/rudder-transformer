import { ProcessorTestData } from '../../../testTypes';
import {
  generateMetadata,
  generateSimplifiedIdentifyPayload,
  transformResultBuilder,
} from '../../../testUtils';
import { destination, commonHeaders, endpoints } from '../commonConfig';

const endpoint = endpoints.IDENTIFY;

export const identifyTestData: ProcessorTestData[] = [
  {
    id: 'userpilot-identify-test-1',
    name: 'userpilot',
    description: 'Identify user test with company object',
    scenario: 'Business',
    successCriteria:
      'Response should contain user profile with company object and status code should be 200',
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
            message: generateSimplifiedIdentifyPayload({
              userId: 'customUserID',
              context: {
                traits: {
                  name: 'John Doe',
                  title: 'CEO',
                  email: 'name.surname@domain.com',
                  company: {
                    id: '12345',
                    name: 'Company123',
                  },
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
                metadata: {
                  city: 'Austin',
                  company: {
                    id: '12345',
                    name: 'Company123',
                  },
                  country: 'US',
                  email: 'name.surname@domain.com',
                  name: 'John Doe',
                  phone: '123-456-7890',
                  postalCode: '12345',
                  rating: 'Hot',
                  state: 'TX',
                  street: 'Sample Address',
                  title: 'CEO',
                },
                user_id: 'customUserID',
                company: {
                  id: '12345',
                  name: 'Company123',
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
  {
    id: 'userpilot-identify-test-2',
    name: 'userpilot',
    description: 'Identify user test without company object',
    scenario: 'Business',
    successCriteria:
      'Response should contain user profile without company object and status code should be 200',
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
            message: generateSimplifiedIdentifyPayload({
              userId: 'customUserID',
              context: {
                traits: {
                  name: 'John Doe',
                  title: 'CEO',
                  email: 'name.surname@domain.com',
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
                metadata: {
                  city: 'Austin',
                  country: 'US',
                  email: 'name.surname@domain.com',
                  name: 'John Doe',
                  phone: '123-456-7890',
                  postalCode: '12345',
                  rating: 'Hot',
                  state: 'TX',
                  street: 'Sample Address',
                  title: 'CEO',
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
