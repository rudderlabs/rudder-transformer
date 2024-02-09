const commonDestination = {
    Config: {
      limitedDataUsage: true,
      blacklistPiiProperties: [
        {
          blacklistPiiProperties: '',
          blacklistPiiHash: false,
        },
      ],
      accessToken: '09876',
      pixelId: 'dummyPixelId',
      eventsToEvents: [
        {
          from: '',
          to: '',
        },
      ],
      eventCustomProperties: [
        {
          eventCustomProperties: '',
        },
      ],
      removeExternalId: true,
      valueFieldIdentifier: '',
      advancedMapping: true,
      whitelistPiiProperties: [
        {
          whitelistPiiProperties: '',
        },
      ],
    },
    Enabled: true,
  }
export const validationTestData = [
    {
      id: 'fbPixel-validation-test-1',
      name: 'facebook_pixel',
      description: '[Error]: Check for unsupported message type',
      scenario: 'Framework',
      successCriteria:
        'Response should contain error message and status code should be 400, as we are sending a message type which is not supported by facebook pixel destination and the error message should be Event type random is not supported',
      feature: 'processor',
      module: 'destination',
      version: 'v0',
      input: {
        request: {
          body: [
            {
              destination: commonDestination,
              message: {
                userId: 'user123',
                type: 'random',
                groupId: 'XUepkK',
                traits: {
                  subscribe: true,
                },
                context: {
                  traits: {
                    email: 'test@rudderstack.com',
                    phone: '+12 345 678 900',
                    consent: 'email',
                  },
                },
                timestamp: '2023-10-14T00:21:34.208Z',
              },
            },
          ],
        },
      },
      output: {
        response: {
          status: 200,
          body: [
            {
              error: 'Message type random not supported',
              statTags: {
                destType: 'FACEBOOK_PIXEL',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'processor',
                implementation: 'native',
                module: 'destination',
              },
              statusCode: 400,
            },
          ],
        },
      },
    },
    {
      id: 'fbPixel-validation-test-2',
      name: 'facebook_pixel',
      description: '[Error]: validate event date and time',
      scenario: 'Framework + business',
      successCriteria:
        'Response should contain error message and status code should be 400, as we are sending an event which is older than 7 days and the error message should be Events must be sent within seven days of their occurrence or up to one minute in the future.',
      feature: 'processor',
      module: 'destination',
      version: 'v0',
        input: {
          request: {
            body: [
              {
                message: {
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  destination_props: {
                    Fb: {
                      app_id: 'RudderFbApp',
                    },
                  },
                  context: {
                    device: {
                      id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                      manufacturer: 'Xiaomi',
                      model: 'Redmi 6',
                      name: 'xiaomi',
                    },
                    network: {
                      carrier: 'Banglalink',
                    },
                    os: {
                      name: 'android',
                      version: '8.1.0',
                    },
                    screen: {
                      height: '100',
                      density: 50,
                    },
                    traits: {
                      email: 'abc@gmail.com',
                      anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                    },
                  },
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: {
                    revenue: 400,
                    additional_bet_index: 0,
                  },
                  timestamp: '2019-08-24T15:46:51.693229+05:30',
                  type: 'track',
                },
                destination: commonDestination,
              },
            ],
          },
        },
        output: {
          response: {
            status: 200,
            body: [
              {
                statusCode: 400,
                error:
                  'Events must be sent within seven days of their occurrence or up to one minute in the future.',
                statTags: {
                  errorCategory: 'dataValidation',
                  errorType: 'instrumentation',
                  destType: 'FACEBOOK_PIXEL',
                  module: 'destination',
                  implementation: 'native',
                  feature: 'processor',
                },
              },
            ],
          },
        },
      }
  ];