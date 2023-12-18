export const data = [
  {
    name: 'courier',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                channel: 'web',
                event: 'Product Added',
                userId: 'test123',
                properties: {
                  price: 999,
                  quantity: 1,
                },
                context: {
                  traits: {
                    firstName: 'John',
                    age: 27,
                  },
                },
                rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
                messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              },
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                },
              },
              metadata: {
                jobId: 1,
              },
            },
            {
              message: {
                type: 'track',
                channel: 'web',
                event: 'Product Added',
                properties: {},
                context: {},
                rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
                messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              },
              destination: {
                Config: {
                  sdkKey: 'test-sdk-key',
                  trackKnownUsers: false,
                  nonInteraction: false,
                  listen: false,
                  trackCategorizedPages: true,
                  trackNamedPages: true,
                },
              },
              metadata: {
                jobId: 2,
              },
            },
          ],
          destType: 'courier',
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
              batched: false,
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.courier.com/inbound/rudderstack',
                headers: {
                  Authorization: 'Bearer dummyApiKey',
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    type: 'track',
                    channel: 'web',
                    event: 'Product Added',
                    userId: 'test123',
                    properties: {
                      price: 999,
                      quantity: 1,
                    },
                    context: {
                      traits: {
                        firstName: 'John',
                        age: 27,
                      },
                    },
                    rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
                    messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                    anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                  },
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                },
                files: {},
              },
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                },
              },
              metadata: [
                {
                  jobId: 1,
                },
              ],
              statusCode: 200,
            },
            {
              batched: false,
              error: 'apiKey is required',
              metadata: [
                {
                  jobId: 2,
                },
              ],
              statTags: {
                destType: 'COURIER',
                errorCategory: 'dataValidation',
                errorType: 'configuration',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              statusCode: 400,
              destination: {
                Config: {
                  sdkKey: 'test-sdk-key',
                  trackKnownUsers: false,
                  nonInteraction: false,
                  listen: false,
                  trackCategorizedPages: true,
                  trackNamedPages: true,
                },
              },
            },
          ],
        },
      },
    },
  },
];
