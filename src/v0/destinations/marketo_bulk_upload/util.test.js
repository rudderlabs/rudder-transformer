const util = require('./util.js');
const axios = require('axios');
const networkAdapter = require('../../../adapters/network');
const { handleHttpRequest } = networkAdapter;

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
});
