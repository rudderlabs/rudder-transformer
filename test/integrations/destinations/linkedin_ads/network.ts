export const headerBlockWithCorrectAccessToken = {
  Authorization: 'Bearer default-accessToken',
  'Content-Type': 'application/json',
  'LinkedIn-Version': '202402',
  'X-RestLi-Method': 'BATCH_CREATE',
  'X-Restli-Protocol-Version': '2.0.0',
};

export const testJSONData = {
  elements: [
    {
      conversion: 'urn:lla:llaPartnerConversion:23456',
      conversionHappenedAt: 1697241600000,
      conversionValue: {
        amount: 0,
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
    },
  ],
};

const commonRequestParameters = {
  headers: headerBlockWithCorrectAccessToken,
  JSON: testJSONData,
};
const commonRequestParametersWithInvalidAccess = {
  headers: { ...headerBlockWithCorrectAccessToken, Authorization: 'Bearer invalidToken' },
  JSON: testJSONData,
};

// MOCK DATA
const businessMockData = [
  {
    description: 'Mock response from destination depicting request with a revoked access token',
    httpReq: {
      method: 'post',
      url: 'https://api.linkedin.com/rest/conversionEvents',
      headers: { ...headerBlockWithCorrectAccessToken, Authorization: 'Bearer revokedToken' },
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
      headers: { ...headerBlockWithCorrectAccessToken, Authorization: 'Bearer invalidToken' },
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
];

export const networkCallsData = [...businessMockData];
