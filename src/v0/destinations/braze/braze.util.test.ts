import _ from 'lodash';
import { handleHttpRequest } from '../../../adapters/network';
import {
  BrazeDedupUtility,
  addAppId,
  formatGender,
  getPurchaseObjs,
  setAliasObject,
  handleReservedProperties,
  combineSubscriptionGroups,
  getEndpointFromConfig,
  processBatch,
  processBatchWithDeliveryMapping,
} from './util';
import { removeUndefinedAndNullValues, removeUndefinedAndNullAndEmptyValues } from '../../util';
import { generateRandomString } from '@rudderstack/integrations-lib';
import {
  BrazeDestination,
  BrazeRouterRequest,
  BrazeTransformedEvent,
  BrazeTrackRequestBody,
  BrazeSubscriptionBatchPayload,
  BrazeMergeBatchPayload,
  BrazeSubscriptionGroup,
  BrazeUserAttributes,
  BrazeDestinationConfig,
  RudderBrazeMessage,
} from './types';

// Mock the handleHttpRequest function
jest.mock('../../../adapters/network');

const mockedHandleHttpRequest = jest.mocked(handleHttpRequest);

describe('dedup utility tests', () => {
  describe('prepareInputForDedup', () => {
    it('should return an object with empty arrays if no inputs are provided', () => {
      const input = [];
      const expectedOutput = {
        externalIdsToQuery: [],
        aliasIdsToQuery: [],
      };
      const actualOutput = BrazeDedupUtility.prepareInputForDedup(input);
      expect(actualOutput).toEqual(expectedOutput);
    });

    it('should extract the userIdIdOnly and add it to externalIdsToQuery array', () => {
      const input = [{ message: { userId: '762123' } }] as BrazeRouterRequest[];
      const expectedOutput = {
        externalIdsToQuery: ['762123'],
        aliasIdsToQuery: [],
      };
      const actualOutput = BrazeDedupUtility.prepareInputForDedup(input);
      expect(actualOutput).toEqual(expectedOutput);
    });

    it('should extract the externalIdOnly and add it to externalIdsToQuery array', () => {
      const input = [
        {
          message: { context: { externalId: [{ type: 'brazeExternalId', id: '54321' }] } },
        } as unknown as BrazeRouterRequest,
      ];
      const expectedOutput = {
        externalIdsToQuery: ['54321'],
        aliasIdsToQuery: [],
      };
      const actualOutput = BrazeDedupUtility.prepareInputForDedup(input);
      expect(actualOutput).toEqual(expectedOutput);
    });

    it('should extract the anonymousId and add it to aliasIdsToQuery array', () => {
      const input = [{ message: { anonymousId: 'anon123' } }] as BrazeRouterRequest[];
      const expectedOutput = {
        externalIdsToQuery: [],
        aliasIdsToQuery: ['anon123'],
      };
      const actualOutput = BrazeDedupUtility.prepareInputForDedup(input);
      expect(actualOutput).toEqual(expectedOutput);
    });

    it('should remove duplicates from externalIdsToQuery array', () => {
      const input = [
        { message: { userIdOnly: '123' } },
        { message: { context: { externalId: [{ type: 'brazeExternalId', id: '123' }] } } },
      ] as unknown as BrazeRouterRequest[];
      const expectedOutput = {
        externalIdsToQuery: ['123'],
        aliasIdsToQuery: [],
      };
      const actualOutput = BrazeDedupUtility.prepareInputForDedup(input);
      expect(actualOutput).toEqual(expectedOutput);
    });

    it('should remove duplicates from aliasIdsToQuery array', () => {
      const input = [
        { message: { anonymousId: 'anon123' } },
        { message: { anonymousId: 'anon123' } },
        { message: { anonymousId: 'anon456' } },
      ] as BrazeRouterRequest[];
      const expectedOutput = {
        externalIdsToQuery: [],
        aliasIdsToQuery: ['anon123', 'anon456'],
      };
      const actualOutput = BrazeDedupUtility.prepareInputForDedup(input);
      expect(actualOutput).toEqual(expectedOutput);
    });
  });

  describe('prepareChunksForDedup', () => {
    it('should return an empty array if both externalIdsToQuery and aliasIdsToQuery are empty', () => {
      const externalIdsToQuery = [];
      const aliasIdsToQuery = [];
      const expectedOutput = [];
      const actualOutput = BrazeDedupUtility.prepareChunksForDedup(
        externalIdsToQuery,
        aliasIdsToQuery,
      );
      expect(actualOutput).toEqual(expectedOutput);
    });

    it('should return an array of chunks with external_id identifiers if externalIdsToQuery is not empty', () => {
      const externalIdsToQuery = ['123', '456', '789'];
      const aliasIdsToQuery = [];
      const expectedOutput = [
        [{ external_id: '123' }, { external_id: '456' }, { external_id: '789' }],
      ];
      const actualOutput = BrazeDedupUtility.prepareChunksForDedup(
        externalIdsToQuery,
        aliasIdsToQuery,
      );
      expect(actualOutput).toEqual(expectedOutput);
    });

    it('should return an array of chunks with alias_name and alias_label identifiers if aliasIdsToQuery is not empty', () => {
      const externalIdsToQuery = [];
      const aliasIdsToQuery = ['abc', 'def', 'ghi'];
      const expectedOutput = [
        [
          { alias_name: 'abc', alias_label: 'rudder_id' },
          { alias_name: 'def', alias_label: 'rudder_id' },
          { alias_name: 'ghi', alias_label: 'rudder_id' },
        ],
      ];
      const actualOutput = BrazeDedupUtility.prepareChunksForDedup(
        externalIdsToQuery,
        aliasIdsToQuery,
      );
      expect(actualOutput).toEqual(expectedOutput);
    });

    it('should return an array of chunks with both external_id and alias_name/alias_label identifiers if both arrays are not empty', () => {
      const externalIdsToQuery = ['123', '456'];
      const aliasIdsToQuery = ['abc', 'def', 'ghi'];
      const expectedOutput = [
        [
          { external_id: '123' },
          { external_id: '456' },
          { alias_name: 'abc', alias_label: 'rudder_id' },
          { alias_name: 'def', alias_label: 'rudder_id' },
          { alias_name: 'ghi', alias_label: 'rudder_id' },
        ],
      ];
      const actualOutput = BrazeDedupUtility.prepareChunksForDedup(
        externalIdsToQuery,
        aliasIdsToQuery,
      );
      expect(actualOutput).toEqual(expectedOutput);
    });

    it('should chunk the identifiers array into arrays of size 50', () => {
      const externalIdsToQuery = new Array(100).fill('123');
      const aliasIdsToQuery = new Array(150).fill('abc');
      const expectedOutput = [
        new Array(50).fill({ external_id: '123' }),
        new Array(50).fill({ external_id: '123' }),
        new Array(50).fill({ alias_name: 'abc', alias_label: 'rudder_id' }),
        new Array(50).fill({ alias_name: 'abc', alias_label: 'rudder_id' }),
        new Array(50).fill({ alias_name: 'abc', alias_label: 'rudder_id' }),
      ];
      const actualOutput = BrazeDedupUtility.prepareChunksForDedup(
        externalIdsToQuery,
        aliasIdsToQuery,
      );
      expect(actualOutput).toEqual(expectedOutput);
    });

    it('should return an array of chunks even if input arrays contain duplicates', () => {
      const externalIdsToQuery = ['123', '456', '789', '123', '456'];
      const aliasIdsToQuery = ['abc', 'def', 'ghi', 'abc', 'def'];
      const expectedOutput = [
        [
          { external_id: '123' },
          { external_id: '456' },
          { external_id: '789' },
          { external_id: '123' },
          { external_id: '456' },
          { alias_name: 'abc', alias_label: 'rudder_id' },
          { alias_name: 'def', alias_label: 'rudder_id' },
          { alias_name: 'ghi', alias_label: 'rudder_id' },
          { alias_name: 'abc', alias_label: 'rudder_id' },
          { alias_name: 'def', alias_label: 'rudder_id' },
        ],
      ];
      const actualOutput = BrazeDedupUtility.prepareChunksForDedup(
        externalIdsToQuery,
        aliasIdsToQuery,
      );
      expect(actualOutput).toEqual(expectedOutput);
    });
  });

  describe('doApiLookup', () => {
    beforeEach(() => {
      // Clear all instances and calls to handleHttpRequest mock function
      mockedHandleHttpRequest.mockClear();
    });

    it('should return an array of users', async () => {
      // Mock the response from handleHttpRequest
      mockedHandleHttpRequest.mockResolvedValueOnce({
        httpResponse: Promise.resolve({}),
        processedResponse: {
          status: 200,
          response: {
            users: [
              {
                external_id: 'user1',
                email: 'user1@example.com',
                custom_attributes: {
                  key1: 'value1',
                },
              },
              {
                external_id: 'user2',
                email: 'user2@example.com',
                custom_attributes: {
                  key2: 'value2',
                },
              },
              {
                user_aliases: [{ alias_name: 'user3', alias_label: 'rudder_id' }],
                email: 'user3@example.com',
                custom_attributes: {
                  key2: 'value3',
                },
              },
            ],
          },
        },
      });

      // Mock the input arguments
      const identfierChunks = [
        [
          {
            external_id: 'user1',
          },
          {
            external_id: 'user2',
          },
          {
            alias_name: 'user3',
            alias_label: 'rudder_id',
          },
        ],
      ];
      const destination = {
        ID: '2N9UakqKF0D35wfzSeofIxPdL8X',
        Name: 'Braze-Test',
        Config: {
          appKey: 'test-api-key',
          blacklistedEvents: [],
          dataCenter: 'US-03',
          enableNestedArrayOperations: false,
          enableSubscriptionGroupInGroupCall: false,
          eventFilteringOption: 'disable',
          restApiKey: generateRandomString(),
          supportDedup: true,
          trackAnonymousUser: true,
          whitelistedEvents: [],
        },
        Enabled: true,
        WorkspaceID: 'workspaceidvalue',
        Transformations: [],
        IsProcessorEnabled: true,
      } as unknown as BrazeDestination;

      // Call the function
      const users = await BrazeDedupUtility.doApiLookup(identfierChunks, {
        destination,
        metadata: {},
      });

      // Check the result - now returns object with users and failedIdentifiers
      expect(users).toEqual([
        {
          users: [
            {
              external_id: 'user1',
              email: 'user1@example.com',
              custom_attributes: {
                key1: 'value1',
              },
            },
            {
              external_id: 'user2',
              email: 'user2@example.com',
              custom_attributes: {
                key2: 'value2',
              },
            },
            {
              user_aliases: [{ alias_name: 'user3', alias_label: 'rudder_id' }],
              email: 'user3@example.com',
              custom_attributes: {
                key2: 'value3',
              },
            },
          ],
          failedIdentifiers: [],
        },
      ]);

      // Check that handleHttpRequest was called once with the correct arguments
      expect(handleHttpRequest).toHaveBeenCalledTimes(1);
      expect(handleHttpRequest).toHaveBeenCalledWith(
        'post',
        'https://rest.iad-03.braze.com/users/export/ids',
        {
          external_ids: ['user1', 'user2'],
          user_aliases: [{ alias_name: 'user3', alias_label: 'rudder_id' }],
          fields_to_export: [
            'created_at',
            'custom_attributes',
            'dob',
            'email',
            'first_name',
            'gender',
            'home_city',
            'last_name',
            'phone',
            'time_zone',
            'external_id',
            'user_aliases',
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${destination.Config.restApiKey}`,
          },
          timeout: 10000,
        },
        {
          destType: 'braze',
          feature: 'transformation',
          metadata: {},
          endpointPath: '/users/export/ids',
          module: 'router',
          requestMethod: 'POST',
        },
      );
    });

    it('should make multiple API calls for large input chunks', async () => {
      const destination = {
        ID: 'some-destination-id',
        Name: 'Test Destination',
        Config: {
          restApiKey: generateRandomString(),
          dataCenter: 'EU-01',
        },
      } as unknown as BrazeDestination;

      // Code randomly generate true or false alsoa with timestamp component
      const randomBoolean = () => Math.random() >= 0.5;

      // Create an array of 110 identifiers
      const identifiers = Array.from({ length: 110 }, (_, i) =>
        randomBoolean()
          ? { external_id: `id-${i}` }
          : { alias_name: `id-${i}`, alias_label: 'rudder_id' },
      );

      // Chunk the identifiers into arrays of 50 each
      const identifierChunks = _.chunk(identifiers, 50);

      // Mock the handleHttpRequest function to return the same data every time it's called
      mockedHandleHttpRequest.mockImplementationOnce(() =>
        Promise.resolve({
          httpResponse: Promise.resolve({}),
          processedResponse: {
            status: 200,
            response: {
              users: Array.from({ length: 50 }, (_, i) =>
                removeUndefinedAndNullAndEmptyValues({
                  external_id: identifiers[i].external_id,
                  user_aliases: [
                    removeUndefinedAndNullValues({
                      alias_name: identifiers[i].alias_name,
                      alias_label: identifiers[i].alias_label,
                    }),
                  ],
                  first_name: `Test-${i}`,
                  last_name: 'User',
                }),
              ),
            },
          },
        }),
      );

      mockedHandleHttpRequest.mockImplementationOnce(() =>
        Promise.resolve({
          httpResponse: Promise.resolve({}),
          processedResponse: {
            status: 200,
            response: {
              users: Array.from({ length: 50 }, (_, i) =>
                removeUndefinedAndNullAndEmptyValues({
                  external_id: identifiers[i + 50].external_id,
                  user_aliases: [
                    removeUndefinedAndNullValues({
                      alias_name: identifiers[i + 50].alias_name,
                      alias_label: identifiers[i + 50].alias_label,
                    }),
                  ],
                  first_name: `Test-${i + 50}`,
                  last_name: 'User',
                }),
              ),
            },
          },
        }),
      );

      mockedHandleHttpRequest.mockImplementationOnce(() =>
        Promise.resolve({
          httpResponse: Promise.resolve({}),
          processedResponse: {
            status: 200,
            response: {
              users: Array.from({ length: 10 }, (_, i) =>
                removeUndefinedAndNullAndEmptyValues({
                  external_id: identifiers[i + 100].external_id,
                  user_aliases: [
                    removeUndefinedAndNullValues({
                      alias_name: identifiers[i + 100].alias_name,
                      alias_label: identifiers[i + 100].alias_label,
                    }),
                  ],
                  first_name: `Test-${i + 100}`,
                  last_name: 'User',
                }),
              ),
            },
          },
        }),
      );

      const chunkedUserData = await BrazeDedupUtility.doApiLookup(identifierChunks, {
        destination,
        metadata: {},
      });
      // Each chunk now returns { users: [...], failedIdentifiers: [] }
      // So we need to extract users from each chunk and flatten
      const allUsers = chunkedUserData.flatMap((chunk) => chunk.users);
      expect(allUsers).toHaveLength(110);
      expect(handleHttpRequest).toHaveBeenCalledTimes(3);
    });

    it('should return users for successful API calls and return undefined for failed chunk', async () => {
      const destination = {
        ID: '123',
        Name: 'Test Destination',
        Config: {
          restApiKey: 'test_rest_api_key',
          dataCenter: 'EU-01',
        },
      } as unknown as BrazeDestination;
      const chunks = [
        [
          { external_id: 'user1' },
          { alias_name: 'alias1', alias_label: 'rudder_id' },
          { external_id: 'user2' },
        ],
        [{ alias_name: 'alias2', alias_label: 'rudder_id' }, { external_id: 'user3' }],
      ];

      // Success response for first chunk
      mockedHandleHttpRequest.mockImplementationOnce(() =>
        Promise.resolve({
          httpResponse: Promise.resolve({}),
          processedResponse: {
            response: {
              users: [
                {
                  external_id: 'user1',
                  email: 'user1@example.com',
                },
                {
                  alias_name: 'alias1',
                  alias_label: 'rudder_id',
                  email: 'alias1@example.com',
                },
                {
                  external_id: 'user2',
                  email: 'user2@example.com',
                },
              ],
            },
            status: 200,
          },
        }),
      );
      // Failure response for second chunk
      mockedHandleHttpRequest.mockImplementationOnce(() =>
        Promise.resolve({
          httpResponse: Promise.resolve({}),
          processedResponse: {
            response: {
              error: 'Failed to fetch users',
            },
            status: 500,
          },
        }),
      );

      const users = await BrazeDedupUtility.doApiLookup(chunks, { destination, metadata: {} });

      expect(handleHttpRequest).toHaveBeenCalledTimes(2);
      // Assert that the first chunk was successful and the second failed
      // The failed chunk will return empty users array with failedIdentifiers
      expect(users).toEqual([
        {
          users: [
            { external_id: 'user1', email: 'user1@example.com' },
            { alias_name: 'alias1', alias_label: 'rudder_id', email: 'alias1@example.com' },
            { external_id: 'user2', email: 'user2@example.com' },
          ],
          failedIdentifiers: [],
        },
        {
          users: [],
          failedIdentifiers: ['user3', 'alias2'],
        },
      ]);
    });
  });

  describe('doLookup', () => {
    test('returns combined user data from multiple api calls', async () => {
      // mock the functions used within doLookup
      const prepareInputForDedupMock = jest
        .spyOn(BrazeDedupUtility, 'prepareInputForDedup')
        .mockReturnValue({
          externalIdsToQuery: ['123', '456'],
          aliasIdsToQuery: ['alias1', 'alias2'],
        });
      const prepareChunksForDedupMock = jest
        .spyOn(BrazeDedupUtility, 'prepareChunksForDedup')
        .mockReturnValue([
          [{ external_id: '123' }],
          [{ external_id: '456' }],
          [{ alias_name: 'alias1', alias_label: 'rudder_id' }],
          [{ alias_name: 'alias2', alias_label: 'rudder_id' }],
        ]);
      // doApiLookup now returns { users: [...], failedIdentifiers: [...] } for each chunk
      const doApiLookupMock = jest.spyOn(BrazeDedupUtility, 'doApiLookup').mockResolvedValue([
        {
          users: [{ external_id: '123', custom_attributes: { key1: 'value1' } }],
          failedIdentifiers: [],
        },
        {
          users: [{ external_id: '456', custom_attributes: { key2: 'value2' } }],
          failedIdentifiers: [],
        },
        { users: [], failedIdentifiers: ['alias1'] }, // simulate failed api call
        {
          users: [{ alias_name: 'alias2', custom_attributes: { key3: 'value3' } }],
          failedIdentifiers: [],
        },
      ]);

      // create input data for doLookup
      const inputs = [
        { destination: { Config: { restApiKey: 'xyz' } }, message: { user_id: '123' } },
        { destination: { Config: { restApiKey: 'xyz' } }, message: { user_id: '456' } },
        { destination: { Config: { restApiKey: 'xyz' } }, message: { anonymousId: 'alias1' } },
        { destination: { Config: { restApiKey: 'xyz' } }, message: { anonymousId: 'alias2' } },
      ] as BrazeRouterRequest[];

      // call doLookup and verify the output
      const result = await BrazeDedupUtility.doLookup(inputs);
      // doLookup now returns { users: [...], failedIdentifiers: Set }
      expect(result.users).toEqual([
        { external_id: '123', custom_attributes: { key1: 'value1' } },
        { external_id: '456', custom_attributes: { key2: 'value2' } },
        { alias_name: 'alias2', custom_attributes: { key3: 'value3' } },
      ]);
      expect(result.failedIdentifiers).toEqual(new Set(['alias1']));

      // verify that the mocked functions were called with correct arguments
      expect(prepareInputForDedupMock).toHaveBeenCalledWith(inputs);
      expect(prepareChunksForDedupMock).toHaveBeenCalledWith(['123', '456'], ['alias1', 'alias2']);
      expect(doApiLookupMock).toHaveBeenCalledWith(
        [
          [{ external_id: '123' }],
          [{ external_id: '456' }],
          [{ alias_name: 'alias1', alias_label: 'rudder_id' }],
          [{ alias_name: 'alias2', alias_label: 'rudder_id' }],
        ],
        { destination: { Config: { restApiKey: 'xyz' } } },
      );

      // restore the original implementation of the mocked functions
      prepareInputForDedupMock.mockRestore();
      prepareChunksForDedupMock.mockRestore();
      doApiLookupMock.mockRestore();
    });
  });

  describe('store update and retrievals', () => {
    test('updateUserStore adds users to the store correctly', () => {
      const store = new Map();
      const users = [
        {
          external_id: '123',
          name: 'John Doe',
        },
        {
          user_aliases: [
            {
              alias_label: 'rudder_id',
              alias_name: '456',
            },
          ],
          name: 'Jane Doe',
        },
      ];

      BrazeDedupUtility.updateUserStore(store, users, 'destination_id_value');

      expect(store.get('123')).toEqual({
        external_id: '123',
        name: 'John Doe',
      });
      expect(store.get('456')).toEqual({
        user_aliases: [
          {
            alias_label: 'rudder_id',
            alias_name: '456',
          },
        ],
        name: 'Jane Doe',
      });
    });

    test('getUserDataFromStore returns user data from store for valid identifier', () => {
      const store = new Map();
      const user1 = {
        external_id: 'user-123',
        name: 'John Doe',
      };
      const user2 = {
        user_aliases: [
          {
            alias_name: 'user-456',
            alias_label: 'rudder_id',
          },
        ],
        name: 'Jane Doe',
      };
      store.set(user1.external_id, user1);
      store.set(user2.user_aliases[0].alias_name, user2);

      const result1 = BrazeDedupUtility.getUserDataFromStore(store, 'user-123');
      const result2 = BrazeDedupUtility.getUserDataFromStore(store, 'user-456');

      expect(result1).toEqual(user1);
      expect(result2).toEqual(user2);
    });

    test('getUserDataFromStore returns undefined for invalid identifier', () => {
      const store = new Map();
      const user1 = {
        external_id: 'user-123',
        name: 'John Doe',
      };
      const user2 = {
        user_aliases: [
          {
            alias_name: 'user-456',
            alias_label: 'rudder_id',
          },
        ],
        name: 'Jane Doe',
      };
      store.set(user1.external_id, user1);
      store.set(user2.user_aliases[0].alias_name, user2);

      const result = BrazeDedupUtility.getUserDataFromStore(store, 'user-789');

      expect(result).toBeUndefined();
    });
  });

  describe('deduplicate', () => {
    let store;

    beforeEach(() => {
      store = new Map();
    });

    test('returns {} if userData is empty', () => {
      const userData = {};
      const result = BrazeDedupUtility.deduplicate(userData, store);
      expect(result).toEqual({});
    });

    test('returns null if keys in userData and store are equal', () => {
      const userData = {
        external_id: '123',
        color: 'blue',
        age: 25,
      };
      const storeData = {
        external_id: '123',
        custom_attributes: {
          color: 'blue',
          age: 25,
        },
      };
      store.set('123', storeData);
      const result = BrazeDedupUtility.deduplicate(userData, store);
      expect(result).toBeNull();
    });

    test('returns userData if it is not present in store', () => {
      const userData = {
        external_id: '123',
        custom_attributes: {
          color: 'blue',
          age: 25,
        },
      };
      const result = BrazeDedupUtility.deduplicate(userData, store);
      expect(store.size).toBe(1);
      expect(result).toEqual(userData);
    });

    test('deduplicates user data correctly', () => {
      const userData: BrazeUserAttributes = {
        external_id: '123',
        color: 'green',
        age: 30,
        gender: 'M',
        country: 'US',
        language: 'en',
        email_subscribe: 'subscribed',
        push_subscribe: 'unsubscribed',
        subscription_groups: ['group1', 'group2'],
      };
      const storeData = {
        external_id: '123',
        country: 'US',
        language: 'en',
        email_subscribe: 'subscribed',
        push_subscribe: 'unsubscribed',
        subscription_groups: ['group1', 'group2'],
        custom_attributes: {
          color: 'blue',
          age: 25,
        },
      };
      store.set('123', storeData);
      const result = BrazeDedupUtility.deduplicate(userData, store);
      expect(store.size).toBe(1);
      expect(result).toEqual({
        external_id: '123',
        color: 'green',
        age: 30,
        gender: 'M',
        country: 'US',
        language: 'en',
        email_subscribe: 'subscribed',
        push_subscribe: 'unsubscribed',
        subscription_groups: ['group1', 'group2'],
      });
    });

    test('deduplicates user data correctly 2', () => {
      const userData: BrazeUserAttributes = {
        external_id: '123',
        color: 'green',
        age: 30,
        gender: 'M',
        language: 'en',
        email_subscribe: 'subscribed',
        push_subscribe: 'unsubscribed',
        subscription_groups: ['group1', 'group2'],
      };
      const storeData = {
        external_id: '123',
        country: 'US',
        language: 'en',
        email_subscribe: 'subscribed',
        push_subscribe: 'unsubscribed',
        subscription_groups: ['group1', 'group2'],
        custom_attributes: {
          color: 'blue',
          age: 25,
        },
      };
      store.set('123', storeData);
      const result = BrazeDedupUtility.deduplicate(userData, store);
      expect(store.size).toBe(1);
      expect(result).toEqual({
        external_id: '123',
        color: 'green',
        age: 30,
        gender: 'M',
        language: 'en',
        email_subscribe: 'subscribed',
        push_subscribe: 'unsubscribed',
        subscription_groups: ['group1', 'group2'],
      });
    });

    test('returns only non-billable attribute if there is key of BRAZE_NON_BILLABLE_ATTRIBUTES', () => {
      const userData = {
        external_id: '123',
        country: 'US',
        language: 'en',
        color: 'blue',
        age: 25,
      };

      const storeData = {
        external_id: '123',
        custom_attributes: {
          color: 'blue',
          age: 25,
        },
      };
      store.set('123', storeData);
      const result = BrazeDedupUtility.deduplicate(userData, store);
      expect(result).toEqual({ country: 'US', external_id: '123', language: 'en' });
    });

    test('returns null if all keys have $add, $update, or $remove properties', () => {
      const userData = {
        external_id: '123',
        color: {
          $add: 'blue',
          $update: 'red',
          $remove: 'green',
        },
        age: 25,
        ethnicity: 'asian',
      };

      const storeData = {
        external_id: '123',
        custom_attributes: {
          age: 25,
          ethnicity: 'asian',
        },
      };
      store.set('123', storeData);
      const result = BrazeDedupUtility.deduplicate(userData, store);
      expect(result).toBeNull();
    });

    test('deduplicates user data correctly when user data is null and it doesnt exist in stored data', () => {
      const userData = {
        external_id: '123',
        nullProperty: null,
        color: 'green',
        age: 30,
      };
      const storeData = {
        external_id: '123',
        custom_attributes: {
          color: 'green',
          age: 30,
        },
      };
      store.set('123', storeData);
      const result = BrazeDedupUtility.deduplicate(userData, store);
      expect(store.size).toBe(1);
      expect(result).toEqual(null);
    });

    test('deduplicates user data correctly when user data is null and it is same in stored data', () => {
      const userData = {
        external_id: '123',
        nullProperty: null,
        color: 'green',
        age: 30,
      };
      const storeData = {
        external_id: '123',
        custom_attributes: {
          color: 'green',
          age: 30,
          nullProperty: null,
        },
      };
      store.set('123', storeData);
      const result = BrazeDedupUtility.deduplicate(userData, store);
      expect(store.size).toBe(1);
      expect(result).toEqual(null);
    });

    test('deduplicates user data correctly when user data is null and it is different in stored data', () => {
      const userData = {
        external_id: '123',
        nullProperty: null,
        color: 'green',
        age: 30,
      };
      const storeData = {
        external_id: '123',
        custom_attributes: {
          color: 'green',
          age: 30,
          nullProperty: 'valid data',
        },
      };
      store.set('123', storeData);
      const result = BrazeDedupUtility.deduplicate(userData, store);
      expect(store.size).toBe(1);
      expect(result).toEqual({
        external_id: '123',
        nullProperty: null,
      });
    });

    test('deduplicates user data correctly when user data is undefined and it doesnt exist in stored data', () => {
      const userData = {
        external_id: '123',
        undefinedProperty: undefined,
        color: 'green',
        age: 30,
      };
      const storeData = {
        external_id: '123',
        custom_attributes: {
          color: 'green',
          age: 30,
        },
      };
      store.set('123', storeData);
      const result = BrazeDedupUtility.deduplicate(userData, store);
      expect(store.size).toBe(1);
      expect(result).toEqual(null);
    });

    test('deduplicates user data correctly when user data is undefined and it is same in stored data', () => {
      const userData = {
        external_id: '123',
        undefinedProperty: undefined,
        color: 'green',
        age: 30,
      };
      const storeData = {
        external_id: '123',
        custom_attributes: {
          color: 'green',
          undefinedProperty: undefined,
          age: 30,
        },
      };
      store.set('123', storeData);
      const result = BrazeDedupUtility.deduplicate(userData, store);
      expect(store.size).toBe(1);
      expect(result).toEqual(null);
    });

    test('deduplicates user data correctly when user data is undefined and it is defined in stored data', () => {
      const userData = {
        external_id: '123',
        undefinedProperty: undefined,
        color: 'green',
        age: 30,
      };
      const storeData = {
        external_id: '123',
        custom_attributes: {
          color: 'green',
          undefinedProperty: 'defined data',
          age: 30,
        },
      };
      store.set('123', storeData);
      const result = BrazeDedupUtility.deduplicate(userData, store);
      expect(store.size).toBe(1);
      expect(result).toEqual({
        external_id: '123',
        undefinedProperty: undefined,
      });
    });
  });
});

// ---------------------------------------------------------------------------
// processBatch shared helpers
// ---------------------------------------------------------------------------

const brazeDestFor = (extras: Partial<BrazeDestinationConfig> = {}): BrazeDestination => ({
  ID: 'braze',
  Name: 'braze',
  Enabled: true,
  Config: {
    restApiKey: 'restApiKey',
    dataCenter: 'eu',
    ...extras,
  } as BrazeDestinationConfig,
  DestinationDefinition: {
    ID: 'braze',
    Name: 'braze',
    DisplayName: '',
    Config: {},
  },
  WorkspaceID: '123',
  Transformations: [],
});

const trackEndpointOf = (destination: BrazeDestination) =>
  getEndpointFromConfig(destination) + '/users/track';
const subEndpointOf = (destination: BrazeDestination) =>
  getEndpointFromConfig(destination) + '/v2/subscription/status/set';
const mergeEndpointOf = (destination: BrazeDestination) =>
  getEndpointFromConfig(destination) + '/users/merge';

// ---- OFF-path (default) helpers ------------------------------------------
// The OFF path emits a single MultiBatchRequestOutput whose `batchedRequest`
// is an array of every outgoing HTTP request. These helpers reach into that
// array; individual requests are filtered by endpoint.
const offMulti = (result: any[]): any | undefined =>
  result.find((r) => r?.batchedRequest && Array.isArray(r.batchedRequest));

const offRequests = (result: any[], destination: BrazeDestination, endpoint: string): any[] => {
  const multi = offMulti(result);
  if (!multi) return [];
  return (multi.batchedRequest as any[]).filter((br) => br.endpoint === endpoint);
};

const offTrackRequests = (result: any[], destination: BrazeDestination): any[] =>
  offRequests(result, destination, trackEndpointOf(destination));
const offSubRequests = (result: any[], destination: BrazeDestination): any[] =>
  offRequests(result, destination, subEndpointOf(destination));
const offMergeRequests = (result: any[], destination: BrazeDestination): any[] =>
  offRequests(result, destination, mergeEndpointOf(destination));

const offTotalIn = (requests: any[], key: 'attributes' | 'events' | 'purchases'): number =>
  requests.reduce((acc, r) => acc + (r.body.JSON[key]?.length ?? 0), 0);

// ---- ON-path helpers -----------------------------------------------------
// The ON path emits one BatchRequestOutput per outgoing HTTP request; each
// carries a single non-array `batchedRequest`. Helpers filter by endpoint.
const isOnBatchedOutput = (out: any): boolean =>
  Boolean(out?.batchedRequest && !Array.isArray(out.batchedRequest));

const onTrackOutputs = (result: any[], destination: BrazeDestination): any[] =>
  result.filter(
    (r) => isOnBatchedOutput(r) && r.batchedRequest.endpoint === trackEndpointOf(destination),
  );

const onSubOutputs = (result: any[], destination: BrazeDestination): any[] =>
  result.filter(
    (r) => isOnBatchedOutput(r) && r.batchedRequest.endpoint === subEndpointOf(destination),
  );

const onMergeOutputs = (result: any[], destination: BrazeDestination): any[] =>
  result.filter(
    (r) => isOnBatchedOutput(r) && r.batchedRequest.endpoint === mergeEndpointOf(destination),
  );

const onTotalInSubArray = (outs: any[], key: 'attributes' | 'events' | 'purchases'): number =>
  outs.reduce((acc, o) => acc + (o.batchedRequest.body.JSON[key]?.length ?? 0), 0);

// ---------------------------------------------------------------------------
// OFF path (default) — BRAZE_PER_JOB_DELIVERY_MAPPING_ENABLED is unset.
// processBatch emits a single MultiBatchRequestOutput whose `batchedRequest`
// is an array of every outgoing HTTP request, with a flat metadata list and
// no `destInfo`. Group-preserving chunking, byte-size caps, and oversized-job
// rejection are still active.
// ---------------------------------------------------------------------------

describe('processBatch — OFF path (default) — non-MAU workspace (V1 chunking)', () => {
  const destination = brazeDestFor();

  const buildTrackEvent = (
    i: number,
    workspaceId = 'workspace-non-mau',
  ): BrazeTransformedEvent => ({
    destination,
    statusCode: 200,
    batchedRequest: {
      version: '1',
      type: 'REST',
      method: 'POST',
      endpoint: '',
      headers: {},
      params: {},
      body: {
        JSON: {
          attributes: [{ external_id: `u${i}`, id: i, name: 'n', xyz: 'a' }],
          events: [{ external_id: `u${i}`, id: i, event: 'e' }],
          purchases: [
            {
              external_id: `u${i}`,
              product_id: `p${i}`,
              price: 1,
              currency: 'USD',
              quantity: 1,
              time: 't',
            },
          ],
        },
      },
      files: {},
    } as any,
    metadata: [{ jobId: i, workspaceId }],
  });

  test('emits a single MultiBatchRequestOutput with batchedRequest[] and flat metadata', () => {
    const transformedEvents = Array.from({ length: 20 }, (_, i) => buildTrackEvent(i));
    const result = processBatch(transformedEvents);
    // Exactly one successful output (no failures/filters in this input).
    expect(result.length).toBe(1);
    const multi = result[0] as any;
    expect(Array.isArray(multi.batchedRequest)).toBe(true);
    expect(multi.batched).toBe(true);
    expect(multi.statusCode).toBe(200);
    expect(multi.metadata.length).toBe(20);
    // No destInfo on any metadata entry in OFF path.
    for (const m of multi.metadata) {
      expect((m as any).destInfo).toBeUndefined();
    }
  });

  test('splits track chunks by V1 per-type caps (75)', () => {
    const transformedEvents = Array.from({ length: 100 }, (_, i) => buildTrackEvent(i));
    const result = processBatch(transformedEvents);

    const tracks = offTrackRequests(result, destination);
    expect(tracks.length).toBeGreaterThanOrEqual(2);
    expect(offTotalIn(tracks, 'attributes')).toBe(100);
    expect(offTotalIn(tracks, 'events')).toBe(100);
    expect(offTotalIn(tracks, 'purchases')).toBe(100);
    for (const t of tracks) {
      const body = t.body.JSON as BrazeTrackRequestBody;
      expect(body.partner).toBe('RudderStack');
      expect(body.attributes?.length ?? 0).toBeLessThanOrEqual(75);
      expect(body.events?.length ?? 0).toBeLessThanOrEqual(75);
      expect(body.purchases?.length ?? 0).toBeLessThanOrEqual(75);
    }
  });

  test('subscription-group jobs are chunked (25 per) inside the same MultiBatchRequestOutput', () => {
    const dest = brazeDestFor({ enableSubscriptionGroupInGroupCall: true });
    const transformedEvents: BrazeTransformedEvent[] = [];
    for (let i = 0; i < 100; i += 1) {
      transformedEvents.push({
        destination: dest,
        statusCode: 200,
        batchedRequest: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint: '',
          headers: {},
          params: {},
          body: {
            JSON: {
              subscription_groups: [
                { subscription_group_id: `s${i}`, subscription_state: 'subscribed' },
              ],
            },
          },
          files: {},
        } as any,
        metadata: [{ jobId: i, workspaceId: 'workspace-non-mau' }],
      });
    }
    const result = processBatch(transformedEvents);
    expect(result.length).toBe(1);
    const subs = offSubRequests(result, dest);
    expect(subs.length).toBe(Math.ceil(100 / 25));
    for (const s of subs) {
      expect((s.body.JSON as any).subscription_groups).toBeDefined();
    }
    // OFF path: no destInfo on flat metadata list.
    for (const m of (result[0] as any).metadata) {
      expect((m as any).destInfo).toBeUndefined();
    }
  });

  test('alias-merge jobs are chunked (50 per) inside the same MultiBatchRequestOutput', () => {
    const dest = brazeDestFor();
    const transformedEvents: BrazeTransformedEvent[] = [];
    for (let i = 0; i < 100; i += 1) {
      transformedEvents.push({
        destination: dest,
        statusCode: 200,
        batchedRequest: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint: '',
          headers: {},
          params: {},
          body: {
            JSON: {
              merge_updates: [
                {
                  identifier_to_merge: { external_id: `a${i}` },
                  identifier_to_keep: { external_id: `b${i}` },
                },
              ],
            },
          },
          files: {},
        } as any,
        metadata: [{ jobId: i, workspaceId: 'workspace-non-mau' }],
      });
    }
    const result = processBatch(transformedEvents);
    expect(result.length).toBe(1);
    const merges = offMergeRequests(result, dest);
    expect(merges.length).toBe(Math.ceil(100 / 50));
    for (const m of merges) {
      expect((m.body.JSON as any).merge_updates).toBeDefined();
    }
    for (const meta of (result[0] as any).metadata) {
      expect((meta as any).destInfo).toBeUndefined();
    }
  });

  test('interleaved input types produce a single MultiBatchRequestOutput with all requests globally concatenated', () => {
    // OFF path concatenates all track items → chunked → track requests; then
    // all sub items; then all merges. Insertion-order-run preservation is an
    // ON-only guarantee.
    const dest = brazeDestFor({ enableSubscriptionGroupInGroupCall: true });
    const trackJob = (i: number): BrazeTransformedEvent => ({
      destination: dest,
      statusCode: 200,
      batchedRequest: {
        version: '1',
        type: 'REST',
        method: 'POST',
        endpoint: '',
        headers: {},
        params: {},
        body: { JSON: { attributes: [{ external_id: `u${i}` }] } },
        files: {},
      } as any,
      metadata: [{ jobId: i, workspaceId: 'workspace-non-mau', userId: 'shared' }],
    });
    const subJob = (i: number): BrazeTransformedEvent => ({
      destination: dest,
      statusCode: 200,
      batchedRequest: {
        version: '1',
        type: 'REST',
        method: 'POST',
        endpoint: '',
        headers: {},
        params: {},
        body: {
          JSON: {
            subscription_groups: [
              { subscription_group_id: `s${i}`, subscription_state: 'subscribed' },
            ],
          },
        },
        files: {},
      } as any,
      metadata: [{ jobId: i, workspaceId: 'workspace-non-mau', userId: 'shared' }],
    });
    const mergeJob = (i: number): BrazeTransformedEvent => ({
      destination: dest,
      statusCode: 200,
      batchedRequest: {
        version: '1',
        type: 'REST',
        method: 'POST',
        endpoint: '',
        headers: {},
        params: {},
        body: {
          JSON: {
            merge_updates: [
              {
                identifier_to_merge: { external_id: `a${i}` },
                identifier_to_keep: { external_id: `b${i}` },
              },
            ],
          },
        },
        files: {},
      } as any,
      metadata: [{ jobId: i, workspaceId: 'workspace-non-mau', userId: 'shared' }],
    });

    const result = processBatch([
      trackJob(1),
      trackJob(2),
      subJob(3),
      subJob(4),
      mergeJob(5),
      mergeJob(6),
      subJob(7),
    ]);

    // Single output. Track requests: 1 chunk of 2. Sub requests: 1 chunk of 3.
    // Merge requests: 1 chunk of 2. Total inner requests = 3.
    expect(result.length).toBe(1);
    const multi = result[0] as any;
    expect(Array.isArray(multi.batchedRequest)).toBe(true);
    expect(offTrackRequests(result, dest).length).toBe(1);
    expect(offSubRequests(result, dest).length).toBe(1);
    expect(offMergeRequests(result, dest).length).toBe(1);
    // Flat metadata preserves original job insertion order.
    expect(multi.metadata.map((m: any) => m.jobId)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test('preserves failure and filtered responses alongside the single successful output', () => {
    const transformedEvents: BrazeTransformedEvent[] = [
      ...Array.from({ length: 10 }, (_, i) => buildTrackEvent(i)),
      {
        destination,
        statusCode: 400,
        metadata: [{ jobId: 500, workspaceId: 'workspace-non-mau' }],
        error: 'Random Error',
      } as BrazeTransformedEvent,
    ];
    const result = processBatch(transformedEvents);
    const failures = result.filter((r) => (r as any).statusCode === 400);
    expect(failures.length).toBe(1);
    expect((failures[0] as any).error).toBe('Random Error');
    const tracks = offTrackRequests(result, destination);
    expect(offTotalIn(tracks, 'events')).toBe(10);
  });
});

describe('processBatch — OFF path (default) — MAU workspace (V2 chunking)', () => {
  const destination = brazeDestFor();

  const buildTrackEvent = (i: number): BrazeTransformedEvent => ({
    destination,
    statusCode: 200,
    batchedRequest: {
      version: '1',
      type: 'REST',
      method: 'POST',
      endpoint: '',
      headers: {},
      params: {},
      body: {
        JSON: {
          attributes: [{ external_id: `u${i}`, id: i, name: 'n' }],
          events: [{ external_id: `u${i}`, id: i, event: 'e' }],
          purchases: [
            {
              external_id: `u${i}`,
              product_id: `p${i}`,
              price: 1,
              currency: 'USD',
              quantity: 1,
              time: 't',
            },
          ],
        },
      },
      files: {},
    } as any,
    metadata: [{ jobId: i, workspaceId: 'workspace-mau' }],
  });

  test('V2 chunks by total-count cap (75) across sub-arrays', () => {
    const transformedEvents = Array.from({ length: 100 }, (_, i) => buildTrackEvent(i));
    const result = processBatch(transformedEvents);
    expect(result.length).toBe(1);
    const tracks = offTrackRequests(result, destination);
    expect(tracks.length).toBe(4);
    expect(offTotalIn(tracks, 'attributes')).toBe(100);
    expect(offTotalIn(tracks, 'events')).toBe(100);
    expect(offTotalIn(tracks, 'purchases')).toBe(100);
    for (const t of tracks) {
      const body = t.body.JSON as BrazeTrackRequestBody;
      const total =
        (body.attributes?.length ?? 0) + (body.events?.length ?? 0) + (body.purchases?.length ?? 0);
      expect(total).toBeLessThanOrEqual(75);
    }
  });
});

// ---------------------------------------------------------------------------
// `processBatchWithDeliveryMapping` — invoked directly (no env-var gating in
// util.ts; the flag is read only by `transform.ts` at the call site).
// Emits one BatchRequestOutput per outgoing HTTP request, preserves insertion-
// order runs, attaches per-metadata `destInfo` positional maps on track
// outputs, and carries `destInfo: {}` on sub/merge outputs for correlation-
// shape uniformity. Applies group-preserving chunking, byte-size caps, and
// oversized-job rejection which do not exist on the OFF path.
// ---------------------------------------------------------------------------

describe('processBatchWithDeliveryMapping', () => {
  const destination = brazeDestFor();

  const buildTrackEvent = (
    i: number,
    workspaceId = 'workspace-non-mau',
  ): BrazeTransformedEvent => ({
    destination,
    statusCode: 200,
    batchedRequest: {
      version: '1',
      type: 'REST',
      method: 'POST',
      endpoint: '',
      headers: {},
      params: {},
      body: {
        JSON: {
          attributes: [{ external_id: `u${i}`, id: i, name: 'n' }],
          events: [{ external_id: `u${i}`, id: i, event: 'e' }],
          purchases: [
            {
              external_id: `u${i}`,
              product_id: `p${i}`,
              price: 1,
              currency: 'USD',
              quantity: 1,
              time: 't',
            },
          ],
        },
      },
      files: {},
    } as any,
    metadata: [{ jobId: i, workspaceId }],
  });

  test('every output is a single BatchRequestOutput (no MultiBatchRequestOutput anywhere)', () => {
    const transformedEvents = Array.from({ length: 20 }, (_, i) => buildTrackEvent(i));
    const result = processBatchWithDeliveryMapping(transformedEvents);
    for (const out of result) {
      expect(Array.isArray((out as any).batchedRequest)).toBe(false);
      expect((out as any).batched).toBe(true);
    }
  });

  test('V1 chunks track outputs by per-type caps (75); every job has a destInfo positional map', () => {
    const transformedEvents = Array.from({ length: 100 }, (_, i) => buildTrackEvent(i));
    const result = processBatchWithDeliveryMapping(transformedEvents);
    const tracks = onTrackOutputs(result, destination);
    expect(tracks.length).toBeGreaterThanOrEqual(2);
    expect(onTotalInSubArray(tracks, 'attributes')).toBe(100);
    for (const t of tracks) {
      for (const m of t.metadata) {
        const info = (m as any).destInfo;
        expect(info).toBeDefined();
        // Each track metadata must have at least one non-empty indices array.
        const anyIndex =
          info.attributesIndices?.length ||
          info.eventsIndices?.length ||
          info.purchasesIndices?.length;
        expect(anyIndex).toBeGreaterThan(0);
      }
    }
  });

  test('subscription-group outputs carry destInfo: {} on every metadata entry', () => {
    const dest = brazeDestFor({ enableSubscriptionGroupInGroupCall: true });
    const transformedEvents: BrazeTransformedEvent[] = [];
    for (let i = 0; i < 30; i += 1) {
      transformedEvents.push({
        destination: dest,
        statusCode: 200,
        batchedRequest: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint: '',
          headers: {},
          params: {},
          body: {
            JSON: {
              subscription_groups: [
                { subscription_group_id: `s${i}`, subscription_state: 'subscribed' },
              ],
            },
          },
          files: {},
        } as any,
        metadata: [{ jobId: i, workspaceId: 'workspace-non-mau' }],
      });
    }
    const result = processBatchWithDeliveryMapping(transformedEvents);
    const subs = onSubOutputs(result, dest);
    expect(subs.length).toBe(Math.ceil(30 / 25));
    for (const s of subs) {
      for (const m of s.metadata) {
        // destInfo must be present (present-but-empty), not undefined. The
        // networkHandler relies on it being a defined object per metadata
        // entry regardless of endpoint.
        expect((m as any).destInfo).toBeDefined();
        expect((m as any).destInfo).toEqual({});
      }
    }
  });

  test('alias-merge outputs carry destInfo: {} on every metadata entry', () => {
    const dest = brazeDestFor();
    const transformedEvents: BrazeTransformedEvent[] = [];
    for (let i = 0; i < 60; i += 1) {
      transformedEvents.push({
        destination: dest,
        statusCode: 200,
        batchedRequest: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint: '',
          headers: {},
          params: {},
          body: {
            JSON: {
              merge_updates: [
                {
                  identifier_to_merge: { external_id: `a${i}` },
                  identifier_to_keep: { external_id: `b${i}` },
                },
              ],
            },
          },
          files: {},
        } as any,
        metadata: [{ jobId: i, workspaceId: 'workspace-non-mau' }],
      });
    }
    const result = processBatchWithDeliveryMapping(transformedEvents);
    const merges = onMergeOutputs(result, dest);
    expect(merges.length).toBe(Math.ceil(60 / 50));
    for (const m of merges) {
      for (const meta of m.metadata) {
        expect((meta as any).destInfo).toBeDefined();
        expect((meta as any).destInfo).toEqual({});
      }
    }
  });

  test('interleaved input types produce outputs in insertion-order runs (jobIds ascending across outputs)', () => {
    const dest = brazeDestFor({ enableSubscriptionGroupInGroupCall: true });
    const trackJob = (i: number): BrazeTransformedEvent => ({
      destination: dest,
      statusCode: 200,
      batchedRequest: {
        version: '1',
        type: 'REST',
        method: 'POST',
        endpoint: '',
        headers: {},
        params: {},
        body: { JSON: { attributes: [{ external_id: `u${i}` }] } },
        files: {},
      } as any,
      metadata: [{ jobId: i, workspaceId: 'workspace-non-mau', userId: 'shared' }],
    });
    const subJob = (i: number): BrazeTransformedEvent => ({
      destination: dest,
      statusCode: 200,
      batchedRequest: {
        version: '1',
        type: 'REST',
        method: 'POST',
        endpoint: '',
        headers: {},
        params: {},
        body: {
          JSON: {
            subscription_groups: [
              { subscription_group_id: `s${i}`, subscription_state: 'subscribed' },
            ],
          },
        },
        files: {},
      } as any,
      metadata: [{ jobId: i, workspaceId: 'workspace-non-mau', userId: 'shared' }],
    });
    const mergeJob = (i: number): BrazeTransformedEvent => ({
      destination: dest,
      statusCode: 200,
      batchedRequest: {
        version: '1',
        type: 'REST',
        method: 'POST',
        endpoint: '',
        headers: {},
        params: {},
        body: {
          JSON: {
            merge_updates: [
              {
                identifier_to_merge: { external_id: `a${i}` },
                identifier_to_keep: { external_id: `b${i}` },
              },
            ],
          },
        },
        files: {},
      } as any,
      metadata: [{ jobId: i, workspaceId: 'workspace-non-mau', userId: 'shared' }],
    });

    const result = processBatchWithDeliveryMapping([
      trackJob(1),
      trackJob(2),
      subJob(3),
      subJob(4),
      mergeJob(5),
      mergeJob(6),
      subJob(7),
    ]);

    // Items are coalesced globally per endpoint type — insertion-order runs
    // are NOT preserved. Expect 3 outputs: track [1, 2], sub [3, 4, 7],
    // merge [5, 6]. Within each output, jobIds accumulate in the order jobs
    // appear in the input (subscription/merge use plain _.chunk), so they
    // remain monotonically ascending inside each output.
    expect(result.length).toBe(3);
    const tracks = onTrackOutputs(result, dest);
    const subs = onSubOutputs(result, dest);
    const merges = onMergeOutputs(result, dest);
    expect(tracks.length).toBe(1);
    expect(subs.length).toBe(1);
    expect(merges.length).toBe(1);
    expect(
      tracks[0].metadata.map((m: any) => m.jobId).sort((a: number, b: number) => a - b),
    ).toEqual([1, 2]);
    expect(subs[0].metadata.map((m: any) => m.jobId)).toEqual([3, 4, 7]);
    expect(merges[0].metadata.map((m: any) => m.jobId)).toEqual([5, 6]);
  });

  test('single track job (attribute + event) → destInfo has attributesIndices + eventsIndices; purchasesIndices absent', () => {
    const transformedEvent: BrazeTransformedEvent = {
      destination,
      statusCode: 200,
      batchedRequest: {
        version: '1',
        type: 'REST',
        method: 'POST',
        endpoint: '',
        headers: {},
        params: {},
        body: {
          JSON: {
            attributes: [{ external_id: 'u1', name: 'attr' }],
            events: [{ external_id: 'u1', name: 'Purchase', time: 't' }],
          },
        },
        files: {},
      } as any,
      metadata: [{ jobId: 42, workspaceId: 'workspace-non-mau' }],
    };
    const result = processBatchWithDeliveryMapping([transformedEvent]);
    const tracks = onTrackOutputs(result, destination);
    expect(tracks.length).toBe(1);
    expect(tracks[0].metadata.length).toBe(1);
    const info = (tracks[0].metadata[0] as any).destInfo;
    expect(info.attributesIndices).toEqual([0]);
    expect(info.eventsIndices).toEqual([0]);
    expect(info.purchasesIndices).toBeUndefined();
  });

  test('order-completed job (attribute + multiple purchases) → destInfo.purchasesIndices is an array of all indices', () => {
    const transformedEvent: BrazeTransformedEvent = {
      destination,
      statusCode: 200,
      batchedRequest: {
        version: '1',
        type: 'REST',
        method: 'POST',
        endpoint: '',
        headers: {},
        params: {},
        body: {
          JSON: {
            attributes: [{ external_id: 'u1', name: 'attr' }],
            purchases: [
              {
                external_id: 'u1',
                product_id: 'p1',
                price: 1,
                currency: 'USD',
                quantity: 1,
                time: 't',
              },
              {
                external_id: 'u1',
                product_id: 'p2',
                price: 2,
                currency: 'USD',
                quantity: 1,
                time: 't',
              },
              {
                external_id: 'u1',
                product_id: 'p3',
                price: 3,
                currency: 'USD',
                quantity: 1,
                time: 't',
              },
            ],
          },
        },
        files: {},
      } as any,
      metadata: [{ jobId: 42, workspaceId: 'workspace-non-mau' }],
    };
    const result = processBatchWithDeliveryMapping([transformedEvent]);
    const tracks = onTrackOutputs(result, destination);
    expect(tracks.length).toBe(1);
    const info = (tracks[0].metadata[0] as any).destInfo;
    expect(info.attributesIndices).toEqual([0]);
    expect(info.purchasesIndices).toEqual([0, 1, 2]);
    expect(info.eventsIndices).toBeUndefined();
  });

  test('mixed batch: each job’s destInfo indices point to payload entries whose external_id matches', () => {
    const jobs: BrazeTransformedEvent[] = [
      {
        destination,
        statusCode: 200,
        batchedRequest: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint: '',
          headers: {},
          params: {},
          body: { JSON: { attributes: [{ external_id: 'u1', name: 'A' }] } },
          files: {},
        } as any,
        metadata: [{ jobId: 1, workspaceId: 'workspace-non-mau' }],
      },
      {
        destination,
        statusCode: 200,
        batchedRequest: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint: '',
          headers: {},
          params: {},
          body: {
            JSON: {
              attributes: [{ external_id: 'u2', name: 'B' }],
              events: [{ external_id: 'u2', name: 'E', time: 't' }],
            },
          },
          files: {},
        } as any,
        metadata: [{ jobId: 2, workspaceId: 'workspace-non-mau' }],
      },
      {
        destination,
        statusCode: 200,
        batchedRequest: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint: '',
          headers: {},
          params: {},
          body: {
            JSON: {
              attributes: [{ external_id: 'u3', name: 'C' }],
              purchases: [
                {
                  external_id: 'u3',
                  product_id: 'x',
                  price: 1,
                  currency: 'USD',
                  quantity: 1,
                  time: 't',
                },
                {
                  external_id: 'u3',
                  product_id: 'y',
                  price: 2,
                  currency: 'USD',
                  quantity: 1,
                  time: 't',
                },
              ],
            },
          },
          files: {},
        } as any,
        metadata: [{ jobId: 3, workspaceId: 'workspace-non-mau' }],
      },
    ];
    const result = processBatchWithDeliveryMapping(jobs);
    const tracks = onTrackOutputs(result, destination);
    expect(tracks.length).toBe(1);
    const chunk = tracks[0];
    const body = chunk.batchedRequest.body.JSON as BrazeTrackRequestBody;
    expect(body.attributes?.length).toBe(3);
    expect(body.events?.length).toBe(1);
    expect(body.purchases?.length).toBe(2);
    for (const m of chunk.metadata) {
      const info = (m as any).destInfo;
      const jobId = (m as any).jobId;
      const externalId = `u${jobId}`;
      for (const idx of info.attributesIndices ?? []) {
        expect((body.attributes as any)[idx].external_id).toBe(externalId);
      }
      for (const idx of info.eventsIndices ?? []) {
        expect((body.events as any)[idx].external_id).toBe(externalId);
      }
      for (const idx of info.purchasesIndices ?? []) {
        expect((body.purchases as any)[idx].external_id).toBe(externalId);
      }
    }
  });

  test('a single job’s items never straddle chunk boundaries (ON path preserves group-preserving chunking)', () => {
    const buildOrderCompletedJob = (i: number, numProducts: number): BrazeTransformedEvent => ({
      destination,
      statusCode: 200,
      batchedRequest: {
        version: '1',
        type: 'REST',
        method: 'POST',
        endpoint: '',
        headers: {},
        params: {},
        body: {
          JSON: {
            attributes: [{ external_id: `u${i}`, name: 'A' }],
            purchases: Array.from({ length: numProducts }, (_, k) => ({
              external_id: `u${i}`,
              product_id: `p${i}-${k}`,
              price: 1,
              currency: 'USD',
              quantity: 1,
              time: 't',
            })),
          },
        },
        files: {},
      } as any,
      metadata: [{ jobId: i, workspaceId: 'workspace-mau' }],
    });

    const jobs: BrazeTransformedEvent[] = [];
    for (let i = 0; i < 24; i += 1) jobs.push(buildOrderCompletedJob(i, 3));
    jobs.push(buildOrderCompletedJob(24, 6));

    const result = processBatchWithDeliveryMapping(jobs);
    const tracks = onTrackOutputs(result, destination);

    for (const job of jobs) {
      const jobId = job.metadata?.[0]?.jobId;
      let occurrences = 0;
      for (const t of tracks) {
        if (t.metadata.some((m: any) => m.jobId === jobId)) occurrences += 1;
      }
      expect(occurrences).toBe(1);
    }
    for (const t of tracks) {
      const b = t.batchedRequest.body.JSON as BrazeTrackRequestBody;
      const total =
        (b.attributes?.length ?? 0) + (b.events?.length ?? 0) + (b.purchases?.length ?? 0);
      expect(total).toBeLessThanOrEqual(75);
    }
  });

  test('single item exceeding TRACK_BRAZE_MAX_ITEM_BYTE_SIZE (100 KB) is rejected with InstrumentationError (flag-independent)', () => {
    const big = 'x'.repeat(150 * 1024);
    const transformedEvent: BrazeTransformedEvent = {
      destination,
      statusCode: 200,
      batchedRequest: {
        version: '1',
        type: 'REST',
        method: 'POST',
        endpoint: '',
        headers: {},
        params: {},
        body: {
          JSON: {
            events: [{ external_id: 'u1', name: 'BigEvent', time: 't', properties: { blob: big } }],
          },
        },
        files: {},
      } as any,
      metadata: [{ jobId: 1, workspaceId: 'workspace-non-mau' }],
    };
    const result = processBatchWithDeliveryMapping([transformedEvent]);
    const failures = result.filter((r) => (r as any).statusCode === 400);
    expect(failures.length).toBe(1);
    expect((failures[0] as any).error).toMatch(/exceeds .* bytes/);
    expect(onTrackOutputs(result, destination).length).toBe(0);
  });
});
describe('addAppId', () => {
  it('test_no_integrations_object', () => {
    const payload = { foo: 'bar' };
    const message = {};
    expect(addAppId(payload, message)).toEqual(payload);
  });

  it('test_no_braze_integration', () => {
    const payload = { foo: 'bar' };
    const message = { integrations: { All: true } };
    expect(addAppId(payload, message)).toEqual(payload);
  });

  it('test_braze_integration_no_app_id', () => {
    const payload = { foo: 'bar' };
    const message = { integrations: { All: true, braze: {} } };
    expect(addAppId(payload, message)).toEqual(payload);
  });

  it('test_braze_integration_with_app_id', () => {
    const payload = { foo: 'bar' };
    const message = { integrations: { All: true, braze: { appId: '123' } } };
    expect(addAppId(payload, message)).toEqual({ ...payload, app_id: '123' });
  });

  it('test_invalid_app_id', () => {
    const payload = { foo: 'bar' };
    const message = { integrations: { All: true, braze: { appId: 123 } } };
    expect(addAppId(payload, message)).toEqual({ ...payload, app_id: '123' });
  });

  it('test_invalid_app_id', () => {
    const payload = { foo: 'bar' };
    const message = { integrations: { All: true, braze: { appId: '' } } };
    expect(addAppId(payload, message)).toEqual(payload);
  });
});

describe('getPurchaseObjs', () => {
  test('a single valid product with all required properties', () => {
    const purchaseObjs = getPurchaseObjs(
      {
        type: 'track',
        properties: {
          products: [{ product_id: '123', price: 10.99, quantity: 2 }],
          currency: 'USD',
        },
        timestamp: '2023-08-04T12:34:56Z',
        anonymousId: 'abc',
      },
      {} as unknown as BrazeDestinationConfig,
    );
    expect(purchaseObjs).toEqual([
      {
        product_id: '123',
        price: 10.99,
        quantity: 2,
        currency: 'USD',
        time: '2023-08-04T12:34:56Z',
        _update_existing_only: false,
        user_alias: {
          alias_label: 'rudder_id',
          alias_name: 'abc',
        },
      },
    ]);
  });

  test('multiple valid products with all required properties', () => {
    const purchaseObjs = getPurchaseObjs(
      {
        type: 'track',
        properties: {
          products: [
            { product_id: '123', price: 10.99, quantity: 2 },
            { product_id: '456', price: 5.49, quantity: 1 },
          ],
          currency: 'EUR',
        },
        timestamp: '2023-08-04T12:34:56Z',
        anonymousId: 'abc',
      },
      {} as unknown as BrazeDestinationConfig,
    );
    expect(purchaseObjs).toEqual([
      {
        product_id: '123',
        price: 10.99,
        quantity: 2,
        currency: 'EUR',
        time: '2023-08-04T12:34:56Z',
        _update_existing_only: false,
        user_alias: {
          alias_label: 'rudder_id',
          alias_name: 'abc',
        },
      },
      {
        product_id: '456',
        price: 5.49,
        quantity: 1,
        currency: 'EUR',
        time: '2023-08-04T12:34:56Z',
        _update_existing_only: false,
        user_alias: {
          alias_label: 'rudder_id',
          alias_name: 'abc',
        },
      },
    ]);
  });

  test('single product with missing product_id property', () => {
    try {
      getPurchaseObjs(
        {
          type: 'track',
          properties: { products: [{ price: 10.99, quantity: 2 }], currency: 'USD' },
          timestamp: '2023-08-04T12:34:56Z',
          anonymousId: 'abc',
        },
        {} as unknown as BrazeDestinationConfig,
      );
    } catch (e: any) {
      expect(e.message).toEqual(
        'Invalid Order Completed event: Product Id is missing for product at index: 0',
      );
    }
  });

  test('single product with missing price property', () => {
    try {
      getPurchaseObjs(
        {
          type: 'track',
          properties: { products: [{ product_id: '123', quantity: 2 }], currency: 'USD' },
          timestamp: '2023-08-04T12:34:56Z',
          anonymousId: 'abc',
        },
        {} as unknown as BrazeDestinationConfig,
      );
    } catch (e: any) {
      expect(e.message).toEqual(
        'Invalid Order Completed event: Price is missing for product at index: 0',
      );
    }
  });

  test('single product with missing quantity property', () => {
    try {
      getPurchaseObjs(
        {
          type: 'track',
          properties: { products: [{ product_id: '123', price: 10.99 }], currency: 'USD' },
          timestamp: '2023-08-04T12:34:56Z',
          anonymousId: 'abc',
        },
        {} as unknown as BrazeDestinationConfig,
      );
    } catch (e: any) {
      expect(e.message).toEqual(
        'Invalid Order Completed event: Quantity is missing for product at index: 0',
      );
    }
  });

  test('single product with missing currency property', () => {
    try {
      getPurchaseObjs(
        {
          type: 'track',
          properties: { products: [{ product_id: '123', price: 10.99, quantity: 2 }] },
          timestamp: '2023-08-04T12:34:56Z',
          anonymousId: 'abc',
        },
        {} as unknown as BrazeDestinationConfig,
      );
    } catch (e: any) {
      expect(e.message).toEqual(
        'Invalid Order Completed event: Message properties and product at index: 0 is missing currency',
      );
    }
  });

  test('single product with missing timestamp property', () => {
    try {
      getPurchaseObjs(
        {
          type: 'track',
          properties: {
            products: [{ product_id: '123', price: 10.99, quantity: 2 }],
            currency: 'USD',
          },
          anonymousId: 'abc',
        },
        {} as unknown as BrazeDestinationConfig,
      );
    } catch (e: any) {
      expect(e.message).toEqual(
        'Invalid Order Completed event: Timestamp is missing in the message',
      );
    }
  });

  test('single product with NaN price', () => {
    try {
      getPurchaseObjs(
        {
          type: 'track',
          properties: {
            products: [{ product_id: '123', price: 'abc', quantity: 2 }],
            currency: 'USD',
          } as unknown as RudderBrazeMessage,
          timestamp: '2023-08-04T12:34:56Z',
          anonymousId: 'abc',
        },
        {} as unknown as BrazeDestinationConfig,
      );
    } catch (e: any) {
      expect(e.message).toEqual(
        'Invalid Order Completed event: Price is not a number for product at index: 0',
      );
    }
  });

  test('single product with NaN quantity', () => {
    try {
      getPurchaseObjs(
        {
          type: 'track',
          properties: {
            products: [{ product_id: '123', price: 10.99, quantity: 'abc' }],
            currency: 'USD',
          },
          timestamp: '2023-08-04T12:34:56Z',
          anonymousId: 'abc',
        } as unknown as RudderBrazeMessage,
        {} as unknown as BrazeDestinationConfig,
      );
    } catch (e: any) {
      expect(e.message).toEqual(
        'Invalid Order Completed event: Quantity is not a number for product at index: 0',
      );
    }
  });

  // Test case for a single product with valid currency property
  test('single product with valid currency property', () => {
    const purchaseObjs = getPurchaseObjs(
      {
        type: 'track',
        properties: {
          products: [{ product_id: '123', price: 10.99, quantity: 2 }],
          currency: 'USD',
        },
        timestamp: '2023-08-04T12:34:56Z',
        anonymousId: 'abc',
      },
      {} as unknown as BrazeDestinationConfig,
    );
    expect(purchaseObjs).toEqual([
      {
        product_id: '123',
        price: 10.99,
        quantity: 2,
        currency: 'USD',
        time: '2023-08-04T12:34:56Z',
        _update_existing_only: false,
        user_alias: {
          alias_label: 'rudder_id',
          alias_name: 'abc',
        },
      },
    ]);
  });

  test('products not being an array', () => {
    try {
      getPurchaseObjs(
        {
          properties: { products: { product_id: '123', price: 10.99, quantity: 2 } },
          timestamp: '2023-08-04T12:34:56Z',
          anonymousId: 'abc',
        } as unknown as RudderBrazeMessage,
        {} as unknown as BrazeDestinationConfig,
      );
    } catch (e: any) {
      expect(e.message).toEqual('Invalid Order Completed event: Products is not an array');
    }
  });

  test('empty products array', () => {
    try {
      getPurchaseObjs(
        {
          type: 'track',
          properties: { products: [], currency: 'USD' },
          timestamp: '2023-08-04T12:34:56Z',
          anonymousId: 'abc',
        },
        {} as unknown as BrazeDestinationConfig,
      );
    } catch (e: any) {
      expect(e.message).toEqual('Invalid Order Completed event: Products array is empty');
    }
  });

  test('message.properties being undefined', () => {
    try {
      getPurchaseObjs(
        {
          type: 'track',
          properties: undefined,
          timestamp: '2023-08-04T12:34:56Z',
          anonymousId: 'abc',
        },
        {} as unknown as BrazeDestinationConfig,
      );
    } catch (e: any) {
      expect(e.message).toEqual(
        'Invalid Order Completed event: Properties object is missing in the message',
      );
    }
  });

  test('products having extra properties', () => {
    const output = getPurchaseObjs(
      {
        type: 'track',
        properties: {
          products: [
            { product_id: '123', price: 10.99, quantity: 2, random_extra_property_a: 'abc' },
            { product_id: '456', price: 5.49, quantity: 1, random_extra_property_b: 'efg' },
            {
              product_id: '789',
              price: 15.49,
              quantity: 1,
              random_extra_property_a: 'abc',
              random_extra_property_b: 'efg',
              random_extra_property_c: 'hij',
            },
          ],
          currency: 'USD',
        },
        timestamp: '2023-08-04T12:34:56Z',
        anonymousId: 'abc',
      },
      {
        sendPurchaseEventWithExtraProperties: true,
      } as unknown as BrazeDestinationConfig,
    );
    expect(output).toEqual([
      {
        product_id: '123',
        price: 10.99,
        currency: 'USD',
        quantity: 2,
        time: '2023-08-04T12:34:56Z',
        properties: {
          random_extra_property_a: 'abc',
        },
        _update_existing_only: false,
        user_alias: {
          alias_name: 'abc',
          alias_label: 'rudder_id',
        },
      },
      {
        product_id: '456',
        price: 5.49,
        currency: 'USD',
        quantity: 1,
        time: '2023-08-04T12:34:56Z',
        properties: {
          random_extra_property_b: 'efg',
        },
        _update_existing_only: false,
        user_alias: {
          alias_name: 'abc',
          alias_label: 'rudder_id',
        },
      },
      {
        product_id: '789',
        price: 15.49,
        currency: 'USD',
        quantity: 1,
        time: '2023-08-04T12:34:56Z',
        properties: {
          random_extra_property_a: 'abc',
          random_extra_property_b: 'efg',
          random_extra_property_c: 'hij',
        },
        _update_existing_only: false,
        user_alias: {
          alias_name: 'abc',
          alias_label: 'rudder_id',
        },
      },
    ]);
  });

  test('products having extra properties with sendPurchaseEventWithExtraProperties as false', () => {
    const output = getPurchaseObjs(
      {
        type: 'track',
        properties: {
          products: [
            { product_id: '123', price: 10.99, quantity: 2, random_extra_property_a: 'abc' },
            { product_id: '456', price: 5.49, quantity: 1, random_extra_property_b: 'efg' },
            {
              product_id: '789',
              price: 15.49,
              quantity: 1,
              random_extra_property_a: 'abc',
              random_extra_property_b: 'efg',
              random_extra_property_c: 'hij',
            },
          ],
          currency: 'USD',
        },
        timestamp: '2023-08-04T12:34:56Z',
        anonymousId: 'abc',
      },
      {
        sendPurchaseEventWithExtraProperties: false,
      } as unknown as BrazeDestinationConfig,
    );
    expect(output).toEqual([
      {
        product_id: '123',
        price: 10.99,
        currency: 'USD',
        quantity: 2,
        time: '2023-08-04T12:34:56Z',
        _update_existing_only: false,
        user_alias: {
          alias_name: 'abc',
          alias_label: 'rudder_id',
        },
      },
      {
        product_id: '456',
        price: 5.49,
        currency: 'USD',
        quantity: 1,
        time: '2023-08-04T12:34:56Z',
        _update_existing_only: false,
        user_alias: {
          alias_name: 'abc',
          alias_label: 'rudder_id',
        },
      },
      {
        product_id: '789',
        price: 15.49,
        currency: 'USD',
        quantity: 1,
        time: '2023-08-04T12:34:56Z',
        _update_existing_only: false,
        user_alias: {
          alias_name: 'abc',
          alias_label: 'rudder_id',
        },
      },
    ]);
  });
});

describe('setAliasObject function', () => {
  // Test when integrationsObj has both alias_name and alias_label
  test('should set user_alias from integrationsObj if alias_name and alias_label are defined', () => {
    const payload = {};
    const result = setAliasObject(payload, {
      type: 'track',
      anonymousId: '12345',
      integrations: {
        BRAZE: {
          alias: {
            alias_name: 'user123',
            alias_label: 'customer_id',
          },
        },
      },
    });

    expect(result).toEqual({
      user_alias: {
        alias_name: 'user123',
        alias_label: 'customer_id',
      },
    });
  });

  // Test when integrationsObj is missing alias_name or alias_label
  test('should set user_alias with anonymousId as alias_name and "rudder_id" as alias_label if integrationsObj does not have alias_name or alias_label', () => {
    const message: RudderBrazeMessage = {
      type: 'track',
      anonymousId: '12345',
    };
    const payload = {};
    const result = setAliasObject(payload, message);

    expect(result).toEqual({
      user_alias: {
        alias_name: '12345',
        alias_label: 'rudder_id',
      },
    });
  });

  // Test when message has no anonymousId and integrationsObj is missing
  test('should return payload unchanged if message has no anonymousId and integrationsObj is missing', () => {
    const message: RudderBrazeMessage = {
      type: 'track',
    };
    const payload = {};
    const result = setAliasObject(payload, message);

    expect(result).toEqual(payload);
  });

  test('should set user_alias from integrationsObj if alias_name and alias_label are defined', () => {
    const payload = {};
    const result = setAliasObject(payload, {
      type: 'track',
      anonymousId: '12345',
      integrations: {
        BRAZE: {
          alias: {
            alias_name: 'user123',
            alias_label: 'customer_id',
          },
        },
      },
    });

    expect(result).toEqual({
      user_alias: {
        alias_name: 'user123',
        alias_label: 'customer_id',
      },
    });
  });

  test('should set user_alias from integrationsObj if alias_name and alias_label either is not defined', () => {
    const payload = {};
    const result = setAliasObject(payload, {
      type: 'track',
      anonymousId: '12345',
      integrations: {
        BRAZE: {
          alias: {
            alias_name: null,
            alias_label: 'customer_id',
          },
        },
      },
    });

    expect(result).toEqual({
      user_alias: {
        alias_name: '12345',
        alias_label: 'rudder_id',
      },
    });
  });

  test('should set user_alias from integrationsObj if alias_name and alias_label either is not defined', () => {
    const payload = {};
    const result = setAliasObject(payload, {
      type: 'track',
      anonymousId: '12345',
      userID: 'user123',
      integrations: {
        BRAZE: {
          alias: {
            alias_name: 'rudder_id-123',
            alias_label: 'customer_id',
          },
        },
      },
    });

    expect(result).toEqual({
      user_alias: {
        alias_name: 'rudder_id-123',
        alias_label: 'customer_id',
      },
    });
  });
});

describe('handleReservedProperties', () => {
  // Removes 'time' and 'event_name' keys from the input object
  it('should remove "time" and "event_name" keys when they are present in the input object', () => {
    const props = { time: '2023-10-01T00:00:00Z', event_name: 'test_event', other_key: 'value' };
    const result = handleReservedProperties(props);
    expect(result).toEqual({ other_key: 'value' });
  });

  // Input object is empty
  it('should return an empty object when the input object is empty', () => {
    const props = {};
    const result = handleReservedProperties(props);
    expect(result).toEqual({});
  });

  // Works correctly with an object that has no reserved keys
  it('should remove reserved keys when present in the input object', () => {
    const props = { time_stamp: '2023-10-01T00:00:00Z', event: 'test_event', other_key: 'value' };
    const result = handleReservedProperties(props);
    expect(result).toEqual({
      time_stamp: '2023-10-01T00:00:00Z',
      event: 'test_event',
      other_key: 'value',
    });
  });

  // Input object is null or undefined
  it('should return an empty object when input object is null', () => {
    const props = null as unknown as Record<string, unknown>;
    const result = handleReservedProperties(props);
    expect(result).toEqual({});
  });

  // Handles non-object inputs gracefully
  it('should return an empty object when a non-object input is provided', () => {
    const props = 'not an object' as unknown as Record<string, unknown>;
    try {
      handleReservedProperties(props);
    } catch (e: any) {
      expect(e.message).toBe('Invalid event properties');
    }
  });

  // Input object has only reserved keys
  it('should remove "time" and "event_name" keys when they are present in the input object', () => {
    const props = { time: '2023-10-01T00:00:00Z', event_name: 'test_event', other_key: 'value' };
    const result = handleReservedProperties(props);
    expect(result).toEqual({ other_key: 'value' });
  });

  // Works with objects having special characters in keys
  it('should not remove special characters keys when they are present in the input object', () => {
    const props = { 'special!@#$%^&*()_+-={}[]|\\;:\'",.<>?/`~': 'value', other_key: 'value' };
    const result = handleReservedProperties(props);
    expect(result).toEqual({
      other_key: 'value',
      'special!@#$%^&*()_+-={}[]|\\;:\'",.<>?/`~': 'value',
    });
  });
});

describe('combineSubscriptionGroups', () => {
  it('should merge external_ids, emails, and phones for the same subscription_group_id and subscription_state', () => {
    const input: BrazeSubscriptionGroup[] = [
      {
        subscription_group_id: 'group1',
        subscription_state: 'subscribed',
        external_ids: ['id1', 'id2'],
        emails: ['email1@example.com', 'email2@example.com'],
        phones: ['+1234567890', '+0987654321'],
      },
      {
        subscription_group_id: 'group1',
        subscription_state: 'subscribed',
        external_ids: ['id2', 'id3'],
        emails: ['email2@example.com', 'email3@example.com'],
        phones: ['+1234567890', '+1122334455'],
      },
    ];

    const expectedOutput: BrazeSubscriptionGroup[] = [
      {
        subscription_group_id: 'group1',
        subscription_state: 'subscribed',
        external_ids: ['id1', 'id2', 'id3'],
        emails: ['email1@example.com', 'email2@example.com', 'email3@example.com'],
        phones: ['+1234567890', '+0987654321', '+1122334455'],
      },
    ];

    const result = combineSubscriptionGroups(input);
    expect(result).toEqual(expectedOutput);
  });

  it('should handle groups with missing external_ids, emails, or phones', () => {
    const input: BrazeSubscriptionGroup[] = [
      {
        subscription_group_id: 'group1',
        subscription_state: 'subscribed',
        external_ids: ['id1'],
      },
      {
        subscription_group_id: 'group1',
        subscription_state: 'subscribed',
        emails: ['email1@example.com'],
      },
      {
        subscription_group_id: 'group1',
        subscription_state: 'subscribed',
        phones: ['+1234567890'],
      },
    ];

    const expectedOutput: BrazeSubscriptionGroup[] = [
      {
        subscription_group_id: 'group1',
        subscription_state: 'subscribed',
        external_ids: ['id1'],
        emails: ['email1@example.com'],
        phones: ['+1234567890'],
      },
    ];

    const result = combineSubscriptionGroups(input);
    expect(result).toEqual(expectedOutput);
  });

  it('should handle multiple unique subscription groups', () => {
    const input: BrazeSubscriptionGroup[] = [
      {
        subscription_group_id: 'group1',
        subscription_state: 'subscribed',
        external_ids: ['id1'],
      },
      {
        subscription_group_id: 'group2',
        subscription_state: 'unsubscribed',
        external_ids: ['id2'],
        emails: ['email2@example.com'],
      },
    ];

    const expectedOutput: BrazeSubscriptionGroup[] = [
      {
        subscription_group_id: 'group1',
        subscription_state: 'subscribed',
        external_ids: ['id1'],
      },
      {
        subscription_group_id: 'group2',
        subscription_state: 'unsubscribed',
        external_ids: ['id2'],
        emails: ['email2@example.com'],
      },
    ];

    const result = combineSubscriptionGroups(input);
    expect(result).toEqual(expectedOutput);
  });

  it('should not include undefined fields in the output', () => {
    const input: BrazeSubscriptionGroup[] = [
      {
        subscription_group_id: 'group1',
        subscription_state: 'subscribed',
        external_ids: ['id1'],
      },
    ];

    const expectedOutput: BrazeSubscriptionGroup[] = [
      {
        subscription_group_id: 'group1',
        subscription_state: 'subscribed',
        external_ids: ['id1'],
      },
    ];

    const result = combineSubscriptionGroups(input);
    expect(result).toEqual(expectedOutput);
  });
});

describe('getEndpointFromConfig', () => {
  type TestCase = {
    name: string;
    input: BrazeDestination;
    expected?: string;
    throws?: boolean;
    errorMessage?: string;
  };
  const testCases: TestCase[] = [
    {
      name: 'returns correct EU endpoint',
      input: { Config: { dataCenter: 'EU-02' } } as unknown as BrazeDestination,
      expected: 'https://rest.fra-02.braze.eu',
    },
    {
      name: 'returns correct US endpoint',
      input: { Config: { dataCenter: 'US-03' } } as unknown as BrazeDestination,
      expected: 'https://rest.iad-03.braze.com',
    },
    {
      name: 'returns correct AU endpoint',
      input: { Config: { dataCenter: 'AU-01' } } as unknown as BrazeDestination,
      expected: 'https://rest.au-01.braze.com',
    },
    {
      name: 'handles lowercase input correctly',
      input: { Config: { dataCenter: 'eu-03' } } as unknown as BrazeDestination,
      expected: 'https://rest.fra-03.braze.eu',
    },
    {
      name: 'handles whitespace in input',
      input: { Config: { dataCenter: ' US-02 ' } } as unknown as BrazeDestination,
      expected: 'https://rest.iad-02.braze.com',
    },
    {
      name: 'throws error for empty dataCenter',
      input: { Config: {} } as unknown as BrazeDestination,
      throws: true,
      errorMessage: 'Invalid Data Center: valid values are EU, US, AU',
    },
    {
      name: 'throws error for invalid region',
      input: { Config: { dataCenter: 'INVALID-01' } } as unknown as BrazeDestination,
      throws: true,
      errorMessage: 'Invalid Data Center: INVALID-01, valid values are EU, US, AU',
    },
  ];

  testCases.forEach(({ name, input, expected, throws, errorMessage }: TestCase) => {
    test(name, () => {
      if (throws) {
        expect(() => getEndpointFromConfig(input)).toThrow(errorMessage);
      } else {
        expect(getEndpointFromConfig(input)).toBe(expected);
      }
    });
  });
});

describe('formatGender', () => {
  it('should return "F" for female variations', () => {
    expect(formatGender('woman')).toBe('F');
    expect(formatGender('female')).toBe('F');
    expect(formatGender('w')).toBe('F');
    expect(formatGender('f')).toBe('F');
    expect(formatGender('WOMAN')).toBe('F');
    expect(formatGender('FEMALE')).toBe('F');
    expect(formatGender('W')).toBe('F');
    expect(formatGender('F')).toBe('F');
  });

  it('should return "M" for male variations', () => {
    expect(formatGender('man')).toBe('M');
    expect(formatGender('male')).toBe('M');
    expect(formatGender('m')).toBe('M');
    expect(formatGender('MAN')).toBe('M');
    expect(formatGender('MALE')).toBe('M');
    expect(formatGender('M')).toBe('M');
  });

  it('should return "O" for other variations', () => {
    expect(formatGender('other')).toBe('O');
    expect(formatGender('o')).toBe('O');
    expect(formatGender('OTHER')).toBe('O');
    expect(formatGender('O')).toBe('O');
  });

  it('should return null for invalid inputs', () => {
    expect(formatGender('invalid')).toBeNull();
    expect(formatGender('')).toBeNull();
    expect(formatGender(null)).toBeNull();
    expect(formatGender(undefined)).toBeNull();
    expect(formatGender(123)).toBeNull();
    expect(formatGender({})).toBeNull();
    expect(formatGender([])).toBeNull();
  });
});
