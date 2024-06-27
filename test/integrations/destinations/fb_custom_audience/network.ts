import { getEndPoint } from '../../../../src/v0/destinations/fb_custom_audience/config';

export const networkCallsData = [
  {
    httpReq: {
      version: '1',
      type: 'REST',
      method: 'DELETE',
      endpoint: getEndPoint('aud1'),
      headers: {
        'test-dest-response-key': 'successResponse',
      },
      params: {
        access_token: 'ABC',
        payload: {
          is_raw: true,
          data_source: {
            sub_type: 'ANYTHING',
          },
          schema: [
            'EMAIL',
            'DOBM',
            'DOBD',
            'DOBY',
            'PHONE',
            'GEN',
            'FI',
            'MADID',
            'ZIP',
            'ST',
            'COUNTRY',
          ],
          data: [
            [
              'shrouti@abc.com',
              '2',
              '13',
              '2013',
              '@09432457768',
              'f',
              'Ms.',
              'ABC',
              'ZIP ',
              '123abc ',
              'IN',
            ],
          ],
        },
      },
      userId: '',
      body: {
        JSON: {},
        XML: {},
        JSON_ARRAY: {},
        FORM: {},
      },
      files: {},
    },
    httpRes: {
      data: {
        audience_id: 'aud1',
        session_id: '123',
        num_received: 4,
        num_invalid_entries: 0,
        invalid_entry_samples: {},
      },
      status: 200,
    },
  },
  {
    httpReq: {
      version: '1',
      type: 'REST',
      method: 'POST',
      endpoint: getEndPoint('aud1'),
      headers: {
        'test-dest-response-key': 'permissionMissingError',
      },
      params: {
        access_token: 'BCD',
        payload: {
          is_raw: true,
          data_source: {
            sub_type: 'ANYTHING',
          },
          schema: ['DOBM', 'DOBD', 'DOBY', 'PHONE', 'GEN', 'FI', 'MADID', 'ZIP', 'ST', 'COUNTRY'],
          data: [['2', '13', '2013', '@09432457768', 'f', 'Ms.', 'ABC', 'ZIP ', '123abc ', 'IN']],
        },
      },
      userId: '',
      body: {
        JSON: {},
        XML: {},
        JSON_ARRAY: {},
        FORM: {},
      },
      files: {},
    },
    httpRes: {
      data: {
        error: {
          code: 294,
          message:
            'Missing permission. Please make sure you have ads_management permission and the application is included in the allowlist',
          type: 'GraphMethodException',
        },
      },
      status: 400,
    },
  },
  {
    httpReq: {
      version: '1',
      type: 'REST',
      method: 'DELETE',
      endpoint: getEndPoint('aud1'),
      headers: {
        'test-dest-response-key': 'audienceUnavailableError',
      },
      params: {
        access_token: 'ABC',
        payload: {
          is_raw: true,
          data_source: {
            sub_type: 'ANYTHING',
          },
          schema: ['DOBY', 'PHONE', 'GEN', 'FI', 'MADID', 'ZIP', 'ST', 'COUNTRY'],
          data: [['2013', '@09432457768', 'f', 'Ms.', 'ABC', 'ZIP ', '123abc ', 'IN']],
        },
      },
      userId: '',
      body: {
        JSON: {},
        XML: {},
        JSON_ARRAY: {},
        FORM: {},
      },
      files: {},
    },
    httpRes: {
      data: {
        error: {
          code: 1487301,
          message:
            'Custom Audience Unavailable: The custom audience you are trying to use has not been shared with your ad account',
          type: 'GraphMethodException',
        },
      },
      status: 400,
    },
  },
  {
    httpReq: {
      version: '1',
      type: 'REST',
      method: 'DELETE',
      endpoint: getEndPoint('aud1'),
      headers: {
        'test-dest-response-key': 'audienceDeletedError',
      },
      params: {
        access_token: 'ABC',
        payload: {
          is_raw: true,
          data_source: {
            sub_type: 'ANYTHING',
          },
          schema: [
            'EMAIL',
            'DOBM',
            'DOBD',
            'DOBY',
            'PHONE',
            'GEN',
            'FI',
            'MADID',
            'ZIP',
            'ST',
            'COUNTRY',
          ],
          data: [
            [
              'shrouti@abc.com',
              '2',
              '13',
              '2013',
              '@09432457768',
              'f',
              'Ms.',
              'ABC',
              'ZIP ',
              '123abc ',
              'IN',
            ],
          ],
        },
      },
      userId: '',
      body: {
        JSON: {},
        XML: {},
        JSON_ARRAY: {},
        FORM: {},
      },
      files: {},
    },
    httpRes: {
      data: {
        error: {
          code: 1487366,
          message: 'Custom Audience Has Been Deleted',
          type: 'GraphMethodException',
        },
      },
      status: 400,
    },
  },
  {
    httpReq: {
      version: '1',
      type: 'REST',
      method: 'DELETE',
      endpoint: getEndPoint('aud1'),
      headers: {
        'test-dest-response-key': 'failedToUpdateAudienceError',
      },
      params: {
        access_token: 'ABC',
        payload: {
          is_raw: true,
          data_source: {
            sub_type: 'ANYTHING',
          },
          schema: [
            'EMAIL',
            'DOBM',
            'DOBD',
            'DOBY',
            'PHONE',
            'GEN',
            'FI',
            'MADID',
            'ZIP',
            'ST',
            'COUNTRY',
          ],
          data: [
            [
              'shrouti@abc.com',
              '2',
              '13',
              '2013',
              '@09432457768',
              'f',
              'Ms.',
              'ABC',
              'ZIP ',
              '123abc ',
              'IN',
            ],
          ],
        },
      },
      userId: '',
      body: {
        JSON: {},
        XML: {},
        JSON_ARRAY: {},
        FORM: {},
      },
      files: {},
    },
    httpRes: {
      data: {
        error: {
          code: 2650,
          message: 'Failed to update the custom audience',
          type: 'GraphMethodException',
        },
      },
      status: 400,
    },
  },
  {
    httpReq: {
      version: '1',
      type: 'REST',
      method: 'DELETE',
      endpoint: getEndPoint('aud1'),
      headers: {
        'test-dest-response-key': 'parameterExceededError',
      },
      params: {
        access_token: 'ABC',
        payload: {
          is_raw: true,
          data_source: {
            sub_type: 'ANYTHING',
          },
          schema: [
            'EMAIL',
            'DOBM',
            'DOBD',
            'DOBY',
            'PHONE',
            'GEN',
            'FI',
            'MADID',
            'ZIP',
            'ST',
            'COUNTRY',
          ],
          data: [
            [
              'shrouti@abc.com',
              '2',
              '13',
              '2013',
              '@09432457768',
              'f',
              'Ms.',
              'ABC',
              'ZIP ',
              '123abc ',
              'IN',
            ],
          ],
        },
      },
      userId: '',
      body: {
        JSON: {},
        XML: {},
        JSON_ARRAY: {},
        FORM: {},
      },
      files: {},
    },
    httpRes: {
      data: {
        error: {
          code: 105,
          message: 'The number of parameters exceeded the maximum for this operation',
          type: 'GraphMethodException',
        },
      },
      status: 400,
    },
  },
  {
    httpReq: {
      version: '1',
      type: 'REST',
      method: 'DELETE',
      endpoint: getEndPoint('aud1'),
      headers: {
        'test-dest-response-key': 'tooManyCallsError',
      },
      params: {
        access_token: 'ABC',
        payload: {
          is_raw: true,
          data_source: {
            sub_type: 'ANYTHING',
          },
          schema: [
            'EMAIL',
            'DOBM',
            'DOBD',
            'DOBY',
            'PHONE',
            'GEN',
            'FI',
            'MADID',
            'ZIP',
            'ST',
            'COUNTRY',
          ],
          data: [
            [
              'shrouti@abc.com',
              '2',
              '13',
              '2013',
              '@09432457768',
              'f',
              'Ms.',
              'ABC',
              'ZIP ',
              '123abc ',
              'IN',
            ],
          ],
        },
      },
      userId: '',
      body: {
        JSON: {},
        XML: {},
        JSON_ARRAY: {},
        FORM: {},
      },
      files: {},
    },
    httpRes: {
      data: {
        error: {
          code: 80003,
          message: 'There have been too many calls to this ad-account.',
          type: 'GraphMethodException',
        },
      },
      status: 429,
    },
  },
  {
    httpReq: {
      version: '1',
      type: 'REST',
      method: 'DELETE',
      endpoint: getEndPoint('aud1'),
      headers: {
        'test-dest-response-key': 'code200PermissionError',
      },
      params: {
        access_token: 'ABC',
        payload: {
          is_raw: true,
          data_source: {
            sub_type: 'ANYTHING',
          },
          schema: [
            'EMAIL',
            'DOBM',
            'DOBD',
            'DOBY',
            'PHONE',
            'GEN',
            'FI',
            'MADID',
            'ZIP',
            'ST',
            'COUNTRY',
          ],
          data: [
            [
              'shrouti@abc.com',
              '2',
              '13',
              '2013',
              '@09432457768',
              'f',
              'Ms.',
              'ABC',
              'ZIP ',
              '123abc ',
              'IN',
            ],
          ],
        },
      },
      userId: '',
      body: {
        JSON: {},
        XML: {},
        JSON_ARRAY: {},
        FORM: {},
      },
      files: {},
    },
    httpRes: {
      data: {
        error: {
          code: 200,
          fbtrace_id: 'AFfWqjY-_y2Q92DsyJ4DQ6f',
          message: '(#200) The current user can not update audience 23861283180290489',
          type: 'OAuthException',
        },
      },
      status: 403,
    },
  },
  {
    httpReq: {
      version: '1',
      type: 'REST',
      method: 'DELETE',
      endpoint: getEndPoint('aud1'),
      headers: {
        'test-dest-response-key': 'accessTokenInvalidError',
      },
      params: {
        access_token: 'ABC',
        payload: {
          is_raw: true,
          data_source: {
            sub_type: 'ANYTHING',
          },
          schema: ['DOBY', 'PHONE', 'GEN', 'FI', 'MADID', 'ZIP', 'ST', 'COUNTRY'],
          data: [['2013', '@09432457768', 'f', 'Ms.', 'ABC', 'ZIP ', '123abc ', 'IN']],
        },
      },
      userId: '',
      body: {
        JSON: {},
        XML: {},
        JSON_ARRAY: {},
        FORM: {},
      },
      files: {},
    },
    httpRes: {
      data: {
        error: {
          message:
            'Error validating access token: Session has expired on Tuesday, 01-Aug-23 10:12:14 PDT. The current time is Sunday, 28-Jan-24 16:01:17 PST.',
          type: 'OAuthException',
          code: 190,
          error_subcode: 463,
          fbtrace_id: 'A3b8C6PpI-kdIOwPwV4PANi',
        },
      },
      status: 400,
    },
  },
  {
    httpReq: {
      version: '1',
      type: 'REST',
      method: 'DELETE',
      endpoint: getEndPoint('aud1'),
      headers: {
        'test-dest-response-key': 'htmlResponse',
      },
      params: {
        access_token: 'ABC',
        payload: {
          is_raw: true,
          data_source: {
            sub_type: 'ANYTHING',
          },
          schema: [
            'EMAIL',
            'DOBM',
            'DOBD',
            'DOBY',
            'PHONE',
            'GEN',
            'FI',
            'MADID',
            'ZIP',
            'ST',
            'COUNTRY',
          ],
          data: [
            [
              'shrouti@abc.com',
              '2',
              '13',
              '2013',
              '@09432457768',
              'f',
              'Ms.',
              'ABC',
              'ZIP ',
              '123abc ',
              'IN',
            ],
          ],
        },
      },
      userId: '',
      body: {
        JSON: {},
        XML: {},
        JSON_ARRAY: {},
        FORM: {},
      },
      files: {},
    },
    httpRes: {
      data: '<!DOCTYPE html><html> <body> <h1>My First Heading</h1><p>My first paragraph.</p> </body></html>',
      status: 400,
    },
  },
  {
    httpReq: {
      version: '1',
      type: 'REST',
      method: 'DELETE',
      endpoint: getEndPoint('aud-value-based'),
      headers: {
        'test-dest-response-key': 'validAccessToken',
      },
      params: {
        access_token: 'ABC',
        payload: {
          is_raw: true,
          data_source: {
            sub_type: 'ANYTHING',
          },
          schema: ['DOBY', 'PHONE', 'GEN', 'FI', 'MADID', 'ZIP', 'ST', 'COUNTRY'],
          data: [['2013', '@09432457768', 'f', 'Ms.', 'ABC', 'ZIP ', '123abc ', 'IN']],
        },
      },
      userId: '',
      body: {
        JSON: {},
        XML: {},
        JSON_ARRAY: {},
        FORM: {},
      },
      files: {},
    },
    httpRes: {
      data: {
        error: {
          message: '(#100) Value-Based Custom Audience requires LOOKALIKE_VALUE attribute.',
          type: 'OAuthException',
          code: 100,
          fbtrace_id: 'ADB2jAGDMC_CbfM9430kDdQ',
        },
      },
      status: 400,
    },
  },
];
