const _ = require('lodash');
const { handleHttpRequest } = require('../../../adapters/network');
const { BrazeDedupUtility, addAppId, getPurchaseObjs } = require('./util');
const { processBatch } = require('./util');
const {
  removeUndefinedAndNullValues,
  removeUndefinedAndNullAndEmptyValues,
} = require('../../util');

// Mock the handleHttpRequest function
jest.mock('../../../adapters/network');

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
      const input = [{ message: { userId: '762123' } }];
      const expectedOutput = {
        externalIdsToQuery: ['762123'],
        aliasIdsToQuery: [],
      };
      const actualOutput = BrazeDedupUtility.prepareInputForDedup(input);
      expect(actualOutput).toEqual(expectedOutput);
    });

    it('should extract the externalIdOnly and add it to externalIdsToQuery array', () => {
      const input = [
        { message: { context: { externalId: [{ type: 'brazeExternalId', id: '54321' }] } } },
      ];
      const expectedOutput = {
        externalIdsToQuery: ['54321'],
        aliasIdsToQuery: [],
      };
      const actualOutput = BrazeDedupUtility.prepareInputForDedup(input);
      expect(actualOutput).toEqual(expectedOutput);
    });

    it('should extract the anonymousId and add it to aliasIdsToQuery array', () => {
      const input = [{ message: { anonymousId: 'anon123' } }];
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
      ];
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
      ];
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
      handleHttpRequest.mockClear();
    });

    it('should return an array of users', async () => {
      // Mock the response from handleHttpRequest
      handleHttpRequest.mockResolvedValueOnce({
        processedResponse: {
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
          oneTrustCookieCategories: [],
          restApiKey: 'test-rest-api-key',
          supportDedup: true,
          trackAnonymousUser: true,
          whitelistedEvents: [],
        },
        Enabled: true,
        WorkspaceID: 'workspaceidvalue',
        Transformations: [],
        IsProcessorEnabled: true,
      };

      // Call the function
      const users = await BrazeDedupUtility.doApiLookup(identfierChunks, destination);

      // Check the result
      expect(users).toEqual([
        [
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
      ]);

      // Check that handleHttpRequest was called once with the correct arguments
      expect(handleHttpRequest).toHaveBeenCalledTimes(1);
      expect(handleHttpRequest).toHaveBeenCalledWith(
        'post',
        'https://rest.iad-03.braze.com/users/export/ids',
        {
          external_ids: ['user1', 'user2'],
          user_aliases: [{ alias_name: 'user3', alias_label: 'rudder_id' }],
        },
        {
          headers: {
            Authorization: 'Bearer test-rest-api-key',
          },
          timeout: 10000,
        },
        { destType: 'braze', feature: 'transformation' },
      );
    });

    it('should make multiple API calls for large input chunks', async () => {
      const destination = {
        ID: 'some-destination-id',
        Name: 'Test Destination',
        Config: {
          restApiKey: 'test-rest-api-key',
        },
      };

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
      handleHttpRequest.mockImplementationOnce(() => ({
        processedResponse: {
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
      }));

      handleHttpRequest.mockImplementationOnce(() => ({
        processedResponse: {
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
      }));

      handleHttpRequest.mockImplementationOnce(() => ({
        processedResponse: {
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
      }));

      const chunkedUserData = await BrazeDedupUtility.doApiLookup(identifierChunks, destination);
      const result = _.flatMap(chunkedUserData);
      expect(result).toHaveLength(110);
      expect(handleHttpRequest).toHaveBeenCalledTimes(3);
    });

    it('should return users for successful API calls and return undefined for failed chunk', async () => {
      const destination = {
        ID: '123',
        Name: 'Test Destination',
        Config: {
          restApiKey: 'test_rest_api_key',
        },
      };
      const chunks = [
        [
          { external_id: 'user1' },
          { alias_name: 'alias1', alias_label: 'rudder_id' },
          { external_id: 'user2' },
        ],
        [{ alias_name: 'alias2', alias_label: 'rudder_id' }, { external_id: 'user3' }],
      ];

      // Success response for first chunk
      handleHttpRequest.mockImplementationOnce(() => ({
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
      }));
      // Failure response for second chunk
      handleHttpRequest.mockImplementationOnce(() => ({
        processedResponse: {
          response: {
            error: 'Failed to fetch users',
          },
          status: 500,
        },
      }));

      const users = await BrazeDedupUtility.doApiLookup(chunks, destination);

      expect(handleHttpRequest).toHaveBeenCalledTimes(2);
      // Assert that the first chunk was successful and the second failed
      // The failed chunked will be returned as undefined
      expect(users).toEqual([
        [
          { external_id: 'user1', email: 'user1@example.com' },
          { alias_name: 'alias1', alias_label: 'rudder_id', email: 'alias1@example.com' },
          { external_id: 'user2', email: 'user2@example.com' },
        ],
        undefined,
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
      const doApiLookupMock = jest.spyOn(BrazeDedupUtility, 'doApiLookup').mockResolvedValue([
        [{ external_id: '123', custom_attributes: { key1: 'value1' } }],
        [{ external_id: '456', custom_attributes: { key2: 'value2' } }],
        undefined, // simulate failed api call
        [{ alias_name: 'alias2', custom_attributes: { key3: 'value3' } }],
      ]);

      // create input data for doLookup
      const inputs = [
        { destination: { Config: { restApiKey: 'xyz' } }, message: { user_id: '123' } },
        { destination: { Config: { restApiKey: 'xyz' } }, message: { user_id: '456' } },
        { destination: { Config: { restApiKey: 'xyz' } }, message: { anonymousId: 'alias1' } },
        { destination: { Config: { restApiKey: 'xyz' } }, message: { anonymousId: 'alias2' } },
      ];

      // call doLookup and verify the output
      const result = await BrazeDedupUtility.doLookup(inputs);
      expect(result).toEqual([
        { external_id: '123', custom_attributes: { key1: 'value1' } },
        { external_id: '456', custom_attributes: { key2: 'value2' } },
        undefined, // response of failed api call
        { alias_name: 'alias2', custom_attributes: { key3: 'value3' } },
      ]);

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
        { Config: { restApiKey: 'xyz' } },
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
      const userData = {
        external_id: '123',
        color: 'green',
        age: 30,
        gender: 'male',
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
      expect(store.size).toBe(1);
      expect(result).toEqual({
        external_id: '123',
        color: 'green',
        age: 30,
        gender: 'male',
      });
    });

    test('returns null if all keys are in BRAZE_NON_BILLABLE_ATTRIBUTES', () => {
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
      expect(result).toBeNull();
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
  });
});

describe('processBatch', () => {
  test('processBatch handles more than 75 attributes, events, purchases, subscription_groups and merge users', () => {
    // Create input data with more than 75 attributes, events, and purchases
    const transformedEvents = [];
    for (let i = 0; i < 100; i++) {
      transformedEvents.push({
        destination: {
          Config: {
            restApiKey: 'restApiKey',
            dataCenter: 'US-03',
            enableSubscriptionGroupInGroupCall: true,
          },
        },
        statusCode: 200,
        batchedRequest: {
          body: {
            JSON: {
              attributes: [{ id: i, name: 'test', xyz: 'abc' }],
              events: [{ id: i, event: 'test', xyz: 'abc' }],
              purchases: [{ id: i, purchase: 'test', xyz: 'abc' }],
              subscription_groups: [{ id: i, group: 'test', xyz: 'abc' }],
              merge_updates: [{ id: i, alias: 'test', xyz: 'abc' }],
            },
          },
        },
        metadata: [{ job_id: i }],
      });
    }

    // Call the processBatch function
    const result = processBatch(transformedEvents);

    // Assert that the response is as expected
    expect(result.length).toBe(1); // One successful batched request and one failure response
    expect(result[0].batchedRequest.length).toBe(6); // Two batched requests
    expect(result[0].batchedRequest[0].body.JSON.partner).toBe('RudderStack'); // Verify partner name
    expect(result[0].batchedRequest[0].body.JSON.attributes.length).toBe(75); // First batch contains 75 attributes
    expect(result[0].batchedRequest[0].body.JSON.events.length).toBe(75); // First batch contains 75 events
    expect(result[0].batchedRequest[0].body.JSON.purchases.length).toBe(75); // First batch contains 75 purchases
    expect(result[0].batchedRequest[1].body.JSON.partner).toBe('RudderStack'); // Verify partner name
    expect(result[0].batchedRequest[1].body.JSON.attributes.length).toBe(25); // Second batch contains remaining 25 attributes
    expect(result[0].batchedRequest[1].body.JSON.events.length).toBe(25); // Second batch contains remaining 25 events
    expect(result[0].batchedRequest[1].body.JSON.purchases.length).toBe(25); // Second batch contains remaining 25 purchases
    expect(result[0].batchedRequest[2].body.JSON.subscription_groups.length).toBe(50); // First batch contains 50 subscription group
    expect(result[0].batchedRequest[3].body.JSON.subscription_groups.length).toBe(50); // First batch contains 25 subscription group
    expect(result[0].batchedRequest[4].body.JSON.merge_updates.length).toBe(50); // First batch contains 50 merge_updates
    expect(result[0].batchedRequest[5].body.JSON.merge_updates.length).toBe(50); // First batch contains 25 merge_updates
  });

  test('processBatch handles more than 75 attributes, events, and purchases with non uniform distribution', () => {
    // Create input data with more than 75 attributes, events, and purchases
    const transformedEventsSet1 = new Array(120).fill(0).map((_, i) => ({
      destination: {
        Config: {
          restApiKey: 'restApiKey',
          dataCenter: 'eu',
        },
      },
      statusCode: 200,
      batchedRequest: {
        body: {
          JSON: {
            events: [{ id: i, event: 'test', xyz: 'abc' }],
          },
        },
      },
      metadata: [{ job_id: i }],
    }));

    const transformedEventsSet2 = new Array(160).fill(0).map((_, i) => ({
      destination: {
        Config: {
          restApiKey: 'restApiKey',
          dataCenter: 'eu',
        },
      },
      statusCode: 200,
      batchedRequest: {
        body: {
          JSON: {
            purchases: [{ id: i, name: 'test', xyz: 'abc' }],
          },
        },
      },
      metadata: [{ job_id: 120 + i }],
    }));

    const transformedEventsSet3 = new Array(100).fill(0).map((_, i) => ({
      destination: {
        Config: {
          restApiKey: 'restApiKey',
          dataCenter: 'eu',
        },
      },
      statusCode: 200,
      batchedRequest: {
        body: {
          JSON: {
            attributes: [{ id: i, name: 'test', xyz: 'abc' }],
          },
        },
      },
      metadata: [{ job_id: 280 + i }],
    }));

    const transformedEventsSet4 = new Array(70).fill(0).map((_, i) => ({
      destination: {
        Config: {
          restApiKey: 'restApiKey',
          dataCenter: 'eu',
          enableSubscriptionGroupInGroupCall: true,
        },
      },
      statusCode: 200,
      batchedRequest: {
        body: {
          JSON: {
            subscription_groups: [{ id: i, group: 'test', xyz: 'abc' }],
          },
        },
      },
      metadata: [{ job_id: 280 + i }],
    }));

    const transformedEventsSet5 = new Array(40).fill(0).map((_, i) => ({
      destination: {
        Config: {
          restApiKey: 'restApiKey',
          dataCenter: 'eu',
          enableSubscriptionGroupInGroupCall: true,
        },
      },
      statusCode: 200,
      batchedRequest: {
        body: {
          JSON: {
            merge_updates: [{ id: i, alias: 'test', xyz: 'abc' }],
          },
        },
      },
      metadata: [{ job_id: 280 + i }],
    }));

    // Call the processBatch function
    const result = processBatch([
      ...transformedEventsSet1,
      ...transformedEventsSet2,
      ...transformedEventsSet3,
      ...transformedEventsSet4,
      ...transformedEventsSet5,
    ]);

    // Assert that the response is as expected
    expect(result.length).toBe(1); // One successful batched request and one failure response
    expect(result[0].metadata.length).toBe(490); // Check the total length is same as input jobs (120 + 160 + 100 + 70 +40)
    expect(result[0].batchedRequest.length).toBe(6); // Two batched requests
    expect(result[0].batchedRequest[0].body.JSON.partner).toBe('RudderStack'); // Verify partner name
    expect(result[0].batchedRequest[0].body.JSON.attributes.length).toBe(75); // First batch contains 75 attributes
    expect(result[0].batchedRequest[0].body.JSON.events.length).toBe(75); // First batch contains 75 events
    expect(result[0].batchedRequest[0].body.JSON.purchases.length).toBe(75); // First batch contains 75 purchases
    expect(result[0].batchedRequest[1].body.JSON.partner).toBe('RudderStack'); // Verify partner name
    expect(result[0].batchedRequest[1].body.JSON.attributes.length).toBe(25); // Second batch contains remaining 25 attributes
    expect(result[0].batchedRequest[1].body.JSON.events.length).toBe(45); // Second batch contains remaining 45 events
    expect(result[0].batchedRequest[1].body.JSON.purchases.length).toBe(75); // Second batch contains remaining 75 purchases
    expect(result[0].batchedRequest[2].body.JSON.purchases.length).toBe(10); // Third batch contains remaining 10 purchases
    expect(result[0].batchedRequest[3].body.JSON.subscription_groups.length).toBe(50); // First batch contains 50 subscription group
    expect(result[0].batchedRequest[4].body.JSON.subscription_groups.length).toBe(20); // First batch contains 20 subscription group
    expect(result[0].batchedRequest[5].body.JSON.merge_updates.length).toBe(40); // First batch contains 50 merge_updates
  });

  test('check success and failure scenarios both for processBatch', () => {
    const transformedEvents = [];
    let successCount = 0;
    let failureCount = 0;
    for (let i = 0; i < 100; i++) {
      const rando = Math.random() * 100;
      if (rando < 50) {
        transformedEvents.push({
          destination: {
            Config: {
              restApiKey: 'restApiKey',
              dataCenter: 'eu',
            },
          },
          statusCode: 200,
          batchedRequest: {
            body: {
              JSON: {
                attributes: [{ id: i, name: 'test', xyz: 'abc' }],
                events: [{ id: i, event: 'test', xyz: 'abc' }],
                purchases: [{ id: i, purchase: 'test', xyz: 'abc' }],
              },
            },
          },
          metadata: [{ job_id: i }],
        });
        successCount = successCount + 1;
      } else {
        transformedEvents.push({
          destination: {
            Config: {
              restApiKey: 'restApiKey',
              dataCenter: 'eu',
            },
          },
          statusCode: 400,
          metadata: [{ job_id: i }],
          error: 'Random Error',
        });
        failureCount = failureCount + 1;
      }
    }
    // Call the processBatch function
    const result = processBatch(transformedEvents);
    expect(result.length).toBe(failureCount + 1);
    expect(result[0].batchedRequest[0].body.JSON.attributes.length).toBe(successCount);
    expect(result[0].batchedRequest[0].body.JSON.events.length).toBe(successCount);
    expect(result[0].batchedRequest[0].body.JSON.purchases.length).toBe(successCount);
    expect(result[0].batchedRequest[0].body.JSON.partner).toBe('RudderStack');
    expect(result[0].metadata.length).toBe(successCount);
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
    const purchaseObjs = getPurchaseObjs({
      properties: { products: [{ product_id: '123', price: 10.99, quantity: 2 }], currency: 'USD' },
      timestamp: '2023-08-04T12:34:56Z',
      anonymousId: 'abc',
    });
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
    const purchaseObjs = getPurchaseObjs({
      properties: {
        products: [
          { product_id: '123', price: 10.99, quantity: 2 },
          { product_id: '456', price: 5.49, quantity: 1 },
        ],
        currency: 'EUR',
      },
      timestamp: '2023-08-04T12:34:56Z',
      anonymousId: 'abc',
    });
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
      getPurchaseObjs({
        properties: { products: [{ price: 10.99, quantity: 2 }], currency: 'USD' },
        timestamp: '2023-08-04T12:34:56Z',
        anonymousId: 'abc',
      });
    } catch (e) {
      expect(e.message).toEqual(
        'Invalid Order Completed event: Product Id is missing for product at index: 0',
      );
    }
  });

  test('single product with missing price property', () => {
    try {
      getPurchaseObjs({
        properties: { products: [{ product_id: '123', quantity: 2 }], currency: 'USD' },
        timestamp: '2023-08-04T12:34:56Z',
        anonymousId: 'abc',
      });
    } catch (e) {
      expect(e.message).toEqual(
        'Invalid Order Completed event: Price is missing for product at index: 0',
      );
    }
  });

  test('single product with missing quantity property', () => {
    try {
      getPurchaseObjs({
        properties: { products: [{ product_id: '123', price: 10.99 }], currency: 'USD' },
        timestamp: '2023-08-04T12:34:56Z',
        anonymousId: 'abc',
      });
    } catch (e) {
      expect(e.message).toEqual(
        'Invalid Order Completed event: Quantity is missing for product at index: 0',
      );
    }
  });

  test('single product with missing currency property', () => {
    try {
      getPurchaseObjs({
        properties: { products: [{ product_id: '123', price: 10.99, quantity: 2 }] },
        timestamp: '2023-08-04T12:34:56Z',
        anonymousId: 'abc',
      });
    } catch (e) {
      expect(e.message).toEqual(
        'Invalid Order Completed event: Message properties and product at index: 0 is missing currency',
      );
    }
  });

  test('single product with missing timestamp property', () => {
    try {
      getPurchaseObjs({
        properties: {
          products: [{ product_id: '123', price: 10.99, quantity: 2 }],
          currency: 'USD',
        },
        anonymousId: 'abc',
      });
    } catch (e) {
      expect(e.message).toEqual(
        'Invalid Order Completed event: Timestamp is missing in the message',
      );
    }
  });

  test('single product with NaN price', () => {
    try {
      getPurchaseObjs({
        properties: {
          products: [{ product_id: '123', price: 'abc', quantity: 2 }],
          currency: 'USD',
        },
        timestamp: '2023-08-04T12:34:56Z',
        anonymousId: 'abc',
      });
    } catch (e) {
      expect(e.message).toEqual(
        'Invalid Order Completed event: Price is not a number for product at index: 0',
      );
    }
  });

  test('single product with NaN quantity', () => {
    try {
      getPurchaseObjs({
        properties: {
          products: [{ product_id: '123', price: 10.99, quantity: 'abc' }],
          currency: 'USD',
        },
        timestamp: '2023-08-04T12:34:56Z',
        anonymousId: 'abc',
      });
    } catch (e) {
      expect(e.message).toEqual(
        'Invalid Order Completed event: Quantity is not a number for product at index: 0',
      );
    }
  });

  // Test case for a single product with valid currency property
  test('single product with valid currency property', () => {
    const purchaseObjs = getPurchaseObjs({
      properties: {
        products: [{ product_id: '123', price: 10.99, quantity: 2 }],
        currency: 'USD',
      },
      timestamp: '2023-08-04T12:34:56Z',
      anonymousId: 'abc',
    });
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
      getPurchaseObjs({
        properties: { products: { product_id: '123', price: 10.99, quantity: 2 } },
        timestamp: '2023-08-04T12:34:56Z',
        anonymousId: 'abc',
      });
    } catch (e) {
      expect(e.message).toEqual('Invalid Order Completed event: Products is not an array');
    }
  });

  test('empty products array', () => {
    try {
      getPurchaseObjs({
        properties: { products: [], currency: 'USD' },
        timestamp: '2023-08-04T12:34:56Z',
        anonymousId: 'abc',
      });
    } catch (e) {
      expect(e.message).toEqual('Invalid Order Completed event: Products array is empty');
    }
  });

  test('message.properties being undefined', () => {
    try {
      getPurchaseObjs({
        properties: undefined,
        timestamp: '2023-08-04T12:34:56Z',
        anonymousId: 'abc',
      });
    } catch (e) {
      expect(e.message).toEqual(
        'Invalid Order Completed event: Properties object is missing in the message',
      );
    }
  });

  test('products having extra properties', () => {
    const output = getPurchaseObjs(
      {
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
      },
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
      },
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
