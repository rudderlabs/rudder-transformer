import { generateProxyV1Payload } from '../../../testUtils';
import { ProxyV1TestData } from '../../../testTypes';
import { defaultAccessToken, defaultAccessTokenAuthHeader } from '../../../common/secrets';

export const element = {
  conversion: 'urn:lla:llaPartnerConversion:23456',
  conversionHappenedAt: 1697241600000,
  conversionValue: {
    amount: '0',
    currencyCode: 'USD',
  },
  eventId: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
  user: {
    userIds: [
      {
        idType: 'SHA256_EMAIL',
        idValue: 'abc@gmail.com',
      },
    ],
  },
};

export const wrongFormatElement = {
  conversion: 'urn:lla:llaPartnerConversion:23456',
  conversionHappenedAt: 1697241600000,
  conversionValue: {
    currencyCode: 'USD',
  },
  eventId: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
  user: {
    userIds: [
      {
        idType: 'SHA256_EMAIL',
        idValue: 'abc@gmail.com',
      },
    ],
    userInfo: {
      city: 'San Francisco',
    },
  },
};

export const testJSONData = {
  elements: [{ ...element }],
};

export const wrongFormattedTestJSONData = {
  elements: [{ ...wrongFormatElement }],
};

export const testJSONDataWithDifferentTypeConversion = {
  elements: [
    {
      ...element,
      conversion: 'urn:li:partner:differentConversion',
    },
  ],
};

export const statTags = {
  destType: 'LINKEDIN_ADS',
  errorCategory: 'network',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
  errorType: 'aborted',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
};

export const metadata = {
  jobId: 1,
  attemptNum: 1,
  userId: 'default-userId',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
  sourceId: 'default-sourceId',
  secret: {
    accessToken: defaultAccessToken,
  },
  dontBatch: false,
};
export const headerBlockWithCorrectAccessToken = {
  Authorization: defaultAccessTokenAuthHeader,
  'Content-Type': 'application/json',
  'LinkedIn-Version': '202409',
  'X-RestLi-Method': 'BATCH_CREATE',
  'X-Restli-Protocol-Version': '2.0.0',
};

const commonRequestParametersWithWrongElemet = {
  headers: headerBlockWithCorrectAccessToken,
  JSON: wrongFormattedTestJSONData,
};

const commonRequestParametersWithDifferentConversion = {
  headers: headerBlockWithCorrectAccessToken,
  JSON: testJSONDataWithDifferentTypeConversion,
};

export const testScenariosForV1API: ProxyV1TestData[] = [
  {
    id: 'linkedin_ads_v1_scenario_1',
    name: 'linkedin_ads',
    description: 'Event fails due to wrong process followed while creating a conversion',
    successCriteria: 'Should return 400 and aborted',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          endpoint: `https://api.linkedin.com/rest/conversionEvents`,
          ...commonRequestParametersWithDifferentConversion,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              "LinkedIn Conversion API: Error transformer proxy v1 during LinkedIn Conversion API response transformation. Incorrect conversions information provided. Conversion's method should be CONVERSIONS_API, indices [0] (0-indexed)",
            response: [
              {
                error:
                  '{"message":"Incorrect conversions information provided. Conversion\'s method should be CONVERSIONS_API, indices [0] (0-indexed)","status":400}',
                statusCode: 400,
                metadata,
              },
            ],
            statTags,
            status: 400,
          },
        },
      },
    },
  },
  {
    id: 'linkedin_ads_v1_scenario_2',
    name: 'linkedin_ads',
    description: 'Event fails due to wrong format payload sent to linkedin',
    successCriteria: 'Should return 400 with appropriate reason of failure',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          endpoint: `https://api.linkedin.com/rest/conversionEvents`,
          ...commonRequestParametersWithWrongElemet,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            destinationResponse: {
              response: {
                message:
                  'Index: 0, ERROR :: /conversionValue/amount :: field is required but not found and has no default value\nERROR :: /user/userInfo/firstName :: field is required but not found and has no default value\nERROR :: /user/userInfo/lastName :: field is required but not found and has no default value\n',
                status: 422,
              },
              status: 422,
            },
            message:
              '[LINKEDIN_CONVERSION_API Response V1 Handler] - Request Processed Successfully',
            response: [
              {
                error:
                  '/conversionValue/amount :: field is required but not found and has no default value',
                statusCode: 400,
                metadata,
              },
            ],
            status: 422,
          },
        },
      },
    },
  },
];
