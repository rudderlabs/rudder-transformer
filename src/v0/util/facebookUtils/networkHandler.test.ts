const { NetworkError, ConfigurationAuthError } = require('@rudderstack/integrations-lib');

const { errorResponseHandler } = require('./networkHandler');

type CommonErrorType = {
  status: number;
  message: string;
};

describe('errorResponseHandler', () => {
  it('should return successfully when there is no error in the response', () => {
    const destResponse = {
      response: {
        error: null,
      },
    };

    expect(() => errorResponseHandler(destResponse)).not.toThrow();
  });

  it('should throw a ConfigurationAuthError when the error type is AUTH', () => {
    const destResponse = {
      response: {
        error: {
          code: 190,
          error_subcode: 463,
          error_user_msg: 'Invalid OAuth access token.',
        },
      },
      status: 401,
    };

    expect.assertions(3);
    try {
      errorResponseHandler(destResponse);
    } catch (e) {
      expect(e).toBeInstanceOf(ConfigurationAuthError);
      const error = e as CommonErrorType;
      expect(error.message).toBe('Invalid OAuth access token.');
      expect(error.status).toBe(400);
    }
  });

  it('should throw a NetworkError with appropriate status and message when error details are found', () => {
    const destResponse = {
      response: {
        error: {
          code: 100,
          error_subcode: 2804003,
          error_user_title: 'Event sent after seven days.',
        },
      },
      status: 400,
    };

    expect.assertions(3);
    try {
      errorResponseHandler(destResponse);
    } catch (e) {
      expect(e).toBeInstanceOf(NetworkError);
      const error = e as CommonErrorType;
      expect(error.message).toBe('Event sent after seven days.');
      expect(error.status).toBe(400);
    }
  });

  it('should throw a NetworkError with stringified error object when error_user_msg is missing', () => {
    const destResponse = {
      response: {
        error: {
          code: 999,
          error_subcode: 9999,
        },
      },
      status: 500,
    };

    expect.assertions(3);
    try {
      errorResponseHandler(destResponse);
    } catch (e) {
      expect(e).toBeInstanceOf(NetworkError);
      const error = e as CommonErrorType;
      expect(error.message).toBe(
        JSON.stringify({
          code: 999,
          error_subcode: 9999,
        }),
      );
      expect(error.status).toBe(500);
    }
  });

  it('should throw a NetworkError with dynamic error type when error details are found', () => {
    const destResponse = {
      response: {
        error: {
          code: 4,
          error_user_msg: 'Rate limit exceeded.',
        },
      },
      status: 429,
    };

    expect.assertions(3);
    try {
      errorResponseHandler(destResponse);
    } catch (e) {
      expect(e).toBeInstanceOf(NetworkError);
      const error = e as CommonErrorType;
      expect(error.message).toBe('Rate limit exceeded.');
      expect(error.status).toBe(429);
    }
  });

  it('should throw a ConfigurationAuthError when the error type is AUTH and error details are present', () => {
    const destResponse = {
      response: {
        error: {
          code: 190,
          error_subcode: 460,
          error_user_msg: 'Invalid OAuth token.',
        },
      },
      status: 401,
    };

    expect.assertions(3);
    try {
      errorResponseHandler(destResponse);
    } catch (e) {
      expect(e).toBeInstanceOf(ConfigurationAuthError);
      const error = e as CommonErrorType;
      expect(error.message).toBe('Invalid OAuth token.');
      expect(error.status).toBe(400);
    }
  });

  it('should throw a ConfigurationAuthError when the error type is AUTH and message is present', () => {
    const destResponse = {
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
    };

    expect.assertions(3);
    try {
      errorResponseHandler(destResponse);
    } catch (e) {
      expect(e).toBeInstanceOf(ConfigurationAuthError);
      const error = e as CommonErrorType;
      expect(error.message).toBe(
        'The token has expired on Saturday, 23-Sep-23 23:29:14 PDT. The current time is Monday, 07-Apr-25 03:48:44 PDT.',
      );
      expect(error.status).toBe(400);
    }
  });

  it('should throw a ConfigurationAuthError when the error type is AUTH and message is not present', () => {
    const destResponse = {
      response: {
        error: {
          message: '',
          type: 'OAuthException',
          code: 190,
          fbtrace_id: 'AxFa_0JxfQ4sctzqEQisyeJ',
        },
      },
      status: 401,
    };

    expect.assertions(3);
    try {
      errorResponseHandler(destResponse);
    } catch (e) {
      expect(e).toBeInstanceOf(ConfigurationAuthError);
      const error = e as CommonErrorType;
      expect(error.message).toBe('Unknown auth error during response transformation');
      expect(error.status).toBe(400);
    }
  });

  it('should throw a NetworkError with default message for unknown error code', () => {
    const destResponse = {
      response: {
        error: {
          code: 100,
          error_subcode: 9999,
        },
      },
      status: 400,
    };

    expect.assertions(3);
    try {
      errorResponseHandler(destResponse);
    } catch (e) {
      expect(e).toBeInstanceOf(NetworkError);
      const error = e as CommonErrorType;
      expect(error.message).toBe('Unknown failure during response transformation');
      expect(error.status).toBe(400);
    }
  });

  it('should throw a NetworkError with a custom message when error details are fully defined', () => {
    const destResponse = {
      response: {
        error: {
          code: 1487301,
          error_user_msg: 'Custom Audience Unavailable.',
        },
      },
      status: 400,
    };

    expect.assertions(3);
    try {
      errorResponseHandler(destResponse);
    } catch (e) {
      expect(e).toBeInstanceOf(NetworkError);
      const error = e as CommonErrorType;
      expect(error.message).toBe(
        'Custom Audience Unavailable: The custom audience you are trying to use has not been shared with your ad account',
      );
      expect(error.status).toBe(400);
    }
  });

  it('should throw a NetworkError with a rate limit message when error code indicates rate limiting', () => {
    const destResponse = {
      response: {
        error: {
          code: 17,
          error_user_msg: 'Rate limit exceeded.',
        },
      },
      status: 429,
    };

    expect.assertions(3);
    try {
      errorResponseHandler(destResponse);
    } catch (e) {
      expect(e).toBeInstanceOf(NetworkError);
      const error = e as CommonErrorType;
      expect(error.message).toBe('Rate limit exceeded.');
      expect(error.status).toBe(429);
    }
  });

  it('should throw a NetworkError with a generic message when error code is unhandled', () => {
    const destResponse = {
      response: {
        error: {
          code: 9999,
          error_user_msg: 'Unhandled error.',
        },
      },
      status: 500,
    };
    expect.assertions(3);
    try {
      errorResponseHandler(destResponse);
    } catch (e) {
      expect(e).toBeInstanceOf(NetworkError);
      const error = e as CommonErrorType;
      expect(error.message).toBe('Unhandled error.');
      expect(error.status).toBe(500);
    }
  });
});
