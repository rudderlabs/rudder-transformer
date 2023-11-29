import { getEndPoint } from '../../../../../src/v0/destinations/fb_custom_audience/config';

export const data = [
  {
    name: 'fb_custom_audience',
    description: 'successfully adding users to audience',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
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
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: 'Request Processed Successfully',
            destinationResponse: {
              audience_id: 'aud1',
              invalid_entry_samples: {},
              num_invalid_entries: 0,
              num_received: 4,
              session_id: '123',
            },
          },
        },
      },
    },
  },
  {
    name: 'fb_custom_audience',
    description: 'user addition failed due to missing permission',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
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
              schema: [
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
                ['2', '13', '2013', '@09432457768', 'f', 'Ms.', 'ABC', 'ZIP ', '123abc ', 'IN'],
              ],
            },
          },
          body: {
            JSON: {},
            XML: {},
            JSON_ARRAY: {},
            FORM: {},
          },
          files: {},
        },
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            destinationResponse: {
              error: {
                code: 294,
                message:
                  'Missing permission. Please make sure you have ads_management permission and the application is included in the allowlist',
                type: 'GraphMethodException',
              },
              status: 400,
            },
            message:
              'Missing permission. Please make sure you have ads_management permission and the application is included in the allowlist',
            statTags: {
              destType: 'FB_CUSTOM_AUDIENCE',
              destinationId: 'Non-determininable',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'Non-determininable',
            },
            status: 400,
          },
        },
      },
    },
  },
  {
    name: 'fb_custom_audience',
    description: 'user addition failed due to unavailable audience error',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
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
          body: {
            JSON: {},
            XML: {},
            JSON_ARRAY: {},
            FORM: {},
          },
          files: {},
        },
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            destinationResponse: {
              error: {
                code: 1487301,
                message:
                  'Custom Audience Unavailable: The custom audience you are trying to use has not been shared with your ad account',
                type: 'GraphMethodException',
              },
              status: 400,
            },
            message:
              'Custom Audience Unavailable: The custom audience you are trying to use has not been shared with your ad account',
            statTags: {
              destType: 'FB_CUSTOM_AUDIENCE',
              destinationId: 'Non-determininable',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'Non-determininable',
            },
            status: 400,
          },
        },
      },
    },
  },
  {
    name: 'fb_custom_audience',
    description: 'user addition failed because the custom audience has been deleted',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
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
              schema: ['DOBY', 'PHONE', 'GEN', 'FI', 'MADID', 'ZIP', 'ST', 'COUNTRY'],
              data: [['2013', '@09432457768', 'f', 'Ms.', 'ABC', 'ZIP ', '123abc ', 'IN']],
            },
          },
          body: {
            JSON: {},
            XML: {},
            JSON_ARRAY: {},
            FORM: {},
          },
          files: {},
        },
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            destinationResponse: {
              error: {
                code: 1487366,
                message: 'Custom Audience Has Been Deleted',
                type: 'GraphMethodException',
              },
              status: 400,
            },
            message: 'Custom Audience Has Been Deleted',
            statTags: {
              destType: 'FB_CUSTOM_AUDIENCE',
              destinationId: 'Non-determininable',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'Non-determininable',
            },
            status: 400,
          },
        },
      },
    },
  },
  {
    name: 'fb_custom_audience',
    description: 'Failed to update the custom audience for unknown reason',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
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
              schema: ['DOBY', 'PHONE', 'GEN', 'FI', 'MADID', 'ZIP', 'ST', 'COUNTRY'],
              data: [['2013', '@09432457768', 'f', 'Ms.', 'ABC', 'ZIP ', '123abc ', 'IN']],
            },
          },
          body: {
            JSON: {},
            XML: {},
            JSON_ARRAY: {},
            FORM: {},
          },
          files: {},
        },
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            destinationResponse: {
              error: {
                code: 2650,
                message: 'Failed to update the custom audience',
                type: 'GraphMethodException',
              },
              status: 400,
            },
            message: 'Failed to update the custom audience',
            statTags: {
              destType: 'FB_CUSTOM_AUDIENCE',
              destinationId: 'Non-determininable',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'Non-determininable',
            },
            status: 400,
          },
        },
      },
    },
  },
  {
    name: 'fb_custom_audience',
    description:
      'Failed to update the custom audience as excessive number of parameters were passed in the request',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
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
              schema: ['DOBY', 'PHONE', 'GEN', 'FI', 'MADID', 'ZIP', 'ST', 'COUNTRY'],
              data: [['2013', '@09432457768', 'f', 'Ms.', 'ABC', 'ZIP ', '123abc ', 'IN']],
            },
          },
          body: {
            JSON: {},
            XML: {},
            JSON_ARRAY: {},
            FORM: {},
          },
          files: {},
        },
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            destinationResponse: {
              error: {
                code: 105,
                message: 'The number of parameters exceeded the maximum for this operation',
                type: 'GraphMethodException',
              },
              status: 400,
            },
            message: 'The number of parameters exceeded the maximum for this operation',
            statTags: {
              destType: 'FB_CUSTOM_AUDIENCE',
              destinationId: 'Non-determininable',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'Non-determininable',
            },
            status: 400,
          },
        },
      },
    },
  },
  {
    name: 'fb_custom_audience',
    description: 'user update request is throttled due to too many calls to the ad account',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
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
              schema: ['DOBY', 'PHONE', 'GEN', 'FI', 'MADID', 'ZIP', 'ST', 'COUNTRY'],
              data: [['2013', '@09432457768', 'f', 'Ms.', 'ABC', 'ZIP ', '123abc ', 'IN']],
            },
          },
          body: {
            JSON: {},
            XML: {},
            JSON_ARRAY: {},
            FORM: {},
          },
          files: {},
        },
      },
    },
    output: {
      response: {
        status: 429,
        body: {
          output: {
            destinationResponse: {
              error: {
                code: 80003,
                message: 'There have been too many calls to this ad-account.',
                type: 'GraphMethodException',
              },
              status: 429,
            },
            message: 'There have been too many calls to this ad-account.',
            statTags: {
              destType: 'FB_CUSTOM_AUDIENCE',
              destinationId: 'Non-determininable',
              errorCategory: 'network',
              errorType: 'throttled',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'Non-determininable',
            },
            status: 429,
          },
        },
      },
    },
  },
  {
    name: 'fb_custom_audience',
    description: 'user having permission issue while updating audience',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
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
              schema: ['DOBY', 'PHONE', 'GEN', 'FI', 'MADID', 'ZIP', 'ST', 'COUNTRY'],
              data: [['2013', '@09432457768', 'f', 'Ms.', 'ABC', 'ZIP ', '123abc ', 'IN']],
            },
          },
          body: {
            JSON: {},
            XML: {},
            JSON_ARRAY: {},
            FORM: {},
          },
          files: {},
        },
      },
    },
    output: {
      response: {
        status: 403,
        body: {
          output: {
            destinationResponse: {
              error: {
                code: 200,
                fbtrace_id: 'AFfWqjY-_y2Q92DsyJ4DQ6f',
                message: '(#200) The current user can not update audience 23861283180290489',
                type: 'OAuthException',
              },
              status: 403,
            },
            message: '(#200) The current user can not update audience 23861283180290489',
            statTags: {
              destType: 'FB_CUSTOM_AUDIENCE',
              destinationId: 'Non-determininable',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'Non-determininable',
            },
            status: 403,
          },
        },
      },
    },
  },
];
