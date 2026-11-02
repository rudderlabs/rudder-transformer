const { handleHttpRequest } = require('../../../adapters/network');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');
const { objectExists, createAccount, updateAccount } = require('./util');

jest.mock('../../../adapters/network');

const Config = { apiKey: 'test-api-key' };

describe('objectExists', () => {
  it('should throw a retryable 500 when the request times out with no response', async () => {
    const timeoutError = Object.assign(new Error('timeout of 60000ms exceeded'), {
      code: 'ECONNABORTED',
    });
    handleHttpRequest.mockResolvedValueOnce({
      processedResponse: processAxiosResponse({ success: false, response: timeoutError }),
    });

    await expect(objectExists('user-1', Config, 'user', {})).rejects.toMatchObject({
      message: 'error while fetching user: "[ECONNABORTED] :: Connection aborted"',
      status: 500,
    });
  });

  it('should report a missing user without throwing on 404', async () => {
    handleHttpRequest.mockResolvedValueOnce({
      processedResponse: { status: 404, response: { message: 'not found' } },
    });

    await expect(objectExists('user-1', Config, 'user', {})).resolves.toEqual({
      success: false,
      err: '{"message":"not found"}',
    });
  });
});

describe('account calls', () => {
  it('should abort an empty-body 400 on update instead of returning an empty err', async () => {
    handleHttpRequest.mockResolvedValueOnce({ processedResponse: { status: 400, response: '' } });

    await expect(updateAccount('acc-1', {}, Config, {})).rejects.toMatchObject({
      message: 'error while updating account: ',
      status: 400,
    });
  });

  it('should abort an unexpected 2xx on create as 400', async () => {
    handleHttpRequest.mockResolvedValueOnce({ processedResponse: { status: 200, response: '' } });

    await expect(createAccount({}, Config, {})).rejects.toMatchObject({
      message: 'error while creating account: ',
      status: 400,
    });
  });
});
