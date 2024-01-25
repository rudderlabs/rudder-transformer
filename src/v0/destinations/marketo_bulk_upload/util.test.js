const util = require('./util.js');
const networkAdapter = require('../../../adapters/network');
const { handleHttpRequest } = networkAdapter;
const {
  RetryableError,
  NetworkError,
  TransformationError,
} = require('@rudderstack/integrations-lib');

// Mock the handleHttpRequest function
jest.mock('../../../adapters/network');

const successfulResponse = {
  status: 200,
  response: {
    access_token: '<dummy-access-token>',
    token_type: 'bearer',
    expires_in: 3600,
    scope: 'dummy@scope.com',
    success: true,
  },
};

const unsuccessfulResponse = {
  status: 400,
  response: '[ENOTFOUND] :: DNS lookup failed',
};

const emptyResponse = {
  response: '',
};

const invalidClientErrorResponse = {
  status: 401,
  response: {
    error: 'invalid_client',
    error_description: 'Bad client credentials',
  },
};
describe('util.getAccessToken', () => {
  beforeEach(() => {
    handleHttpRequest.mockClear();
  });

  it('should retrieve and return access token on successful response', async () => {
    const url =
      'https://dummyMunchkinId.mktorest.com/identity/oauth/token?client_id=dummyClientId&client_secret=dummyClientSecret&grant_type=client_credentials';

    handleHttpRequest.mockResolvedValueOnce({
      processedResponse: successfulResponse,
    });

    const config = {
      clientId: 'dummyClientId',
      clientSecret: 'dummyClientSecret',
      munchkinId: 'dummyMunchkinId',
    };

    const result = await util.getAccessToken(config);
    expect(result).toBe('<dummy-access-token>');
    expect(handleHttpRequest).toHaveBeenCalledTimes(1);
    // Ensure your mock response structure is consistent with the actual behavior
    expect(handleHttpRequest).toHaveBeenCalledWith('get', url, {
      destType: 'marketo_bulk_upload',
      feature: 'transformation',
    });
  });

  it('should throw a NetworkError on unsuccessful HTTP status', async () => {
    handleHttpRequest.mockResolvedValueOnce({
      processedResponse: unsuccessfulResponse,
    });

    const config = {
      clientId: 'dummyClientId',
      clientSecret: 'dummyClientSecret',
      munchkinId: 'dummyMunchkinId',
    };

    await expect(util.getAccessToken(config)).rejects.toThrow(NetworkError);
  });

  it('should throw a RetryableError when expires_in is 0', async () => {
    handleHttpRequest.mockResolvedValueOnce({
      processedResponse: {
        ...successfulResponse,
        response: { ...successfulResponse.response, expires_in: 0 },
      },
    });

    const config = {
      clientId: 'dummyClientId',
      clientSecret: 'dummyClientSecret',
      munchkinId: 'dummyMunchkinId',
    };

    await expect(util.getAccessToken(config)).rejects.toThrow(RetryableError);
  });

  it('should throw an AbortedError on unsuccessful response', async () => {
    handleHttpRequest.mockResolvedValueOnce({ processedResponse: invalidClientErrorResponse });

    const config = {
      clientId: 'invalidClientID',
      clientSecret: 'dummyClientSecret',
      munchkinId: 'dummyMunchkinId',
    };

    await expect(util.getAccessToken(config)).rejects.toThrow(NetworkError);
  });

  it('should throw transformation error response', async () => {
    handleHttpRequest.mockResolvedValueOnce({ processedResponse: emptyResponse });

    const config = {
      clientId: 'dummyClientId',
      clientSecret: 'dummyClientSecret',
      munchkinId: 'dummyMunchkinId',
    };

    await expect(util.getAccessToken(config)).rejects.toThrow(TransformationError);
  });
});
