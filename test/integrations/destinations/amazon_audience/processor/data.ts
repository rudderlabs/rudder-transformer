import { destination, generateMetadata } from '../common';
const sha256 = require('sha256');

const fields = {
  email: 'abc@xyz.com',
  phone: '98765433232',
  firstName: 'test',
  lastName: 'user',
  address: '   Été très chaud!  ',
};

export const data = [
  {
    name: 'amazon_audience',
    id: 'Test 1',
    description: 'All traits are present with hash enbaled for the audience with insert operation',
    successCriteria: 'It should be passed with 200 Ok with all traits mapped after hashing',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'record',
              action: 'insert',
              fields: {
                ...fields,
                city: 'delhi',
                state: 'delhi',
                postalCode: '12345',
              },
              context: {},
              recordId: '1',
            },
            destination: { ...destination, Config: { ...destination.Config, enableHash: true } },
            metadata: generateMetadata(1),
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
                FORM: {},
                JSON_ARRAY: {},
                JSON: {
                  createUsers: {
                    records: [
                      {
                        hashedRecords: [
                          {
                            address:
                              '7e68f87b9675dca9a6cbd0b3b715af6cd9e0b75b72b96feec98dd334d665a76c',
                            city: '40ace5b4f58193240d4006e6468fa37fdf64111407672475b0a804b4a76d0339',
                            firstName:
                              '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                            email:
                              'ee278943de84e5d6243578ee1a1057bcce0e50daad9755f45dfa64b60b13bc5d',
                            lastName:
                              '04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb',
                            phone:
                              '76742d946d9f6d0c844da5648e461896227782ccf1cd0db64573f39dbd92e05f',
                            postalCode:
                              '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
                            state:
                              '40ace5b4f58193240d4006e6468fa37fdf64111407672475b0a804b4a76d0339',
                          },
                        ],
                        externalId:
                          'Rudderstack_6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
                      },
                    ],
                  },
                  associateUsers: {
                    patches: [
                      {
                        op: 'add',
                        path: `/EXTERNAL_USER_ID-Rudderstack_6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b/audiences`,
                        value: ['dummyId'],
                      },
                    ],
                  },
                },
                XML: {},
              },
              endpoint: '',
              files: {},
              headers: {},
              method: 'POST',
              params: {},
              type: 'REST',
              userId: '',
              version: '1',
            },
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    name: 'amazon_audience',
    id: 'Test 2',
    description: 'All traits are present with hash disabled for the audience with delete operation',
    successCriteria: 'It should be passed with 200 Ok with all traits mapped without hashing',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'record',
              action: 'delete',
              fields,
              channel: 'sources',
              context: {},
              recordId: '1',
            },
            metadata: generateMetadata(1),
          },
        ],
      },
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
              endpoint: '',
              headers: {},
              params: {},
              body: {
                JSON: {
                  createUsers: {
                    records: [
                      {
                        hashedRecords: [
                          {
                            email: 'abc@xyz.com',
                            phone: '98765433232',
                            firstName: 'test',
                            lastName: 'user',
                            address: 'etetreschaud',
                          },
                        ],
                        externalId:
                          'Rudderstack_6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
                      },
                    ],
                  },
                  associateUsers: {
                    patches: [
                      {
                        op: 'remove',
                        path: `/EXTERNAL_USER_ID-Rudderstack_6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b/audiences`,
                        value: ['dummyId'],
                      },
                    ],
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: generateMetadata(1),
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'amazon_audience',
    id: 'Test 3',
    description: 'Type Validation case',
    successCriteria: 'It should be passed with 200 Ok giving validation error',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              type: 'identify',
              context: {},
              recordId: '1',
            },
            metadata: generateMetadata(1),
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
            statusCode: 400,
            error: '[AMAZON AUDIENCE]: identify is not supported',
            statTags: {
              errorCategory: 'dataValidation',
              destinationId: 'default-destinationId',
              errorType: 'instrumentation',
              destType: 'AMAZON_AUDIENCE',
              module: 'destination',
              implementation: 'native',
              workspaceId: 'default-workspaceId',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
];
