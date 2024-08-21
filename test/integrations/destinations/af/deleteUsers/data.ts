import { cloneDeep } from 'lodash';
import { FEATURES } from '../../../../../src/v0/util/tags';
import { networkCallsData } from '../network';
import { addMock } from '../../../testUtils';
import MockAdapter from 'axios-mock-adapter';
import utils from '../../../../../src/v0/util';

const defaultMockFns = () => {
  jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2023-09-24T11:22:24.018Z');
  jest.spyOn(utils, 'generateUUID').mockReturnValueOnce('97fcd7b2-cc24-47d7-b776-057b7b199513');
};

const requests = [
  {
    request: {
      body: [
        {
          destType: 'AF',
          userAttributes: [
            {
              userId: 'test_user_id',
              appsflyer_id: 'jklhajksfh',
            },
            {
              userId: 'user_sdk2',
              appsflyer_id: 'jklhajksfh',
            },
          ],
          config: {
            devKey: 'ef1d42390426e3f7c90ac78272e74344',
            apiToken: 'dummyApiToken',
          },
        },
      ],
    },
  },
  {
    request: {
      body: [
        {
          destType: 'AF',
          userAttributes: [
            {
              userId: 'test_user_id',
              appsflyer_id: 'jklhajksfh',
            },
            {
              userId: 'user_sdk2',
              appsflyer_id: 'jklhajksfh',
            },
          ],
          config: {
            devKey: 'ef1d42390426e3f7c90ac78272e74344',
            appleAppId: '123456789',
            statusCallbackUrls:
              'https://examplecontroller.com/opengdpr_callbacks,https://examplecontroller.com/opengdpr_callbacks,https://examplecontroller.com/opengdpr_callbacks,https://examplecontroller.com/opengdpr_callbacks',
            apiToken: 'dummyApiToken',
          },
        },
      ],
    },
  },
  {
    request: {
      body: [
        {
          destType: 'AF',
          userAttributes: [
            {
              email: 'testUser@testMail.com',
              android_advertising_id: '1234',
            },
            {
              userId: 'user_sdk2',
              android_advertising_id: '1234',
            },
          ],
          config: {
            devKey: 'abcde',
            appleAppId: 'asdfasdf',
            groupTypeTrait: 'email',
            groupValueTrait: 'age',
            trackProductsOnce: false,
            trackRevenuePerProduct: false,
            apiToken: 'dummyApiToken',
          },
        },
      ],
    },
  },
  {
    request: {
      body: [
        {
          destType: 'AF',
          userAttributes: [
            {
              email: 'testUser@testMail.com',
              ios_advertising_id: '1234',
            },
            {
              userId: 'user_sdk2',
              ios_advertising_id: '1234',
            },
          ],
          config: {
            devKey: 'abcde',
            androidAppId: 'com.rudder.rs',
            groupTypeTrait: 'email',
            groupValueTrait: 'age',
            trackProductsOnce: false,
            trackRevenuePerProduct: false,
            apiToken: 'dummyApiToken',
          },
        },
      ],
    },
  },
  {
    request: {
      body: [
        {
          destType: 'AF',
          userAttributes: [
            {
              email: 'testUser@testMail.com',
              userId: 'user1234',
            },
            {
              userId: 'user_sdk2',
              ios_advertising_id: '1234',
            },
          ],
          config: {
            devKey: 'abcde',
            androidAppId: 'com.rudder.rs',
            groupTypeTrait: 'email',
            groupValueTrait: 'age',
            trackProductsOnce: false,
            trackRevenuePerProduct: false,
            apiToken: 'dummyApiToken',
          },
        },
      ],
    },
  },
];
const resultBodies = [
  [
    {
      statusCode: 400,
      error:
        'API Token and one of Apple ID or Android App Id are required fields for user deletion',
    },
  ],
  [
    {
      statusCode: 400,
      error: 'You can send utmost 3 callBackUrls',
    },
  ],
  [
    {
      statusCode: 400,
      error: 'androidAppId is required for android_advertising_id type identifier',
    },
  ],
  [
    {
      statusCode: 400,
      error: 'appleAppId is required for ios_advertising_id type identifier',
    },
  ],
  [
    {
      statusCode: 400,
      error:
        'none of the possible identityTypes i.e.(ios_advertising_id, android_advertising_id, appsflyer_id) is provided for deletion',
    },
  ],
];
const parentCaseVars = {
  name: 'af',
  description: 'Test ',
  feature: FEATURES.USER_DELETION,
  module: 'destination',
  version: 'v0',
  input: {},
  output: {
    response: {
      status: 200,
      body: [
        {
          statusCode: 200,
          status: 'successful',
        },
      ],
    },
  },
};
const nonNetworkCases = requests.map((req, index) => {
  const testCase = cloneDeep(parentCaseVars);
  testCase.description = `Test ${2 + index}`;
  testCase.input = req;
  testCase.output.response.status = resultBodies[index][0].statusCode;
  //@ts-ignore
  testCase.output.response.body = resultBodies[index];
  return testCase;
});

export const data = [
  {
    name: 'af',
    description: 'Test 0',
    feature: FEATURES.USER_DELETION,
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destType: 'AF',
            userAttributes: [
              {
                userId: 'test_user_id',
                android_advertising_id: '1665148898336-5539842602053895577',
              },
            ],
            config: {
              devKey: 'ef1d42390426e3f7c90ac78272e74344',
              appleAppId: '123456789',
              androidAppId: 'AnAID',
              apiToken: 'dummyApiToken',
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 400,
        body: [
          {
            statusCode: 400,
            error: 'User deletion request failed',
          },
        ],
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      const nwData = networkCallsData[0];
      addMock(mockAdapter, nwData);
      defaultMockFns();
    },
  },
  {
    name: 'af',
    description: 'Test 1',
    feature: FEATURES.USER_DELETION,
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destType: 'AF',
            userAttributes: [
              {
                userId: 'test_user_id',
                ios_advertising_id: '1665148898336-5539842602053895577',
              },
            ],
            config: {
              devKey: 'ef1d42390426e3f7c90ac78272e74344',
              appleAppId: '123456789',
              androidAppId: 'AnAID',
              apiToken: 'dummyApiToken',
              statusCallbackUrls: 'https://examplecontroller.com/opengdpr_callbacks',
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
            statusCode: 200,
            status: 'successful',
          },
        ],
      },
    },
    mockFns: (mockAdapter: MockAdapter) => {
      const nwData = networkCallsData[1];
      addMock(mockAdapter, nwData);
      defaultMockFns();
    },
  },
  ...nonNetworkCases,
];
