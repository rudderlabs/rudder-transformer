export const data = [
  {
    name: 'signl4',
    description: 'Successfull Track Call ',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                Config: {
                  apiKey: 't1yurrb968zk',
                  s4ServiceValue: 'service',
                  s4ServiceProperty: '',
                  s4LocationValue: '67.3, 32.3',
                  s4LocationProperty: '',
                  s4AlertingScenarioValue: 'single_ack',
                  s4AlertingScenarioProperty: '',
                  s4ExternalIDValue: 'INC493933',
                  s4ExternalIDProperty: '',
                  s4StatusValue: 'new',
                  s4StatusProperty: '',
                  s4Filter: false,
                  eventToTitleMapping: [],
                },
              },
              metadata: {
                jobId: 1,
              },
              message: {
                event: 'New Alert',
                type: 'track',
                sentAt: '2021-01-03T17:02:53.195Z',
                channel: 'web',
                properties: {
                  message: 'Please check the alert',
                  brand: 'Zara',
                  price: '12000',
                },
                context: {
                  os: {
                    name: '',
                    version: '',
                  },
                  app: {
                    name: 'RudderLabs JavaScript SDK',
                    build: '1.0.0',
                    version: '1.1.11',
                    namespace: 'com.rudderlabs.javascript',
                  },
                  locale: 'en-US',
                  screen: {
                    density: 2,
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.1.11',
                  },
                  campaign: {},
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                },
                rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
                messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                originalTimestamp: '2021-01-03T17:02:53.193Z',
              },
            },
          ],
          destType: 'signl4',
        },
        method: 'POST',
      },
      pathSuffix: '',
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
                endpoint: 'https://connect.signl4.com/webhook/t1yurrb968zk',
                headers: {
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    message: 'Please check the alert',
                    Title: 'New Alert',
                    brand: 'Zara',
                    price: '12000',
                    'X-S4-Service': 'service',
                    'X-S4-Location': '67.3, 32.3',
                    'X-S4-AlertingScenario': 'single_ack',
                    'X-S4-ExternalID': 'INC493933',
                    'X-S4-Status': 'new',
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 1,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 't1yurrb968zk',
                  s4ServiceValue: 'service',
                  s4ServiceProperty: '',
                  s4LocationValue: '67.3, 32.3',
                  s4LocationProperty: '',
                  s4AlertingScenarioValue: 'single_ack',
                  s4AlertingScenarioProperty: '',
                  s4ExternalIDValue: 'INC493933',
                  s4ExternalIDProperty: '',
                  s4StatusValue: 'new',
                  s4StatusProperty: '',
                  s4Filter: false,
                  eventToTitleMapping: [],
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'signl4',
    description: 'Identify Event not Supported',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                Config: {
                  apiKey: 'urissi44sfgs',
                  s4ServiceValue: 'service',
                  s4ServiceProperty: '',
                  s4LocationValue: '67.3, 32.3',
                  s4LocationProperty: '',
                  s4AlertingScenarioValue: 'single_ack',
                  s4AlertingScenarioProperty: '',
                  s4ExternalIDValue: 'INC493933',
                  s4ExternalIDProperty: '',
                  s4StatusValue: 'new',
                  s4StatusProperty: '',
                  s4Filter: false,
                  eventToTitleMapping: [
                    {
                      from: 'New Alert',
                      to: 'Alert Created',
                    },
                  ],
                },
              },
              metadata: {
                jobId: 2,
              },
              message: {
                event: 'New Alert',
                type: 'identify',
                sentAt: '2021-01-03T17:02:53.195Z',
                channel: 'web',
                properties: {
                  message: 'Please check the alert',
                  brand: 'Zara',
                  price: '12000',
                },
                context: {
                  os: {
                    name: '',
                    version: '',
                  },
                  app: {
                    name: 'RudderLabs JavaScript SDK',
                    build: '1.0.0',
                    version: '1.1.11',
                    namespace: 'com.rudderlabs.javascript',
                  },
                  locale: 'en-US',
                  screen: {
                    density: 2,
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.1.11',
                  },
                  campaign: {},
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                },
                rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
                messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                originalTimestamp: '2021-01-03T17:02:53.193Z',
              },
            },
          ],
          destType: 'signl4',
        },
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              destination: {
                Config: {
                  apiKey: 'urissi44sfgs',
                  s4ServiceValue: 'service',
                  s4ServiceProperty: '',
                  s4LocationValue: '67.3, 32.3',
                  s4LocationProperty: '',
                  s4AlertingScenarioValue: 'single_ack',
                  s4AlertingScenarioProperty: '',
                  s4ExternalIDValue: 'INC493933',
                  s4ExternalIDProperty: '',
                  s4StatusValue: 'new',
                  s4StatusProperty: '',
                  s4Filter: false,
                  eventToTitleMapping: [
                    {
                      from: 'New Alert',
                      to: 'Alert Created',
                    },
                  ],
                },
              },
              metadata: [
                {
                  jobId: 2,
                },
              ],
              statTags: {
                errorCategory: 'dataValidation',
                destType: 'SIGNL4',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                errorType: 'instrumentation',
              },
              batched: false,
              statusCode: 400,
              error: 'Event type identify is not supported',
            },
          ],
        },
      },
    },
  },
];
