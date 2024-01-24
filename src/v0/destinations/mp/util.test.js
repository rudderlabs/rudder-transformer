const {
  combineBatchRequestsWithSameJobIds,
  groupEventsByEndpoint,
  batchEvents,
  generateBatchedPayloadForArray,
  buildUtmParams,
  trimTraits,
} = require('./util');
const { FEATURE_GZIP_SUPPORT } = require('../../util/constant');

const destinationMock = {
  Config: {
    token: 'test_api_token',
    prefixProperties: true,
    useNativeSDK: false,
    useOldMapping: true,
  },
  DestinationDefinition: {
    DisplayName: 'Mixpanel',
    ID: 'test_destination_definition_id',
    Name: 'MP',
  },
  Enabled: true,
  ID: 'test_id',
  Name: 'Mixpanel',
  Transformations: [],
};

const maxBatchSizeMock = 2;

describe('Mixpanel utils test', () => {
  describe('Unit test cases for groupEventsByEndpoint', () => {
    it('should return an object with empty arrays for all properties when the events array is empty', () => {
      const events = [];
      const result = groupEventsByEndpoint(events);
      expect(result).toEqual({
        engageEvents: [],
        groupsEvents: [],
        trackEvents: [],
        importEvents: [],
        batchErrorRespList: [],
      });
    });

    it('should return an object with all properties containing their respective events when the events array contains events of all types', () => {
      const events = [
        {
          message: {
            endpoint: '/engage',
            body: {
              JSON_ARRAY: {
                batch: '[{prop:1}]',
              },
            },
            userId: 'user1',
          },
        },
        {
          message: {
            endpoint: '/engage',
            body: {
              JSON_ARRAY: {
                batch: '[{prop:2}]',
              },
            },
            userId: 'user2',
          },
        },
        {
          message: {
            endpoint: '/groups',
            body: {
              JSON_ARRAY: {
                batch: '[{prop:3}]',
              },
            },
            userId: 'user1',
          },
        },
        {
          message: {
            endpoint: '/track',
            body: {
              JSON_ARRAY: {
                batch: '[{prop:4}]',
              },
            },
            userId: 'user1',
          },
        },
        {
          message: {
            endpoint: '/import',
            body: {
              JSON_ARRAY: {
                batch: '[{prop:5}]',
              },
            },
            userId: 'user2',
          },
        },
        { error: 'Message type abc not supported' },
      ];
      const result = groupEventsByEndpoint(events);
      expect(result).toEqual({
        engageEvents: [
          {
            message: {
              endpoint: '/engage',
              body: {
                JSON_ARRAY: {
                  batch: '[{prop:1}]',
                },
              },
              userId: 'user1',
            },
          },
          {
            message: {
              endpoint: '/engage',
              body: {
                JSON_ARRAY: {
                  batch: '[{prop:2}]',
                },
              },
              userId: 'user2',
            },
          },
        ],
        groupsEvents: [
          {
            message: {
              endpoint: '/groups',
              body: {
                JSON_ARRAY: {
                  batch: '[{prop:3}]',
                },
              },
              userId: 'user1',
            },
          },
        ],
        trackEvents: [
          {
            message: {
              endpoint: '/track',
              body: {
                JSON_ARRAY: {
                  batch: '[{prop:4}]',
                },
              },
              userId: 'user1',
            },
          },
        ],
        importEvents: [
          {
            message: {
              endpoint: '/import',
              body: {
                JSON_ARRAY: {
                  batch: '[{prop:5}]',
                },
              },
              userId: 'user2',
            },
          },
        ],
        batchErrorRespList: [{ error: 'Message type abc not supported' }],
      });
    });
  });

  describe('Unit test cases for batchEvents', () => {
    it('should return an array of batched events with correct payload and metadata', () => {
      const successRespList = [
        {
          message: {
            endpoint: '/engage',
            body: {
              JSON_ARRAY: {
                batch: '[{"prop":1}]',
              },
            },
            headers: {},
            params: {},
            userId: 'user1',
          },
          metadata: { jobId: 3 },
        },
        {
          message: {
            endpoint: '/engage',
            body: {
              JSON_ARRAY: {
                batch: '[{"prop":2}]',
              },
            },
            headers: {},
            params: {},
            userId: 'user2',
          },
          metadata: { jobId: 4 },
        },
        {
          message: {
            endpoint: '/engage',
            body: {
              JSON_ARRAY: {
                batch: '[{"prop":3}]',
              },
            },
            headers: {},
            params: {},
            userId: 'user2',
          },
          metadata: { jobId: 6 },
        },
      ];

      const result = batchEvents(successRespList, maxBatchSizeMock);

      expect(result).toEqual([
        {
          batched: true,
          batchedRequest: {
            body: { FORM: {}, JSON: {}, JSON_ARRAY: { batch: '[{"prop":1},{"prop":2}]' }, XML: {} },
            endpoint: '/engage',
            files: {},
            headers: {},
            method: 'POST',
            params: {},
            type: 'REST',
            version: '1',
          },
          destination: undefined,
          metadata: [{ jobId: 3 }, { jobId: 4 }],
          statusCode: 200,
        },
        {
          batched: true,
          batchedRequest: {
            body: { FORM: {}, JSON: {}, JSON_ARRAY: { batch: '[{"prop":3}]' }, XML: {} },
            endpoint: '/engage',
            files: {},
            headers: {},
            method: 'POST',
            params: {},
            type: 'REST',
            version: '1',
          },
          destination: undefined,
          metadata: [{ jobId: 6 }],
          statusCode: 200,
        },
      ]);
    });

    it('should return an empty array when successRespList is empty', () => {
      const successRespList = [];
      const result = batchEvents(successRespList, maxBatchSizeMock);
      expect(result).toEqual([]);
    });
  });

  describe('Unit test cases for combineBatchRequestsWithSameJobIds', () => {
    it('Combine batch request with same jobIds', async () => {
      const input = [
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/track/',
          },
          metadata: [
            {
              jobId: 1,
            },
            {
              jobId: 4,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/import/',
          },
          metadata: [
            {
              jobId: 3,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/track/',
          },
          metadata: [
            {
              jobId: 5,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/engage/',
          },
          metadata: [
            {
              jobId: 1,
            },
            {
              jobId: 3,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/import/',
          },
          metadata: [
            {
              jobId: 6,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
      ];

      const expectedOutput = [
        {
          batchedRequest: [
            {
              endpoint: 'https://api.mixpanel.com/track/',
            },
            {
              endpoint: 'https://api.mixpanel.com/engage/',
            },
            {
              endpoint: 'https://api.mixpanel.com/import/',
            },
          ],
          metadata: [
            {
              jobId: 1,
            },
            {
              jobId: 4,
            },
            {
              jobId: 3,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/track/',
          },
          metadata: [
            {
              jobId: 5,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/import/',
          },
          metadata: [
            {
              jobId: 6,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
      ];
      expect(combineBatchRequestsWithSameJobIds(input)).toEqual(expectedOutput);
    });

    it('Each batchRequest contains unique jobIds (no event multiplexing)', async () => {
      const input = [
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/track/',
          },
          metadata: [
            {
              jobId: 1,
            },
            {
              jobId: 4,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/engage/',
          },
          metadata: [
            {
              jobId: 2,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/engage/',
          },
          metadata: [
            {
              jobId: 5,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
      ];

      const expectedOutput = [
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/track/',
          },

          metadata: [
            {
              jobId: 1,
            },
            {
              jobId: 4,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/engage/',
          },
          metadata: [
            {
              jobId: 2,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
        {
          batchedRequest: {
            endpoint: 'https://api.mixpanel.com/engage/',
          },
          metadata: [
            {
              jobId: 5,
            },
          ],
          batched: true,
          statusCode: 200,
          destination: destinationMock,
        },
      ];
      expect(combineBatchRequestsWithSameJobIds(input)).toEqual(expectedOutput);
    });
  });

  describe('Unit test cases for generateBatchedPayloadForArray', () => {
    it('should generate a batched payload with GZIP payload for /import endpoint when given an array of events', () => {
      const events = [
        {
          body: { JSON_ARRAY: { batch: '[{"event": "event1"}]' } },
          endpoint: '/import',
          headers: { 'Content-Type': 'application/json' },
          params: {},
        },
        {
          body: { JSON_ARRAY: { batch: '[{"event": "event2"}]' } },
          endpoint: '/import',
          headers: { 'Content-Type': 'application/json' },
          params: {},
        },
      ];
      const expectedBatchedRequest = {
        body: {
          FORM: {},
          JSON: {},
          JSON_ARRAY: {},
          XML: {},
          GZIP: {
            payload: '[{"event":"event1"},{"event":"event2"}]',
          },
        },
        endpoint: '/import',
        files: {},
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        params: {},
        type: 'REST',
        version: '1',
      };

      const result = generateBatchedPayloadForArray(events, {
        features: { [FEATURE_GZIP_SUPPORT]: true },
      });

      expect(result).toEqual(expectedBatchedRequest);
    });

    it('should generate a batched payload with JSON_ARRAY body when given an array of events', () => {
      const events = [
        {
          body: { JSON_ARRAY: { batch: '[{"event": "event1"}]' } },
          endpoint: '/endpoint',
          headers: { 'Content-Type': 'application/json' },
          params: {},
        },
        {
          body: { JSON_ARRAY: { batch: '[{"event": "event2"}]' } },
          endpoint: '/endpoint',
          headers: { 'Content-Type': 'application/json' },
          params: {},
        },
      ];
      const expectedBatchedRequest = {
        body: {
          FORM: {},
          JSON: {},
          JSON_ARRAY: { batch: '[{"event":"event1"},{"event":"event2"}]' },
          XML: {},
        },
        endpoint: '/endpoint',
        files: {},
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        params: {},
        type: 'REST',
        version: '1',
      };

      const result = generateBatchedPayloadForArray(events, {
        features: { [FEATURE_GZIP_SUPPORT]: true },
      });

      expect(result).toEqual(expectedBatchedRequest);
    });
  });

  describe('Unit test cases for buildUtmParams', () => {
    it('should return an empty object when campaign is undefined', () => {
      const campaign = undefined;
      const result = buildUtmParams(campaign);
      expect(result).toEqual({});
    });

    it('should return an empty object when campaign is an empty object', () => {
      const campaign = {};
      const result = buildUtmParams(campaign);
      expect(result).toEqual({});
    });

    it('should return an empty object when campaign is not an object', () => {
      const campaign = [{ name: 'test' }];
      const result = buildUtmParams(campaign);
      expect(result).toEqual({});
    });

    it('should handle campaign object with null/undefined values', () => {
      const campaign = { name: null, source: 'rudder', medium: 'rudder', test: undefined };
      const result = buildUtmParams(campaign);
      expect(result).toEqual({
        utm_campaign: null,
        utm_source: 'rudder',
        utm_medium: 'rudder',
        test: undefined,
      });
    });
  });
  describe('Unit test cases for trimTraits', () => {
    // Given a valid traits object and contextTraits object, and a valid setOnceProperties array, the function should return an object containing traits, contextTraits, and setOnce properties.
    it('should return an object containing traits, contextTraits, and setOnce properties when given valid inputs', () => {
      const traits = { name: 'John', age: 30 };
      const contextTraits = { email: 'john@example.com' };
      const setOnceProperties = ['name', 'email'];

      const result = trimTraits(traits, contextTraits, setOnceProperties);

      expect(result).toEqual({
        traits: {
          age: 30,
        },
        contextTraits: {},
        setOnce: { $name: 'John', $email: 'john@example.com' },
      });
    });

    // Given an empty traits object and contextTraits object, and a valid setOnceProperties array, the function should return an object containing empty traits and contextTraits, and an empty setOnce property.
    it('should return an object containing empty traits and contextTraits, and an empty setOnce property when given empty traits and contextTraits objects', () => {
      const traits = {};
      const contextTraits = {};
      const setOnceProperties = ['name', 'email'];

      const result = trimTraits(traits, contextTraits, setOnceProperties);

      expect(result).toEqual({
        traits: {},
        contextTraits: {},
        setOnce: {},
      });
    });

    // Given an empty setOnceProperties array, the function should return an object containing the original traits and contextTraits objects, and an empty setOnce property.
    it('should return an object containing the original traits and contextTraits objects, and an empty setOnce property when given an empty setOnceProperties array', () => {
      const traits = { name: 'John', age: 30 };
      const contextTraits = { email: 'john@example.com' };
      const setOnceProperties = [];

      const result = trimTraits(traits, contextTraits, setOnceProperties);

      expect(result).toEqual({
        traits: { name: 'John', age: 30 },
        contextTraits: { email: 'john@example.com' },
        setOnce: {},
      });
    });

    // Given a setOnceProperties array containing properties that do not exist in either traits or contextTraits objects, the function should not add the property to the setOnce property.
    it('should not add properties to the setOnce property when given setOnceProperties array with non-existent properties', () => {
      const traits = { name: 'John', age: 30 };
      const contextTraits = { email: 'john@example.com' };
      const setOnceProperties = ['name', 'email', 'address'];

      const result = trimTraits(traits, contextTraits, setOnceProperties);

      expect(result).toEqual({
        traits: { age: 30 },
        contextTraits: {},
        setOnce: { $name: 'John', $email: 'john@example.com' },
      });
    });

    // Given a setOnceProperties array containing properties with nested paths that do not exist in either traits or contextTraits objects, the function should not add the property to the setOnce property.
    it('should not add properties to the setOnce property when given setOnceProperties array with non-existent nested properties', () => {
      const traits = { name: 'John', age: 30, address: 'kolkata' };
      const contextTraits = { email: 'john@example.com' };
      const setOnceProperties = ['name', 'email', 'address.city'];

      const result = trimTraits(traits, contextTraits, setOnceProperties);

      expect(result).toEqual({
        traits: { age: 30, address: 'kolkata' },
        contextTraits: {},
        setOnce: { $name: 'John', $email: 'john@example.com' },
      });
    });

    it('should add properties to the setOnce property when given setOnceProperties array with existent nested properties', () => {
      const traits = { name: 'John', age: 30, address: { city: 'kolkata' }, isAdult: false };
      const contextTraits = { email: 'john@example.com' };
      const setOnceProperties = ['name', 'email', 'address.city'];

      const result = trimTraits(traits, contextTraits, setOnceProperties);

      expect(result).toEqual({
        traits: { age: 30, address: {}, isAdult: false },
        contextTraits: {},
        setOnce: { $name: 'John', $email: 'john@example.com', $city: 'kolkata' },
      });
    });
  });
});
