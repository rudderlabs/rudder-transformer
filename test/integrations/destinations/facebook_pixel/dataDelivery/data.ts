import { VERSION } from '../../../../../src/v0/destinations/facebook_pixel/config';
import { testScenariosForV1API, testFormData, statTags as baseStatTags } from './business';
import { otherScenariosV1 } from './other';
import { oauthScenariosV1 } from './oauth';

const statTags = {
  ...baseStatTags,
  destinationId: 'Non-determininable',
  workspaceId: 'Non-determininable',
};

export const v0TestData = [
  {
    name: 'facebook_pixel',
    description: 'Test 0',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          body: {
            XML: {},
            FORM: testFormData,
            JSON: {},
            JSON_ARRAY: {},
          },
          type: 'REST',
          files: {},
          method: 'POST',
          userId: '',
          headers: {},
          version: '1',
          endpoint: `https://graph.facebook.com/${VERSION}/1234567891234567/events?access_token=invalid_access_token`,
          params: {
            destination: 'facebook_pixel',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            status: 400,
            message:
              'The access token could not be decrypted. Facebook responded with error code: 190',
            destinationResponse: {
              error: {
                code: 190,
                fbtrace_id: 'fbpixel_trace_id',
                message: 'The access token could not be decrypted',
                error_user_msg: 'The access token could not be decrypted',
                type: 'OAuthException',
              },
              status: 500,
            },
            statTags: {
              ...statTags,
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              meta: 'accessTokenExpired',
            },
          },
        },
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 1',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          body: {
            XML: {},
            FORM: testFormData,
            JSON: {},
            JSON_ARRAY: {},
          },
          type: 'REST',
          files: {},
          method: 'POST',
          userId: '',
          headers: {},
          version: '1',
          endpoint: `https://graph.facebook.com/${VERSION}/1234567891234567/events?access_token=my_access_token`,
          params: {
            destination: 'facebook_pixel',
          },
        },
        method: 'POST',
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
              events_received: 1,
              fbtrace_id: 'facebook_trace_id',
            },
          },
        },
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 2',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          body: {
            XML: {},
            FORM: testFormData,
            JSON: {},
            JSON_ARRAY: {},
          },
          type: 'REST',
          files: {},
          method: 'POST',
          userId: '',
          headers: {},
          version: '1',
          endpoint: `https://graph.facebook.com/${VERSION}/1234567891234567/events?access_token=invalid_timestamp_correct_access_token`,
          params: {
            destination: 'facebook_pixel',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            status: 400,
            message:
              'Event Timestamp Too Old. Facebook responded with error code: 100 and sub-code: 2804003',
            destinationResponse: {
              error: {
                message: 'Invalid parameter',
                type: 'OAuthException',
                code: 100,
                error_subcode: 2804003,
                is_transient: false,
                error_user_title: 'Event Timestamp Too Old',
                error_user_msg:
                  'The timestamp for this event is too far in the past. Events need to be sent from your server within 7 days of when they occurred. Enter a timestamp that has occurred within the last 7 days.',
                fbtrace_id: 'A6UyEgg_HdoiRX9duxcBOjb',
              },
              status: 400,
            },
            statTags,
          },
        },
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 3',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          body: {
            XML: {},
            FORM: testFormData,
            JSON: {},
            JSON_ARRAY: {},
          },
          type: 'REST',
          files: {},
          method: 'POST',
          userId: '',
          headers: {},
          version: '1',
          endpoint: `https://graph.facebook.com/${VERSION}/1234567891234567/events?access_token=throttled_valid_access_token`,
          params: {
            destination: 'facebook_pixel',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 429,
        body: {
          output: {
            status: 429,
            message: 'User request limit reached. Facebook responded with error code: 17',
            destinationResponse: {
              error: {
                message: 'User request limit reached',
                type: 'OAuthException',
                code: 17,
                fbtrace_id: 'facebook_px_trace_id_4',
              },
              status: 500,
            },
            statTags: {
              ...statTags,
              errorType: 'throttled',
            },
          },
        },
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 4',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          body: {
            XML: {},
            FORM: testFormData,
            JSON: {},
            JSON_ARRAY: {},
          },
          type: 'REST',
          files: {},
          method: 'POST',
          userId: '',
          headers: {},
          version: '1',
          endpoint: `https://graph.facebook.com/${VERSION}/1234567891234567/events?access_token=invalid_account_id_valid_access_token`,
          params: {
            destination: 'facebook_pixel',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            status: 400,
            message:
              "Object with ID 'PIXEL_ID' / 'DATASET_ID' / 'AUDIENCE_ID' does not exist, cannot be loaded due to missing permissions, or does not support this operation. Facebook responded with error code: 100 and sub-code: 33",
            destinationResponse: {
              error: {
                message:
                  "Unsupported post request. Object with ID '1234567891234569' does not exist, cannot be loaded due to missing permissions, or does not support this operation. Please read the Graph API documentation at https://developers.facebook.com/docs/graph-api",
                type: 'GraphMethodException',
                code: 100,
                error_subcode: 33,
                fbtrace_id: 'facebook_px_trace_id_5',
              },
              status: 400,
            },
            statTags,
          },
        },
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 5',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          body: {
            XML: {},
            FORM: testFormData,
            JSON: {},
            JSON_ARRAY: {},
          },
          type: 'REST',
          files: {},
          method: 'POST',
          userId: '',
          headers: {},
          version: '1',
          endpoint: `https://graph.facebook.com/${VERSION}/1234567891234567/events?access_token=not_found_access_token`,
          params: {
            destination: 'facebook_pixel',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            status: 400,
            message: 'Invalid Parameter. Facebook responded with error code: 100 and sub-code: 34',
            destinationResponse: {
              error: {
                message: 'Invalid Parameter',
                type: 'GraphMethodException',
                code: 100,
                error_subcode: 34,
                fbtrace_id: 'facebook_px_trace_id_6',
              },
              status: 404,
            },
            statTags,
          },
        },
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 6',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          body: {
            XML: {},
            FORM: testFormData,
            JSON: {},
            JSON_ARRAY: {},
          },
          type: 'REST',
          files: {},
          method: 'POST',
          params: {
            destination: 'facebook_pixel',
          },
          userId: '',
          headers: {},
          version: '1',
          endpoint: `https://graph.facebook.com/${VERSION}/1234567891234570/events?access_token=valid_access_token`,
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            status: 400,
            message:
              'Unsupported post request. some problem with sent parameters. Facebook responded with error code: 100 and sub-code: 38',
            destinationResponse: {
              error: {
                message: 'Unsupported post request. some problem with sent parameters',
                type: 'GraphMethodException',
                code: 100,
                error_subcode: 38,
                fbtrace_id: 'facebook_px_trace_id_6',
              },
              status: 400,
            },
            statTags,
          },
        },
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 7',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          body: {
            XML: {},
            FORM: testFormData,
            JSON: {},
            JSON_ARRAY: {},
          },
          type: 'REST',
          files: {},
          method: 'POST',
          params: {
            destination: 'facebook_pixel',
          },
          userId: '',
          headers: {},
          version: '1',
          endpoint: `https://graph.facebook.com/${VERSION}/1234567891234571/events?access_token=valid_access_token`,
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            status: 400,
            message:
              'Some error in permission. Facebook responded with error code: 3 and sub-code: 10',
            destinationResponse: {
              error: {
                message: 'Some error in permission',
                type: 'GraphMethodException',
                code: 3,
                error_subcode: 10,
                fbtrace_id: 'facebook_px_trace_id_7',
              },
              status: 500,
            },
            statTags,
          },
        },
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 8',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          body: {
            XML: {},
            FORM: testFormData,
            JSON: {},
            JSON_ARRAY: {},
          },
          type: 'REST',
          files: {},
          method: 'POST',
          params: {
            destination: 'facebook_pixel',
          },
          userId: '',
          headers: {},
          version: '1',
          endpoint: `https://graph.facebook.com/${VERSION}/1234567891234572/events?access_token=valid_access_token_unhandled_response`,
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500,
        body: {
          output: {
            status: 500,
            message: `${JSON.stringify({
              message: 'Unhandled random error',
              type: 'RandomException',
              code: 5,
              error_subcode: 12,
              fbtrace_id: 'facebook_px_trace_id_10',
            })}. Facebook responded with error code: 5 and sub-code: 12`,
            destinationResponse: {
              error: {
                message: 'Unhandled random error',
                type: 'RandomException',
                code: 5,
                error_subcode: 12,
                fbtrace_id: 'facebook_px_trace_id_10',
              },
              status: 412,
            },
            statTags: {
              ...statTags,
              errorType: 'retryable',
              meta: 'unhandledStatusCode',
            },
          },
        },
      },
    },
  },

  {
    name: 'facebook_pixel',
    description: 'Test 10: should handle error with code: 100 & subcode: 2804009',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          body: {
            XML: {},
            FORM: testFormData,
            JSON: {},
            JSON_ARRAY: {},
          },
          type: 'REST',
          files: {},
          method: 'POST',
          userId: '',
          headers: {},
          version: '1',
          endpoint: `https://graph.facebook.com/${VERSION}/12345678912804009/events?access_token=2804009_valid_access_token`,
          params: {
            destination: 'facebook_pixel',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            status: 400,
            message:
              'Your purchase event doesn’t include a value parameter. Enter a value. For example: 1.99. Facebook responded with error code: 100 and sub-code: 2804009',
            destinationResponse: {
              error: {
                message: 'Invalid parameter',
                type: 'OAuthException',
                code: 100,
                error_user_msg:
                  'Your purchase event doesn’t include a value parameter. Enter a value. For example: 1.99',
                error_user_title: 'Missing Value for Purchase Event',
                error_subcode: 2804009,
                is_transient: false,
                fbtrace_id: 'AP4G-xxxxxxxx',
              },
              status: 400,
            },
            statTags: {
              ...statTags,
              errorType: 'aborted',
            },
          },
        },
      },
    },
  },
  {
    name: 'facebook_pixel',
    description: 'Test 9: should handle error with code: 21009',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          body: {
            XML: {},
            FORM: testFormData,
            JSON: {},
            JSON_ARRAY: {},
          },
          type: 'REST',
          files: {},
          method: 'POST',
          userId: '',
          headers: {},
          version: '1',
          endpoint: `https://graph.facebook.com/${VERSION}/1234567891234567/events?access_token=unhandled_error_code_21009`,
          params: {
            destination: 'facebook_pixel',
          },
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 500,
        body: {
          output: {
            status: 500,
            message:
              '(#21009) The data set upload is temporarily not ready.. Facebook responded with error code: 21009',
            destinationResponse: {
              error: {
                message: '(#21009) The data set upload is temporarily not ready.',
                type: 'OAuthException',
                code: 21009,
                fbtrace_id: 'dDu39o39lkeo8',
              },
              status: 400,
            },
            statTags: {
              ...statTags,
              errorType: 'retryable',
            },
          },
        },
      },
    },
  },
];

export const data = [
  ...v0TestData,
  ...testScenariosForV1API,
  ...otherScenariosV1,
  ...oauthScenariosV1,
];
