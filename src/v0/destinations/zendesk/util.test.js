const {
  getSourceName,
  getUserIdentities,
  deleteEmailFromUser,
  updatePrimaryEmailOfUser,
  createOrUpdateUser,
  removeUserFromOrganizationMembership,
} = require('./util');
const { handleHttpRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../util');
const { NetworkError } = require('@rudderstack/integrations-lib');

jest.mock('../../../adapters/network');
jest.mock('../../util');
beforeEach(() => {
  jest.clearAllMocks();
});

describe('getSourceName utility test', () => {
  it('send source name from config', () => {
    expect('abc').toEqual(getSourceName({ sourceName: 'abc' }));
  });

  it('send zendesk as the source name from config', () => {
    expect(() => getSourceName({ sourceName: 'Zendesk ' })).toThrow(
      'Invalid source name. The source name `zendesk` is not allowed.',
    );
  });

  it('source name is not configured in config', () => {
    expect('Rudder').toEqual(getSourceName({}));
  });

  it('empty source name is passed in config', () => {
    expect('Rudder').toEqual(getSourceName({ sourceName: '' }));
  });
});

describe('getUserIdentities', () => {
  const endpoint = 'https://rudderstack.zendesk.com/api/v2/users/123/identities';
  const headers = {};
  const metadata = { jobId: 1 };

  const testCases = [
    {
      name: 'should return identities on successful response',
      mockStatus: 200,
      mockResponse: { response: { identities: [{ id: 1, type: 'email' }] } },
      isSuccess: true,
      expected: [{ id: 1, type: 'email' }],
      shouldThrow: false,
    },
    {
      name: 'should return empty array when identities are missing',
      mockStatus: 200,
      mockResponse: { response: {} },
      isSuccess: true,
      expected: undefined,
      shouldThrow: false,
    },
    {
      name: 'should throw NetworkError on failed response',
      mockStatus: 500,
      mockResponse: { response: 'Internal Server Error' },
      isSuccess: false,
      expected: NetworkError,
      shouldThrow: true,
    },
  ];

  testCases.forEach(({ name, mockStatus, mockResponse, isSuccess, expected, shouldThrow }) => {
    it(name, async () => {
      handleHttpRequest.mockResolvedValue({
        processedResponse: {
          status: mockStatus,
          response: mockResponse.response,
        },
      });

      isHttpStatusSuccess.mockReturnValue(isSuccess);

      if (shouldThrow) {
        await expect(getUserIdentities(endpoint, headers, metadata)).rejects.toThrow(NetworkError);
      } else {
        const result = await getUserIdentities(endpoint, headers, metadata);
        expect(result).toEqual(expected);
      }
    });
  });
});

describe('deleteEmailFromUser', () => {
  const endpoint = 'https://rudderstack.zendesk.com/api/v2/users/123/identities/456';
  const headers = {};
  const metadata = { jobId: 1 };

  const testCases = [
    {
      name: 'should successfully delete email when response status is success',
      mockStatus: 200,
      isSuccess: true,
      shouldThrow: false,
    },
    {
      name: 'should throw NetworkError on failure response',
      mockStatus: 404,
      isSuccess: false,
      shouldThrow: true,
    },
  ];

  testCases.forEach(({ name, mockStatus, isSuccess, shouldThrow }) => {
    it(name, async () => {
      handleHttpRequest.mockResolvedValue({
        processedResponse: {
          status: mockStatus,
          response: {},
        },
      });

      isHttpStatusSuccess.mockReturnValue(isSuccess);

      if (shouldThrow) {
        await expect(deleteEmailFromUser(endpoint, headers, metadata)).rejects.toThrow(
          NetworkError,
        );
      } else {
        await expect(deleteEmailFromUser(endpoint, headers, metadata)).resolves.toBeUndefined();
      }
    });
  });
});

describe('updatePrimaryEmailOfUser', () => {
  const endpoint = 'https://rudderstack.zendesk.com/api/v2/users/123/identities/456';
  const headers = {};
  const metadata = { jobId: 1 };
  const payload = { identity: { type: 'email', value: 'example@email.com' } };

  const testCases = [
    {
      name: 'should succeed when response is successful',
      mockStatus: 200,
      isSuccess: true,
      shouldThrow: false,
    },
    {
      name: 'should throw NetworkError when response is unsuccessful',
      mockStatus: 400,
      isSuccess: false,
      shouldThrow: true,
    },
  ];

  testCases.forEach(({ name, mockStatus, isSuccess, shouldThrow }) => {
    it(name, async () => {
      handleHttpRequest.mockResolvedValue({
        processedResponse: {
          status: mockStatus,
          response: {},
        },
      });

      isHttpStatusSuccess.mockReturnValue(isSuccess);

      if (shouldThrow) {
        await expect(
          updatePrimaryEmailOfUser(endpoint, payload, headers, metadata),
        ).rejects.toThrow(NetworkError);
      } else {
        await expect(
          updatePrimaryEmailOfUser(endpoint, payload, headers, metadata),
        ).resolves.toBeUndefined();
      }
    });
  });
});

describe('createOrUpdateUser', () => {
  const endpoint = 'https://rudderstack.zendesk.com/api/v2/users/create_or_update.json';
  const headers = {};
  const metadata = { jobId: 1 };
  const payload = { user: { email: 'user@example.com' } };

  const testCases = [
    {
      name: 'should return user ID on successful creation/update',
      mockStatus: 200,
      isSuccess: true,
      responseUserId: 'abc123',
      shouldThrow: false,
      expected: 'abc123',
    },
    {
      name: 'should throw NetworkError on failure response',
      mockStatus: 500,
      isSuccess: false,
      responseUserId: null,
      shouldThrow: true,
      expected: NetworkError,
    },
  ];

  testCases.forEach(({ name, mockStatus, isSuccess, responseUserId, shouldThrow, expected }) => {
    it(name, async () => {
      handleHttpRequest.mockResolvedValue({
        processedResponse: {
          status: mockStatus,
          response: {
            user: responseUserId ? { id: responseUserId } : undefined,
          },
        },
      });

      isHttpStatusSuccess.mockReturnValue(isSuccess);

      if (shouldThrow) {
        await expect(createOrUpdateUser(payload, endpoint, headers, metadata)).rejects.toThrow(
          NetworkError,
        );
      } else {
        const result = await createOrUpdateUser(payload, endpoint, headers, metadata);
        expect(result).toBe(expected);
      }
    });
  });
});

describe('removeUserFromOrganizationMembership', () => {
  const endpoint =
    'https://rudderstack.zendesk.com/api/v2/users/123/organization_memberships/456.json';
  const headers = {};
  const metadata = { jobId: 1 };

  const testCases = [
    {
      name: 'should succeed when response status is successful',
      mockStatus: 204,
      isSuccess: true,
      shouldThrow: false,
    },
    {
      name: 'should throw NetworkError when response status is not successful',
      mockStatus: 404,
      isSuccess: false,
      shouldThrow: true,
    },
  ];

  testCases.forEach(({ name, mockStatus, isSuccess, shouldThrow }) => {
    it(name, async () => {
      handleHttpRequest.mockResolvedValue({
        processedResponse: {
          status: mockStatus,
          response: {},
        },
      });

      isHttpStatusSuccess.mockReturnValue(isSuccess);

      if (shouldThrow) {
        await expect(
          removeUserFromOrganizationMembership(endpoint, headers, metadata),
        ).rejects.toThrow(NetworkError);
      } else {
        await expect(
          removeUserFromOrganizationMembership(endpoint, headers, metadata),
        ).resolves.toBeUndefined();
      }
    });
  });
});
