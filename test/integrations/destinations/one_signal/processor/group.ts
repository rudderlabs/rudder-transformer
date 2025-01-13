import { destination, endpoint, headers } from './commonConfig';
export const groupTests = [
  {
    name: 'one_signal',
    id: 'One Signal V2-test-group-success-1',
    description:
      'Group call for adding a tag groupId with value as group id with no userId available',
    module: 'destination',
    successCriteria: 'Request gets passed with 200 Status Code with userId mapped to external_id',
    feature: 'processor',
    scenario: 'Framework+Buisness',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              integrations: {
                one_signal: {
                  aliases: { custom_alias: 'custom_alias_identifier' },
                },
              },
              type: 'group',
              channel: 'server',
              groupId: 'group@27',
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
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
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint,
              headers,
              params: {},
              body: {
                FORM: {},
                JSON: {
                  properties: {
                    tags: {
                      groupId: 'group@27',
                    },
                  },
                  identity: {
                    custom_alias: 'custom_alias_identifier',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'one_signal',
    id: 'One Signal V2-test-group-failure-1',
    description: 'V2-> No Group Id Passes',
    module: 'destination',
    successCriteria:
      'Request gets passed with 200 Status Code and failure happened due no group id available',
    feature: 'processor',
    scenario: 'Framework',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'group',
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
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
            error: 'groupId is required for group events',
            statTags: {
              destType: 'ONE_SIGNAL',
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
];
