import { defaultAccessTokenAuthHeader } from '../../common/secrets';
import { authHeader1, authHeader2 } from './maskedSecrets';

export const headerBlockWithCorrectAccessToken = {
  Authorization: defaultAccessTokenAuthHeader,
  'Content-Type': 'application/json',
  'LinkedIn-Version': '202509',
  'X-RestLi-Method': 'BATCH_CREATE',
  'X-Restli-Protocol-Version': '2.0.0',
};
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

export const testJSONData = {
  elements: [{ ...element }],
};

export const testJSONDataWithDifferentTypeConversion = {
  elements: [
    {
      ...element,
      conversion: 'urn:li:partner:differentConversion',
    },
  ],
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

export const wrongFormattedTestJSONData = {
  elements: [{ ...wrongFormatElement }],
};

// MOCK DATA
const businessMockData = [
  {
    description: 'Mock response from destination depicting request with a revoked access token',
    httpReq: {
      method: 'post',
      url: 'https://api.linkedin.com/rest/conversionEvents',
      headers: {
        ...headerBlockWithCorrectAccessToken,
        Authorization: authHeader1,
      },
      data: testJSONData,
    },
    httpRes: {
      data: {
        status: 401,
        serviceErrorCode: 65601,
        code: 'REVOKED_ACCESS_TOKEN',
        message: 'The token used in the request has been revoked by the user',
      },
      status: 401,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response from destination depicting request with an invalid access token',
    httpReq: {
      method: 'post',
      url: 'https://api.linkedin.com/rest/conversionEvents',
      headers: {
        ...headerBlockWithCorrectAccessToken,
        Authorization: authHeader2,
      },
      data: testJSONData,
    },
    httpRes: {
      data: {
        status: 401,
        serviceErrorCode: 65600,
        code: 'INVALID_ACCESS_TOKEN',
        message: 'Invalid access token',
      },
      status: 401,
      statusText: 'OK',
    },
  },
  {
    description:
      'Mock response from destination depicting a correct request with a valid access token',
    httpReq: {
      method: 'post',
      url: 'https://api.linkedin.com/rest/conversionEvents',
      headers: headerBlockWithCorrectAccessToken,
      data: testJSONData,
    },
    httpRes: {
      data: {
        elements: [
          {
            status: 201,
          },
          {
            status: 201,
          },
        ],
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description:
      'Mock response from destination depicting request with a conversion created differently than choosing direct API',
    httpReq: {
      method: 'post',
      url: 'https://api.linkedin.com/rest/conversionEvents',
      headers: headerBlockWithCorrectAccessToken,
      data: testJSONDataWithDifferentTypeConversion,
    },
    httpRes: {
      data: {
        message:
          "Incorrect conversions information provided. Conversion's method should be CONVERSIONS_API, indices [0] (0-indexed)",
        status: 400,
      },
      status: 400,
      statusText: 'OK',
    },
  },
  {
    description:
      'Mock response from destination depicting request with a conversion created differently than choosing direct API',
    httpReq: {
      method: 'post',
      url: 'https://api.linkedin.com/rest/conversionEvents',
      headers: headerBlockWithCorrectAccessToken,
      data: testJSONDataWithDifferentTypeConversion,
    },
    httpRes: {
      data: {
        message:
          "Incorrect conversions information provided. Conversion's method should be CONVERSIONS_API, indices [0] (0-indexed)",
        status: 400,
      },
      status: 400,
      statusText: 'OK',
    },
  },
  {
    description:
      'Mock response from destination depicting request with a conversion created differently than choosing direct API',
    httpReq: {
      method: 'post',
      url: 'https://api.linkedin.com/rest/conversionEvents',
      headers: headerBlockWithCorrectAccessToken,
      data: wrongFormattedTestJSONData,
    },
    httpRes: {
      data: {
        message:
          'Index: 0, ERROR :: /conversionValue/amount :: field is required but not found and has no default value\nERROR :: /user/userInfo/firstName :: field is required but not found and has no default value\nERROR :: /user/userInfo/lastName :: field is required but not found and has no default value\n',
        status: 422,
      },
      status: 422,
      statusText: 'OK',
    },
  },
];

export const networkCallsData = [...businessMockData];
