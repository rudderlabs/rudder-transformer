import { Destination, RouterTransformationRequest } from '../../../../../src/types';
import { RouterTestData } from '../../../testTypes';
import { routerRequest } from './commonConfig';
import { generateMetadata } from '../../../testUtils';
import { dataV2 } from './dataV2';
import { secret1, authHeader1 } from '../maskedSecrets';

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
    privateApiKey: secret1,
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
};

export const data: RouterTestData[] = [
  {
    id: 'klaviyo-router-test-1',
    name: 'klaviyo',
    description: 'Basic Router Test to test multiple payloads',
    scenario: 'Framework',
    successCriteria: 'All the subscription events should be batched',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: routerRequest,
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs',
                  headers: {
                    Authorization: authHeader1,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    revision: '2023-02-22',
                  },
                  params: {},
                  body: {
                    JSON: {
                      data: {
                        type: 'profile-subscription-bulk-create-job',
                        attributes: {
                          list_id: 'XUepkK',
                          subscriptions: [
                            { email: 'test@rudderstack.com', phone_number: '+12 345 678 900' },
                          ],
                        },
                      },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [generateMetadata(3)],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs',
                  headers: {
                    Authorization: authHeader1,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    revision: '2023-02-22',
                  },
                  params: {},
                  body: {
                    JSON: {
                      data: {
                        type: 'profile-subscription-bulk-create-job',
                        attributes: {
                          list_id: 'XUepkK',
                          subscriptions: [
                            {
                              email: 'test@rudderstack.com',
                              phone_number: '+12 345 578 900',
                              channels: { email: ['MARKETING'], sms: ['MARKETING'] },
                            },
                          ],
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
                  method: 'PATCH',
                  endpoint: 'https://a.klaviyo.com/api/profiles/01GW3PHVY0MTCDGS0A1612HARX',
                  headers: {
                    Authorization: authHeader1,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    revision: '2023-02-22',
                  },
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
                        id: '01GW3PHVY0MTCDGS0A1612HARX',
                      },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [generateMetadata(2)],
              batched: true,
              statusCode: 200,
              destination,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'PATCH',
                endpoint: 'https://a.klaviyo.com/api/profiles/01GW3PHVY0MTCDGS0A1612HARX',
                headers: {
                  Authorization: authHeader1,
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  revision: '2023-02-22',
                },
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
                      id: '01GW3PHVY0MTCDGS0A1612HARX',
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
  ...dataV2,
];
