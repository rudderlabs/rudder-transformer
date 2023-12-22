export const data = [
  {
    name: 'google_cloud_function',
    description: 'Successful request',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                functionEnvironment: 'gen1',
                requireAuthentication: false,
                enableBatchInput: false,
                googleCloudFunctionUrl:
                  'https://us-central1-big-query-integration-poc.cloudfunctions.net/rudderv1',
              },
            },
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: 'anon_id',
              type: 'identify',
              traits: {
                email: 'cosmo@krammer.com',
                name: 'Cosmo Krammer',
                linkedinUrl: 'https://linkedin.com/cosmo-krammer',
                location: 'New York',
                emailOptOut: true,
                masterAvatarTypeCode: 10,
              },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: 'anon_id',
              type: 'identify',
              traits: {
                email: 'cosmo@krammer.com',
                name: 'Cosmo Krammer',
                linkedinUrl: 'https://linkedin.com/cosmo-krammer',
                location: 'New York',
                emailOptOut: true,
                masterAvatarTypeCode: 10,
              },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'google_cloud_function',
    description:
      '[GCF]:: Service Account credentials are required if your function required authentication. Aborting',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                functionEnvironment: 'gen1',
                requireAuthentication: true,
                enableBatchInput: false,
                googleCloudFunctionUrl:
                  'https://us-central1-big-query-integration-poc.cloudfunctions.net/rudderv1',
              },
            },
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: { name: '', version: '' },
                screen: { density: 2 },
              },
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: 'anon_id',
              type: 'identify',
              traits: {
                email: 'cosmo@krammer.com',
                name: 'Cosmo Krammer',
                linkedinUrl: 'https://linkedin.com/cosmo-krammer',
                location: 'New York',
                emailOptOut: true,
                masterAvatarTypeCode: 10,
              },
              integrations: { All: true },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              '[GCF]:: Service Account credentials are required if your function required authentication. Aborting',
            statTags: {
              destType: 'GOOGLE_CLOUD_FUNCTION',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
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
];
