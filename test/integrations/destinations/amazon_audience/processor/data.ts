import { destination, generateMetadata } from '../common';
const sha256 = require('sha256');

const fields = {
  email: 'abc@xyz.com',
  phone: '9876543323',
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
                city: 'Edmonton',
                state: 'alberta',
                country: 'Canada',
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
                            country:
                              '6959097001d10501ac7d54c0bdb8db61420f658f2922cc26e46d536119a31126',
                            address:
                              '7e68f87b9675dca9a6cbd0b3b715af6cd9e0b75b72b96feec98dd334d665a76c',
                            city: '5ae1b46bce91b626720727f9d8d1eb8998e5b6586b339b97c2288595fe25116a',
                            firstName:
                              '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                            email:
                              'ee278943de84e5d6243578ee1a1057bcce0e50daad9755f45dfa64b60b13bc5d',
                            lastName:
                              '04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb',
                            phone:
                              '3daf505bba309a952bb4bbd010d1d39e413e40c679ac3bbcee1ea9b009023ffa',
                            postalCode:
                              '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
                            state:
                              'fb8e20fc2e4c3f248c60c39bd652f3c1347298bb977b8b4d5903b85055620603',
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
              headers: {
                'Amazon-Advertising-API-ClientId': 'dummyClientId',
                'Content-Type': 'application/json',
                Authorization: 'Bearer dummyAccessToken',
              },
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
              headers: {
                'Amazon-Advertising-API-ClientId': 'dummyClientId',
                'Content-Type': 'application/json',
                Authorization: 'Bearer dummyAccessToken',
              },
              params: {},
              body: {
                JSON: {
                  createUsers: {
                    records: [
                      {
                        hashedRecords: [
                          {
                            email: 'abc@xyz.com',
                            phone: '9876543323',
                            firstName: 'test',
                            lastName: 'user',
                            address: '   Été très chaud!  ',
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
