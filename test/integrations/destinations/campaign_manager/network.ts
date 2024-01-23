const headers = {
  Authorization: 'Bearer dummyApiKey',
  'Content-Type': 'application/json',
};

const getBatchInsertUrlFromID = (profileId: string) => {
  return `https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/${profileId}/conversions/batchinsert`;
};

const encryptionInfo = {
  kind: 'dfareporting#encryptionInfo',
  encryptionSource: 'AD_SERVING',
  encryptionEntityId: '3564523',
  encryptionEntityType: 'DCM_ACCOUNT',
};

const conversion1 = {
  timestampMicros: '1668624722000000',
  floodlightConfigurationId: '213123123',
  ordinal: '1',
  floodlightActivityId: '456543345245',
  value: 7,
  gclid: '123',
  limitAdTracking: true,
  childDirectedTreatment: true,
};

const conversion2 = {
  timestampMicros: '1668624722000000',
  floodlightConfigurationId: '213123123',
  ordinal: '1',
  floodlightActivityId: '456543345245',
  value: 8,
  gclid: '123',
  limitAdTracking: true,
  childDirectedTreatment: true,
};

const Data = [
  {
    description:
      'Successfull delivery request to deliver to the destination for batch insert for account id 437689, the response should not contain any failures for the sent conversion, and the status code should be 200',
    httpReq: {
      method: 'post',
      url: getBatchInsertUrlFromID('437689'),
      data: {
        kind: 'dfareporting#conversionsBatchInsertRequest',
        encryptionInfo,
        conversions: [conversion1],
      },
      headers,
    },
    httpRes: {
      data: {
        hasFailures: false,
        status: [
          {
            conversion: conversion1,
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
      'Unsuccessful delivery request to deliver to the destination for batch insert for account id 437690, the response should contain errors for the sent conversion, with error code NOT_FOUND, and the status code should be 200',
    httpReq: {
      method: 'post',
      url: getBatchInsertUrlFromID('437690'),
      data: {
        kind: 'dfareporting#conversionsBatchInsertRequest',
        encryptionInfo,
        conversions: [conversion1],
      },
      headers,
    },
    httpRes: {
      data: {
        hasFailures: true,
        status: [
          {
            conversion: conversion1,
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
    description:
      'Successfull delivery request to deliver to the destination for batch insert for account id 43770, the response should not contain any failures for the sent conversion, and the status code should be 200',
    httpReq: {
      method: 'post',
      url: getBatchInsertUrlFromID('43770'),
      data: {
        kind: 'dfareporting#conversionsBatchInsertRequest',
        encryptionInfo,
        conversions: [conversion1],
      },
      headers,
    },
    httpRes: {
      data: {
        hasFailures: false,
        status: [
          {
            conversion: conversion1,
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
      'Unsuccessful delivery request to deliver to the destination for batch insert for account id 437692, the response should contain errors for the sent conversion, with error code INVALID_ARGUMENT, and the status code should be 200',
    httpReq: {
      method: 'post',
      url: getBatchInsertUrlFromID('437692'),
      data: {
        kind: 'dfareporting#conversionsBatchInsertRequest',
        conversions: [conversion1, conversion2],
      },
      headers,
    },
    httpRes: {
      data: {
        hasFailures: true,
        status: [
          {
            conversion: conversion1,
            errors: [
              {
                code: 'INVALID_ARGUMENT',
                message: 'Floodlight config id: 213123123 was not found.',
                kind: 'dfareporting#conversionError',
              },
            ],
            kind: 'dfareporting#conversionStatus',
          },
          {
            conversion: conversion1,
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
      'Unsuccessful delivery request to deliver to the destination for batch insert for account id 437692, the response should contain errors for the sent conversion, with error code INVALID_ARGUMENT, and the status code should be 200',
    httpReq: {
      method: 'post',
      url: getBatchInsertUrlFromID('437691'),
      data: {
        kind: 'dfareporting#conversionsBatchInsertRequest',
        encryptionInfo,
        conversions: [conversion1],
      },
      headers,
    },
    httpRes: {
      data: {
        hasFailures: true,
        status: [
          {
            conversion: conversion1,
            errors: [
              {
                code: 'INVALID_ARGUMENT',
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

const NetworkErrorMocks = [
  {
    description: 'Unsuccessful delivery request to deliver to the destination for batch insert for',
    httpReq: {
      method: 'post',
      url: getBatchInsertUrlFromID('networkError500'),
      data: {
        kind: 'dfareporting#conversionsBatchInsertRequest',
        encryptionInfo,
        conversions: [conversion1],
      },
      headers,
    },
    httpRes: {
      data: 'THIS IS A NETWORK ERROR WITH STATUS CODE 500',
      status: 500,
      statusText: 'OK',
    },
  },
  {
    description: 'Unsuccessful delivery request to deliver to the destination for batch insert for',
    httpReq: {
      method: 'post',
      url: getBatchInsertUrlFromID('networkErrorBogus'),
      data: {
        kind: 'dfareporting#conversionsBatchInsertRequest',
        encryptionInfo,
        conversions: [conversion1],
      },
      headers,
    },
    httpRes: {
      data: null,
      status: 200,
      statusText: 'OK',
    },
  },
  {
    description: 'Unsuccessful delivery request to deliver to the destination for batch insert for',
    httpReq: {
      method: 'post',
      url: getBatchInsertUrlFromID('networkError400'),
      data: {
        kind: 'dfareporting#conversionsBatchInsertRequest',
        encryptionInfo,
        conversions: [conversion1],
      },
      headers,
    },
    httpRes: {
      data: {
        error: {
          errors: [
            {
              domain: 'global',
              reason: 'invalidParameter',
              message: "Invalid string value: 'asdf'. Allowed values: [mostpopular]",
              locationType: 'parameter',
              location: 'chart',
            },
          ],
          code: 400,
          message: "Invalid string value: 'asdf'. Allowed values: [mostpopular]",
        },
      },
      status: 200,
      statusText: 'OK',
    },
  },
];

export const networkCallsData = [...Data];
