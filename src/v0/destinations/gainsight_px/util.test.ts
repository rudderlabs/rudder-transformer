jest.mock('../../../adapters/network');

import { handleHttpRequest } from '../../../adapters/network';
import { processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { objectExists } from './util';

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
