export const data = [
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
            FORM: {
              data: [
                '{"user_data":{"external_id":"c58f05b5e3cc4796f3181cf07349d306547c00b20841a175b179c6860e6a34ab","client_ip_address":"32.122.223.26","client_user_agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Mobile/15E148 Safari/604.1"},"event_name":"Checkout Step Viewed","event_time":1654773112,"event_source_url":"https://www.my.kaiser.com/checkout","event_id":"4f002656-a7b2-4c17-b9bd-8caa5a29190a","custom_data":{"checkout_id":"26SF29B","site":"www.my.kaiser.com","step":1}}',
              ],
            },
            JSON: {},
            JSON_ARRAY: {},
          },
          type: 'REST',
          files: {},
          method: 'POST',
          userId: '',
          headers: {},
          version: '1',
          endpoint:
            'https://graph.facebook.com/v17.0/1234567891234567/events?access_token=invalid_access_token',
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
            message: 'Invalid OAuth 2.0 access token',
            destinationResponse: {
              error: {
                message: 'The access token could not be decrypted',
                type: 'OAuthException',
                code: 190,
                fbtrace_id: 'fbpixel_trace_id',
              },
              status: 500,
            },
            statTags: {
              destType: 'FACEBOOK_PIXEL',
              errorCategory: 'network',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
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
            FORM: {
              data: [
                '{"user_data":{"external_id":"c58f05b5e3cc4796f3181cf07349d306547c00b20841a175b179c6860e6a34ab","client_ip_address":"32.122.223.26","client_user_agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Mobile/15E148 Safari/604.1"},"event_name":"Checkout Step Viewed","event_time":1654773112,"event_source_url":"https://www.my.kaiser.com/checkout","event_id":"4f002656-a7b2-4c17-b9bd-8caa5a29190a","custom_data":{"checkout_id":"26SF29B","site":"www.my.kaiser.com","step":1}}',
              ],
            },
            JSON: {},
            JSON_ARRAY: {},
          },
          type: 'REST',
          files: {},
          method: 'POST',
          userId: '',
          headers: {},
          version: '1',
          endpoint:
            'https://graph.facebook.com/v17.0/1234567891234567/events?access_token=my_access_token',
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
            FORM: {
              data: [
                '{"user_data":{"external_id":"c58f05b5e3cc4796f3181cf07349d306547c00b20841a175b179c6860e6a34ab","client_ip_address":"32.122.223.26","client_user_agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Mobile/15E148 Safari/604.1"},"event_name":"Checkout Step Viewed","event_time":1654772112,"event_source_url":"https://www.my.kaiser.com/checkout","event_id":"4f002656-a7b2-4c17-b9bd-8caa5a29190a","custom_data":{"checkout_id":"26SF29B","site":"www.my.kaiser.com","step":1}}',
              ],
            },
            JSON: {},
            JSON_ARRAY: {},
          },
          type: 'REST',
          files: {},
          method: 'POST',
          userId: '',
          headers: {},
          version: '1',
          endpoint:
            'https://graph.facebook.com/v17.0/1234567891234567/events?access_token=invalid_timestamp_correct_access_token',
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
            message: 'Event Timestamp Too Old',
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
            statTags: {
              destType: 'FACEBOOK_PIXEL',
              errorCategory: 'network',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
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
            FORM: {
              data: [
                '{"user_data":{"external_id":"c58f05b5e3cc4796f3181cf07349d306547c00b20841a175b179c6860e6a34ab","client_ip_address":"32.122.223.26","client_user_agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Mobile/15E148 Safari/604.1"},"event_name":"Checkout Step Viewed","event_time":1654772112,"event_source_url":"https://www.my.kaiser.com/checkout","event_id":"4f002656-a7b2-4c17-b9bd-8caa5a29190a","custom_data":{"checkout_id":"26SF29B","site":"www.my.kaiser.com","step":1}}',
              ],
            },
            JSON: {},
            JSON_ARRAY: {},
          },
          type: 'REST',
          files: {},
          method: 'POST',
          userId: '',
          headers: {},
          version: '1',
          endpoint:
            'https://graph.facebook.com/v17.0/1234567891234567/events?access_token=throttled_valid_access_token',
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
            message: 'API User Too Many Calls',
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
              destType: 'FACEBOOK_PIXEL',
              errorCategory: 'network',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
              errorType: 'throttled',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
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
            FORM: {
              data: [
                '{"user_data":{"external_id":"c58f05b5e3cc4796f3181cf07349d306547c00b20841a175b179c6860e6a34ab","client_ip_address":"32.122.223.26","client_user_agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Mobile/15E148 Safari/604.1"},"event_name":"Checkout Step Viewed","event_time":1654772112,"event_source_url":"https://www.my.kaiser.com/checkout","event_id":"4f002656-a7b2-4c17-b9bd-8caa5a29190a","custom_data":{"checkout_id":"26SF29B","site":"www.my.kaiser.com","step":1}}',
              ],
            },
            JSON: {},
            JSON_ARRAY: {},
          },
          type: 'REST',
          files: {},
          method: 'POST',
          userId: '',
          headers: {},
          version: '1',
          endpoint:
            'https://graph.facebook.com/v17.0/1234567891234567/events?access_token=invalid_account_id_valid_access_token',
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
              "Object with ID 'PIXEL_ID' / 'DATASET_ID' / 'AUDIENCE_ID' does not exist, cannot be loaded due to missing permissions, or does not support this operation",
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
            statTags: {
              destType: 'FACEBOOK_PIXEL',
              errorCategory: 'network',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
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
            FORM: {
              data: [
                '{"user_data":{"external_id":"d58f05b5e3cc4796f3181cf07349d306547c00b20841a175b179c6860e6a34ab","client_ip_address":"32.122.223.26","client_user_agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Mobile/15E148 Safari/604.1"},"event_name":"Checkout Step Viewed","event_time":1654772112,"event_source_url":"https://www.my.kaiser.com/checkout","event_id":"4f002656-a7b2-4c17-b9bd-8caa5a29190a","custom_data":{"checkout_id":"26SF29B","site":"www.my.kaiser.com","step":1}}',
              ],
            },
            JSON: {},
            JSON_ARRAY: {},
          },
          type: 'REST',
          files: {},
          method: 'POST',
          userId: '',
          headers: {},
          version: '1',
          endpoint:
            'https://graph.facebook.com/v17.0/1234567891234567/events?access_token=not_found_access_token',
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
            message: 'Invalid Parameter',
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
            statTags: {
              destType: 'FACEBOOK_PIXEL',
              errorCategory: 'network',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
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
            FORM: {
              data: [
                '{"user_data":{"external_id":"c58f05b5e3cc4796f3181cf07349d306547c00b20841a175b179c6860e6a34ab","client_ip_address":"32.122.223.26","client_user_agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Mobile/15E148 Safari/604.1"},"event_name":"Checkout Step Viewed","event_time":1654772112,"event_source_url":"https://www.my.kaiser.com/checkout","event_id":"4f002656-a7b2-4c17-b9bd-8caa5a29190a","custom_data":{"checkout_id":"26SF29B","site":"www.my.kaiser.com","step":1}}',
              ],
            },
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
          endpoint:
            'https://graph.facebook.com/v17.0/1234567891234570/events?access_token=valid_access_token',
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
            message: 'Invalid Parameter',
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
            statTags: {
              destType: 'FACEBOOK_PIXEL',
              errorCategory: 'network',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
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
            FORM: {
              data: [
                '{"user_data":{"external_id":"c58f05b5e3cc4796f3181cf07349d306547c00b20841a175b179c6860e6a34ab","client_ip_address":"32.122.223.26","client_user_agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Mobile/15E148 Safari/604.1"},"event_name":"Checkout Step Viewed","event_time":1654772112,"event_source_url":"https://www.my.kaiser.com/checkout","event_id":"4f002656-a7b2-4c17-b9bd-8caa5a29190a","custom_data":{"checkout_id":"26SF29B","site":"www.my.kaiser.com","step":1}}',
              ],
            },
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
          endpoint:
            'https://graph.facebook.com/v17.0/1234567891234571/events?access_token=valid_access_token',
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
            message: 'Capability or permissions issue.',
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
            statTags: {
              destType: 'FACEBOOK_PIXEL',
              errorCategory: 'network',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
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
            FORM: {
              data: [
                '{"user_data":{"external_id":"c58f05b5e3cc4796f3181cf07349d306547c00b20841a175b179c6860e6a34ab","client_ip_address":"32.122.223.26","client_user_agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Mobile/15E148 Safari/604.1"},"event_name":"Checkout Step Viewed","event_time":1654772112,"event_source_url":"https://www.my.kaiser.com/checkout","event_id":"4f002656-a7b2-4c17-b9bd-8caa5a29190a","custom_data":{"checkout_id":"26SF29B","site":"www.my.kaiser.com","step":1}}',
              ],
            },
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
          endpoint:
            'https://graph.facebook.com/v17.0/1234567891234572/events?access_token=valid_access_token_unhandled_response',
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
            message: 'Unhandled random error',
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
              destType: 'FACEBOOK_PIXEL',
              errorCategory: 'network',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
              errorType: 'retryable',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              meta: 'unhandledStatusCode',
            },
          },
        },
      },
    },
  },
];
