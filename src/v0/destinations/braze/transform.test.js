const { process } = require('./transform');
const stats = require('../../../util/stats');
const { handleHttpRequest } = require('../../../adapters/network');

// Mock dependencies
jest.mock('../../../util/stats');
jest.mock('../../../adapters/network');
jest.mock('./config', () => ({
  ...jest.requireActual('./config'),
  ENABLE_CONDITIONAL_BRAZE_IDENTIFY: true,
}));

describe('Braze transform', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    handleHttpRequest.mockResolvedValue({
      processedResponse: {
        status: 200,
        response: { message: 'success' },
      },
    });
  });

  describe('conditional identify logic', () => {
    const destination = {
      ID: 'test-destination-id',
      Name: 'Braze-Test',
      Config: {
        restApiKey: 'test-api-key',
        dataCenter: 'US-03',
      },
    };

    const identifyMessage = {
      type: 'identify',
      userId: 'test-user-id',
      anonymousId: 'test-anonymous-id',
      context: {
        traits: {
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
        },
      },
    };

    const testCases = [
      {
        name: 'should increment braze_identify_calls_total metric',
        setupUserStore: () => new Map(),
        assertions: async (userStore) => {
          await process({ message: identifyMessage, destination }, { userStore });
          expect(stats.increment).toHaveBeenCalledWith('braze_identify_calls_total', {
            destination_id: destination.ID,
          });
        },
      },
      {
        name: 'should call processIdentify when user does not exist in store',
        setupUserStore: () => new Map(),
        assertions: async (userStore) => {
          await process({ message: identifyMessage, destination }, { userStore });
          expect(handleHttpRequest).toHaveBeenCalledWith(
            'post',
            'https://rest.iad-03.braze.com/users/identify',
            expect.any(Object),
            expect.any(Object),
            expect.any(Object),
          );
        },
      },
      {
        name: 'should call processIdentify when user exists but has no matching alias',
        setupUserStore: () => {
          const store = new Map();
          store.set('test-user-id', {
            external_id: 'test-user-id',
            user_aliases: [{ alias_name: 'different-anonymous-id', alias_label: 'rudder_id' }],
          });
          return store;
        },
        assertions: async (userStore) => {
          await process({ message: identifyMessage, destination }, { userStore });
          expect(handleHttpRequest).toHaveBeenCalledWith(
            'post',
            'https://rest.iad-03.braze.com/users/identify',
            expect.any(Object),
            expect.any(Object),
            expect.any(Object),
          );
        },
      },
      {
        name: 'should skip processIdentify and increment braze_identify_skipped_total when user exists with matching alias',
        setupUserStore: () => {
          const store = new Map();
          store.set('test-user-id', {
            external_id: 'test-user-id',
            user_aliases: [{ alias_name: 'test-anonymous-id', alias_label: 'rudder_id' }],
          });
          return store;
        },
        assertions: async (userStore) => {
          await process({ message: identifyMessage, destination }, { userStore });
          expect(stats.increment).toHaveBeenCalledWith('braze_identify_skipped_total', {
            destination_id: destination.ID,
          });

          // Verify that handleHttpRequest was not called for the identify endpoint
          const identifyCall = handleHttpRequest.mock.calls.find(
            (call) => call[1] === 'https://rest.iad-03.braze.com/users/identify',
          );
          expect(identifyCall).toBeUndefined();
        },
      },
      {
        name: 'should handle errors in conditional logic and fall back to processIdentify',
        setupUserStore: () => ({
          get: jest.fn().mockImplementation(() => {
            throw new Error('Test error');
          }),
        }),
        assertions: async (userStore) => {
          await process({ message: identifyMessage, destination }, { userStore });
          expect(handleHttpRequest).toHaveBeenCalledWith(
            'post',
            'https://rest.iad-03.braze.com/users/identify',
            expect.any(Object),
            expect.any(Object),
            expect.any(Object),
          );
        },
      },
    ];

    testCases.forEach(({ name, setupUserStore, assertions }) => {
      it(name, async () => {
        const userStore = setupUserStore();
        await assertions(userStore);
      });
    });
  });
});
