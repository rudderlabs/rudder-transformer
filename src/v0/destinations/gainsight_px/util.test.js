const { handleHttpRequest } = require('../../../adapters/network');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');
const { objectExists } = require('./util');

jest.mock('../../../adapters/network');

describe('objectExists', () => {
  it('should throw a retryable 500 when the request times out with no response', async () => {
    const timeoutError = Object.assign(new Error('timeout of 60000ms exceeded'), {
      code: 'ECONNABORTED',
    });
    const httpResponse = { success: false, response: timeoutError };
    handleHttpRequest.mockResolvedValueOnce({
      httpResponse,
      processedResponse: processAxiosResponse(httpResponse),
    });

    await expect(
      objectExists('user-1', { apiKey: 'test-api-key' }, 'user', {}),
    ).rejects.toMatchObject({
      message: 'error while fetching user: "[ECONNABORTED] :: Connection aborted"',
      status: 500,
    });
  });
});
