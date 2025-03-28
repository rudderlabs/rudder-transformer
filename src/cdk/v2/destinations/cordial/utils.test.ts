jest.mock('../../../../adapters/network');

import { checkIfContactExists } from './utils';
import { handleHttpRequest } from '../../../../adapters/network';

describe('cordial utils', () => {
  describe('checkIfContactExists', () => {
    const mockConfig = {
      apiKey: 'test-api-key',
      apiBaseUrl: 'https://api.cordial.com',
    };

    const cases = [
      {
        name: 'returns true when contact exists with contactId',
        contactId: '123',
        email: undefined,
        response: { status: 200, response: { _id: 'existing-id' } },
        expected: true,
      },
      {
        name: 'returns true when contact exists with email',
        contactId: undefined,
        email: 'test@example.com',
        response: { status: 200, response: { _id: 'existing-id' } },
        expected: true,
      },
      {
        name: 'returns false when contact does not exist',
        contactId: '123',
        email: undefined,
        response: { status: 404, response: {} },
        expected: false,
      },
      {
        name: 'returns false when response has no id',
        contactId: '123',
        email: undefined,
        response: { status: 200, response: {} },
        expected: false,
      },
    ];

    test.each(cases)('$name', async ({ contactId, email, response, expected }) => {
      (handleHttpRequest as jest.Mock).mockResolvedValueOnce({ processedResponse: response });

      const result = await checkIfContactExists(mockConfig, contactId, email);
      expect(result).toBe(expected);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });
});
