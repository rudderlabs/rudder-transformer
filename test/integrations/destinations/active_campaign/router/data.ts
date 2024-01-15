import { getBatchedRequest } from '../../../testUtils';

const destination = {
  Config: {
    apiKey: 'dummyApiToken',
    apiUrl: 'https://active.campaigns.rudder.com',
    actid: '476550467',
    eventKey: 'f8a866fddc721350fdc2fbbd2e5c43a6dddaaa03',
  },
};

export const data = [
  {
    name: 'active_campaign',
    description: 'Test 0', //TODO: we need a better description
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: destination,
              metadata: { jobId: 2, userId: 'u1' },
              message: {
                type: 'identify',
                traits: {
                  email: 'jamesDoe@gmail.com',
                  firstName: 'James',
                  lastName: 'Doe',
                  phone: '92374162212',
                  fieldInfo: {
                    Office: 'Trastkiv',
                    Country: 'Russia',
                    Likes: ['Potato', 'Onion'],
                    Random: 'random',
                  },
                },
              },
            },
          ],
          destType: 'active_campaign',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: getBatchedRequest({
                body: {
                  JSON: {
                    contact: {
                      email: 'jamesDoe@gmail.com',
                      firstName: 'James',
                      lastName: 'Doe',
                      phone: '92374162212',
                      fieldValues: [
                        { field: '0', value: 'Trastkiv' },
                        { field: '1', value: 'Russia' },
                        { field: '3', value: '||Potato||Onion||' },
                        { field: '4', value: 'random' },
                      ],
                    },
                  },
                },
                headers: { 'Api-Token': 'dummyApiToken', 'Content-Type': 'application/json' },
                endpoint: 'https://active.campaigns.rudder.com/api/3/contact/sync',
              }),
              metadata: [{ jobId: 2, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: destination,
            },
          ],
        },
      },
    },
  },
  {
    name: 'active_campaign',
    description: 'Test 1', //TODO: we need a better description
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: destination,
              metadata: { jobId: 2, userId: 'u1' },
              message: {
                type: 'page',
                properties: {
                  url: 'https://www.rudderlabs.com',
                },
              },
            },
          ],
          destType: 'active_campaign',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: getBatchedRequest({
                body: {
                  JSON: { siteTrackingDomain: { name: 'rudderlabs.com' } },
                },
                headers: { 'Api-Token': 'dummyApiToken', 'Content-Type': 'application/json' },
                endpoint: 'https://active.campaigns.rudder.com/api/3/siteTrackingDomains',
              }),
              metadata: [{ jobId: 2, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: destination,
            },
          ],
        },
      },
    },
  },
  {
    name: 'active_campaign',
    description: 'Test 2', //TODO: we need a better description
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                name: 'home',
                type: 'page',
                properties: {
                  url: 'url',
                },
              },
              destination: destination,
              metadata: { jobId: 5, userId: 'u1' },
            },
          ],
          destType: 'active_campaign',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              error: 'Invalid URL: url',
              statTags: {
                destType: 'ACTIVE_CAMPAIGN',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              statusCode: 400,
              metadata: [{ jobId: 5, userId: 'u1' }],
              batched: false,
              destination: destination,
            },
          ],
        },
      },
    },
  },
];
