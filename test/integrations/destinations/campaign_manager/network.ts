import { authHeader1 } from '../am/maskedSecrets';

const commonHeaders = {
  Authorization: authHeader1,
  'Content-Type': 'application/json',
};

const encryptionInfo = {
  kind: 'dfareporting#encryptionInfo',
  encryptionSource: 'AD_SERVING',
  encryptionEntityId: '3564523',
  encryptionEntityType: 'DCM_ACCOUNT',
};

const testConversion1 = {
  timestampMicros: '1668624722000000',
  floodlightConfigurationId: '213123123',
  ordinal: '1',
  floodlightActivityId: '456543345245',
  value: 7,
  gclid: '123',
  limitAdTracking: true,
  childDirectedTreatment: true,
};

const testConversion2 = {
  timestampMicros: '1668624722000000',
  floodlightConfigurationId: '213123123',
  ordinal: '1',
  floodlightActivityId: '456543345245',
  value: 8,
  gclid: '321',
  limitAdTracking: true,
  childDirectedTreatment: true,
};

const commonRequestParameters = {
  headers: commonHeaders,
  JSON: {
    kind: 'dfareporting#conversionsBatchInsertRequest',
    encryptionInfo,
    conversions: [testConversion1, testConversion2],
  },
};

// MOCK DATA
const businessMockData = [
  {
    description: 'Mock response from destination depicting a valid request',
    httpReq: {
      method: 'post',
      url: 'https://dfareporting.googleapis.com/test_url_for_valid_request',
      data: {
        kind: 'dfareporting#conversionsBatchInsertRequest',
        encryptionInfo,
        conversions: [testConversion1, testConversion2],
      },
      headers: commonHeaders,
    },
    httpRes: {
      data: {
        hasFailures: false,
        status: [
          {
            conversion: testConversion1,
            kind: 'dfareporting#conversionStatus',
          },
          {
            conversion: testConversion2,
            kind: 'dfareporting#conversionStatus',
          },
        ],
        kind: 'dfareporting#conversionsBatchInsertResponse',
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description:
      'Mock response from destination depicting a request with 1 valid and 1 invalid conversion',
    httpReq: {
      method: 'post',
      url: 'https://dfareporting.googleapis.com/test_url_for_invalid_request_conversion_2',
      data: {
        kind: 'dfareporting#conversionsBatchInsertRequest',
        encryptionInfo,
        conversions: [testConversion1, testConversion2],
      },
      headers: commonHeaders,
    },
    httpRes: {
      data: {
        hasFailures: true,
        status: [
          {
            conversion: testConversion1,
            kind: 'dfareporting#conversionStatus',
          },
          {
            conversion: testConversion2,
            errors: [
              {
                code: 'NOT_FOUND',
                message: 'Floodlight config id: 213123123 was not found.',
                kind: 'dfareporting#conversionError',
              },
            ],
            kind: 'dfareporting#conversionStatus',
          },
        ],
        kind: 'dfareporting#conversionsBatchInsertResponse',
      },
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Mock response from destination depicting a request with 2 invalid conversions',
    httpReq: {
      method: 'post',
      url: 'https://dfareporting.googleapis.com/test_url_for_invalid_request_both_conversions',
      data: {
        kind: 'dfareporting#conversionsBatchInsertRequest',
        encryptionInfo,
        conversions: [testConversion1, testConversion2],
      },
      headers: commonHeaders,
    },
    httpRes: {
      data: {
        hasFailures: true,
        status: [
          {
            conversion: testConversion1,
            errors: [
              {
                code: 'INVALID_ARGUMENT',
                message: 'Gclid is not valid.',
                kind: 'dfareporting#conversionError',
              },
            ],
            kind: 'dfareporting#conversionStatus',
          },
          {
            conversion: testConversion2,
            errors: [
              {
                code: 'NOT_FOUND',
                message: 'Floodlight config id: 213123123 was not found.',
                kind: 'dfareporting#conversionError',
              },
            ],
            kind: 'dfareporting#conversionStatus',
          },
        ],
        kind: 'dfareporting#conversionsBatchInsertResponse',
      },
      status: 200,
      statusText: 'OK',
    },
  },
];

export const networkCallsData = [...businessMockData];
