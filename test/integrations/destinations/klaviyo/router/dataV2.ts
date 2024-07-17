import { Destination } from '../../../../../src/types';
import { RouterTestData } from '../../../testTypes';
import { generateMetadata } from '../../../testUtils';
import { routerRequestV2 } from './commonConfig';
const destination: Destination = {
  ID: '123',
  Name: 'klaviyo',
  DestinationDefinition: {
    ID: '123',
    Name: 'klaviyo',
    DisplayName: 'klaviyo',
    Config: {},
  },
  Config: {
    privateApiKey: 'dummyPrivateApiKey',
    version: 'v2',
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};
const userProfileCommonEndpoint = 'https://a.klaviyo.com/api/profile-import';

const headers = {
  Authorization: 'Klaviyo-API-Key dummyPrivateApiKey',
  'Content-Type': 'application/json',
  Accept: 'application/json',
  revision: '2024-06-15',
};
const subscriptionRelations = {
  list: {
    data: {
      type: 'list',
      id: 'XUepkK',
    },
  },
};

export const dataV2: RouterTestData[] = [
  {
    id: 'klaviyo-router-150624-test-1',
    name: 'klaviyo',
    description: '150624 -> Basic Router Test to test multiple payloads',
    scenario: 'Framework',
    successCriteria: 'All the subscription events should be batched',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: routerRequestV2,
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: userProfileCommonEndpoint,
                headers,
                params: {},
                body: {
                  JSON: {
                    data: {
                      type: 'profile',
                      attributes: {
                        external_id: 'test',
                        email: 'test_1@rudderstack.com',
                        first_name: 'Test',
                        last_name: 'Rudderlabs',
                        phone_number: '+12 345 578 900',
                        anonymous_id: '97c46c81-3140-456d-b2a9-690d70aaca35',
                        title: 'Developer',
                        organization: 'Rudder',
                        location: {
                          city: 'Tokyo',
                          region: 'Kanto',
                          country: 'JP',
                          zip: '100-0001',
                        },
                        properties: { Flagged: false, Residence: 'Shibuya' },
                      },
                      meta: {
                        patch_properties: {},
                      },
                    },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: userProfileCommonEndpoint,
                  headers,
                  params: {},
                  body: {
                    JSON: {
                      data: {
                        type: 'profile',
                        attributes: {
                          external_id: 'test',
                          email: 'test@rudderstack.com',
                          first_name: 'Test',
                          last_name: 'Rudderlabs',
                          phone_number: '+12 345 578 900',
                          anonymous_id: '97c46c81-3140-456d-b2a9-690d70aaca35',
                          title: 'Developer',
                          organization: 'Rudder',
                          location: {
                            city: 'Tokyo',
                            region: 'Kanto',
                            country: 'JP',
                            zip: '100-0001',
                          },
                          properties: { Flagged: false, Residence: 'Shibuya' },
                        },
                        meta: {
                          patch_properties: {},
                        },
                      },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs',
                  headers,
                  params: {},
                  body: {
                    JSON: {
                      data: {
                        type: 'profile-subscription-bulk-create-job',
                        attributes: {
                          profiles: {
                            data: [
                              {
                                type: 'profile',
                                attributes: {
                                  email: 'test@rudderstack.com',
                                  phone_number: '+12 345 578 900',
                                  subscriptions: {
                                    email: { marketing: { consent: 'SUBSCRIBED' } },
                                    sms: { marketing: { consent: 'SUBSCRIBED' } },
                                  },
                                },
                              },
                              {
                                type: 'profile',
                                attributes: {
                                  email: 'test@rudderstack.com',
                                  phone_number: '+12 345 678 900',
                                  subscriptions: {
                                    email: { marketing: { consent: 'SUBSCRIBED' } },
                                  },
                                },
                              },
                            ],
                          },
                        },
                        relationships: subscriptionRelations,
                      },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [generateMetadata(2), generateMetadata(3)],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              metadata: [generateMetadata(4)],
              batched: false,
              statusCode: 400,
              error: 'Event type random is not supported',
              statTags: {
                destType: 'KLAVIYO',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                destinationId: 'default-destinationId',
                workspaceId: 'default-workspaceId',
              },
              destination,
            },
            {
              metadata: [generateMetadata(5)],
              batched: false,
              statusCode: 400,
              error: 'groupId is a required field for group events',
              statTags: {
                destType: 'KLAVIYO',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                destinationId: 'default-destinationId',
                workspaceId: 'default-workspaceId',
              },
              destination,
            },
          ],
        },
      },
    },
  },
];
