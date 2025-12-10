const { NetworkError, ConfigurationAuthError } = require('@rudderstack/integrations-lib');
const { errorResponseHandler } = require('./networkHandler');

type CommonErrorType = {
  status: number;
  message: string;
};

describe('errorResponseHandler', () => {
  it('should return successfully when there is no error in the response', () => {
    const destResponse = { response: { error: null } };
    expect(() => errorResponseHandler(destResponse)).not.toThrow();
  });

  const testCases: Array<{
    name: string;
    destResponse: any;
    expectedErrorClass: any;
    expectedMessage: string;
    expectedStatus: number;
  }> = [
    {
      name: 'ConfigurationAuthError with AUTH error',
      destResponse: {
        response: {
          error: {
            code: 190,
            error_subcode: 463,
            error_user_msg: 'Invalid OAuth access token.',
          },
        },
        status: 401,
      },
      expectedErrorClass: ConfigurationAuthError,
      expectedMessage:
        'Invalid OAuth access token.. Facebook responded with error code: 190 and sub-code: 463',
      expectedStatus: 400,
    },
    {
      name: 'NetworkError with user title',
      destResponse: {
        response: {
          error: {
            code: 100,
            error_subcode: 2804003,
            error_user_title: 'Event sent after seven days.',
          },
        },
        status: 400,
      },
      expectedErrorClass: NetworkError,
      expectedMessage:
        'Event sent after seven days.. Facebook responded with error code: 100 and sub-code: 2804003',
      expectedStatus: 400,
    },
    {
      name: 'NetworkError with stringified error object',
      destResponse: {
        response: {
          error: {
            code: 999,
            error_subcode: 9999,
          },
        },
        status: 500,
      },
      expectedErrorClass: NetworkError,
      expectedMessage:
        JSON.stringify({ code: 999, error_subcode: 9999 }) +
        '. Facebook responded with error code: 999 and sub-code: 9999',
      expectedStatus: 500,
    },
    {
      name: 'NetworkError with dynamic error type',
      destResponse: {
        response: {
          error: {
            code: 4,
            error_user_msg: 'Rate limit exceeded.',
          },
        },
        status: 429,
      },
      expectedErrorClass: NetworkError,
      expectedMessage: 'Rate limit exceeded.. Facebook responded with error code: 4',
      expectedStatus: 429,
    },
    {
      name: 'ConfigurationAuthError with error details present',
      destResponse: {
        response: {
          error: {
            code: 190,
            error_subcode: 460,
            error_user_msg: 'Invalid OAuth token.',
          },
        },
        status: 401,
      },
      expectedErrorClass: ConfigurationAuthError,
      expectedMessage:
        'Invalid OAuth token.. Facebook responded with error code: 190 and sub-code: 460',
      expectedStatus: 400,
    },
    {
      name: 'ConfigurationAuthError with OAuthException and message',
      destResponse: {
        response: {
          error: {
            message:
              'The token has expired on Saturday, 23-Sep-23 23:29:14 PDT. The current time is Monday, 07-Apr-25 03:48:44 PDT.',
            type: 'OAuthException',
            code: 190,
            fbtrace_id: 'AxFa_0JxfQ4sctzqEQisyeJ',
          },
        },
        status: 401,
      },
      expectedErrorClass: ConfigurationAuthError,
      expectedMessage:
        'The token has expired on Saturday, 23-Sep-23 23:29:14 PDT. The current time is Monday, 07-Apr-25 03:48:44 PDT.. Facebook responded with error code: 190',
      expectedStatus: 400,
    },
    {
      name: 'ConfigurationAuthError with OAuthException and empty message',
      destResponse: {
        response: {
          error: {
            message: '',
            type: 'OAuthException',
            code: 190,
            fbtrace_id: 'AxFa_0JxfQ4sctzqEQisyeJ',
          },
        },
        status: 401,
      },
      expectedErrorClass: ConfigurationAuthError,
      expectedMessage:
        'Unknown auth error during response transformation. Facebook responded with error code: 190',
      expectedStatus: 400,
    },
    {
      name: 'NetworkError with unknown error code',
      destResponse: {
        response: {
          error: {
            code: 100,
            error_subcode: 9999,
          },
        },
        status: 400,
      },
      expectedErrorClass: NetworkError,
      expectedMessage:
        'Unknown failure during response transformation. Facebook responded with error code: 100 and sub-code: 9999',
      expectedStatus: 400,
    },
    {
      name: 'NetworkError with custom audience message',
      destResponse: {
        response: {
          error: {
            code: 1487301,
            error_user_msg: 'Custom Audience Unavailable.',
          },
        },
        status: 400,
      },
      expectedErrorClass: NetworkError,
      expectedMessage:
        'Custom Audience Unavailable: The custom audience you are trying to use has not been shared with your ad account. Facebook responded with error code: 1487301',
      expectedStatus: 400,
    },
    {
      name: 'NetworkError with rate limiting code',
      destResponse: {
        response: {
          error: {
            code: 17,
            error_user_msg: 'Rate limit exceeded.',
          },
        },
        status: 429,
      },
      expectedErrorClass: NetworkError,
      expectedMessage: 'Rate limit exceeded.. Facebook responded with error code: 17',
      expectedStatus: 429,
    },
    {
      name: 'NetworkError with generic unhandled error',
      destResponse: {
        response: {
          error: {
            code: 9999,
            error_user_msg: 'Unhandled error.',
          },
        },
        status: 500,
      },
      expectedErrorClass: NetworkError,
      expectedMessage: 'Unhandled error.. Facebook responded with error code: 9999',
      expectedStatus: 500,
    },
  ];

  test.each(testCases)(
    '$name',
    ({ destResponse, expectedErrorClass, expectedMessage, expectedStatus }) => {
      expect.assertions(3);
      try {
        errorResponseHandler(destResponse);
      } catch (e) {
        expect(e).toBeInstanceOf(expectedErrorClass);
        const error = e as CommonErrorType;
        expect(error.message).toBe(expectedMessage);
        expect(error.status).toBe(expectedStatus);
      }
    },
  );
});
