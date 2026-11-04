jest.mock('../../../adapters/network');

import { handleHttpRequest } from '../../../adapters/network';
import { processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { createAccount, objectExists, updateAccount } from './util';

const mockHandleHttpRequest = handleHttpRequest as unknown as jest.Mock;

const Config = { apiKey: 'test-api-key' };

describe('objectExists', () => {
  it('should throw a retryable 500 when the request times out with no response', async () => {
    const timeoutError = Object.assign(new Error('timeout of 60000ms exceeded'), {
      code: 'ECONNABORTED',
    });
    mockHandleHttpRequest.mockResolvedValueOnce({
      processedResponse: processAxiosResponse({ success: false, response: timeoutError }),
    });

    await expect(objectExists('user-1', Config, 'user', {})).rejects.toMatchObject({
      message: 'error while fetching user: "[ECONNABORTED] :: Connection aborted"',
      status: 500,
    });
  });

  it('should report a missing user without throwing on 404', async () => {
    mockHandleHttpRequest.mockResolvedValueOnce({
      processedResponse: { status: 404, response: { message: 'not found' } },
    });

    await expect(objectExists('user-1', Config, 'user', {})).resolves.toEqual({
      success: false,
      err: '{"message":"not found"}',
    });
  });
});

describe('account calls', () => {
  it('should report success when the account is created (201)', async () => {
    mockHandleHttpRequest.mockResolvedValueOnce({
      processedResponse: { status: 201, response: '' },
    });

    await expect(createAccount({}, Config, {})).resolves.toEqual({ success: true, err: null });
  });

  it.each([
    ['createAccount', () => createAccount({}, Config, {})],
    ['updateAccount', () => updateAccount('acc-1', {}, Config, {})],
  ])('%s should return the unwrapped error body on 400 without throwing', async (_, call) => {
    mockHandleHttpRequest.mockResolvedValueOnce({
      processedResponse: {
        status: 400,
        response: { externalapierror: { message: 'bad account' } },
      },
    });

    await expect(call()).resolves.toEqual({ success: false, err: '{"message":"bad account"}' });
  });
});
