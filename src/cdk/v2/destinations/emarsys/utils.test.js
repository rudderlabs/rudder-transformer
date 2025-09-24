const {
  buildIdentifyPayload,
  buildGroupPayload,
  base64Sha,
  getWsseHeader,
  findRudderPropertyByEmersysProperty,
  createGroupBatches,
  deduceEventId,
} = require('./utils');
const {
  checkIfEventIsAbortableAndExtractErrorMessage,
} = require('../../../../v1/destinations/emarsys/networkHandler');
const crypto = require('crypto');
const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
const { responses } = require('../../../../../test/testHelper');

describe('Emarsys utils', () => {
  describe('base64Sha', () => {
    it('should return a base64 encoded SHA1 hash of the input string', () => {
      const input = 'test';
      const expected = 'YTk0YThmZTVjY2IxOWJhNjFjNGMwODczZDM5MWU5ODc5ODJmYmJkMw==';
      const result = base64Sha(input);
      expect(result).toEqual(expected);
    });

    it('should return an empty string when input is empty', () => {
      const input = '';
      const expected = 'ZGEzOWEzZWU1ZTZiNGIwZDMyNTViZmVmOTU2MDE4OTBhZmQ4MDcwOQ==';
      const result = base64Sha(input);
      expect(result).toEqual(expected);
    });
  });

  describe('getWsseHeader', () => {
    beforeEach(() => {
      jest
        .spyOn(crypto, 'randomBytes')
        .mockReturnValue(Buffer.from('abcdef1234567890abcdef1234567890', 'hex'));
      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-04-28T12:34:56.789Z');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should generate a correct WSSE header', () => {
      const user = 'testUser';
      const secret = 'testSecret';
      const expectedNonce = 'abcdef1234567890abcdef1234567890';
      const expectedTimestamp = '2024-04-28T12:34:56.789Z';
      const expectedDigest = base64Sha(expectedNonce + expectedTimestamp + secret);
      const expectedHeader = `UsernameToken Username="${user}", PasswordDigest="${expectedDigest}", Nonce="${expectedNonce}", Created="${expectedTimestamp}"`;
      const result = getWsseHeader(user, secret);

      expect(result).toBe(expectedHeader);
    });
  });

  describe('buildIdentifyPayload', () => {
    it('should correctly build payload with field mapping', () => {
      const message = {
        type: 'identify',
        traits: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          optin: 1,
          active_customer: 0,
          welcome_journey: undefined,
        },
      };
      const destination = {
        fieldMapping: [
          { rudderProperty: 'firstName', emersysProperty: '1' },
          { rudderProperty: 'lastName', emersysProperty: '2' },
          { rudderProperty: 'email', emersysProperty: '3' },
          { rudderProperty: 'optin', emersysProperty: '31' },
          { rudderProperty: 'active_customer', emersysProperty: '32' },
          { rudderProperty: 'welcome_journey', emersysProperty: '33' },
          { rudderProperty: 'expiring_5_days_journey', emersysProperty: '34' },
        ],
        defaultContactList: 'dummyContactList',
      };
      const expectedPayload = {
        contact_list_id: 'dummyContactList',
        contacts: [
          {
            1: 'John',
            2: 'Doe',
            3: 'john.doe@example.com',
            31: 1,
            32: 0,
          },
        ],
        key_id: 3,
      };

      const result = buildIdentifyPayload(message, destination);

      expect(result.eventType).toBe('identify');
      expect(result.destinationPayload).toEqual(expectedPayload);
    });

    it('should throw error when opt-in field value is not allowed', () => {
      const message = {
        type: 'identify',
        traits: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          optin: 3,
        },
      };
      const destination = {
        fieldMapping: [
          { rudderProperty: 'firstName', emersysProperty: '1' },
          { rudderProperty: 'lastName', emersysProperty: '2' },
          { rudderProperty: 'email', emersysProperty: '3' },
          { rudderProperty: 'optin', emersysProperty: '31' },
        ],
        defaultContactList: 'dummyList',
      };
      expect(() => {
        buildIdentifyPayload(message, destination);
      }).toThrow('Only 1,2, values are allowed for optin field');
    });

    it('should throw error when no contact list can be assigned field value is not allowed', () => {
      const message = {
        type: 'identify',
        traits: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          optin: 1,
        },
      };
      const destination = {
        fieldMapping: [
          { rudderProperty: 'firstName', emersysProperty: '1' },
          { rudderProperty: 'lastName', emersysProperty: '2' },
          { rudderProperty: 'email', emersysProperty: '3' },
          { rudderProperty: 'optin', emersysProperty: '31' },
        ],
      };
      expect(() => {
        buildIdentifyPayload(message, destination);
      }).toThrow(
        'Cannot a find a specific contact list either through configuration or via integrations object',
      );
    });

    it('should correctly build payload with field mapping present in integrations object', () => {
      const message = {
        type: 'identify',
        traits: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          optin: 1,
        },
        integrations: {
          EMARSYS: {
            customIdentifierId: 1,
            contactListId: 'objectListId',
          },
        },
      };
      const destination = {
        fieldMapping: [
          { rudderProperty: 'firstName', emersysProperty: '1' },
          { rudderProperty: 'lastName', emersysProperty: '2' },
          { rudderProperty: 'email', emersysProperty: '3' },
          { rudderProperty: 'optin', emersysProperty: '31' },
        ],
        defaultContactList: 'dummyContactList',
      };
      const expectedPayload = {
        contact_list_id: 'objectListId',
        contacts: [
          {
            1: 'John',
            2: 'Doe',
            3: 'john.doe@example.com',
            31: 1,
          },
        ],
        key_id: 1,
      };

      const result = buildIdentifyPayload(message, destination);

      expect(result.eventType).toBe('identify');
      expect(result.destinationPayload).toEqual(expectedPayload);
    });
  });

  describe('buildGroupPayload', () => {
    // Returns an object with eventType and destinationPayload keys when given valid message and destination inputs
    it('should return an object with eventType and destinationPayload keys when given valid message and destination inputs with default externalId', () => {
      const message = {
        type: 'group',
        groupId: 'group123',
        context: {
          traits: {
            email: 'test@example.com',
          },
        },
      };
      const destination = {
        Config: {
          emersysCustomIdentifier: '3',
          defaultContactList: 'list123',
          fieldMapping: [
            { emersysProperty: '100', rudderProperty: 'customId' },
            { emersysProperty: '3', rudderProperty: 'email' },
          ],
        },
      };
      const result = buildGroupPayload(message, destination);
      expect(result).toEqual({
        eventType: 'group',
        destinationPayload: {
          payload: {
            key_id: 3,
            external_ids: ['test@example.com'],
          },
          contactListId: 'group123',
        },
      });
    });

    it('should return an object with eventType and destinationPayload keys when given valid message and destination inputs with configured externalId', () => {
      const message = {
        type: 'group',
        groupId: 'group123',
        context: {
          traits: {
            email: 'test@example.com',
            customId: '123',
          },
        },
      };
      const destination = {
        emersysCustomIdentifier: '100',
        defaultContactList: 'list123',
        fieldMapping: [
          { emersysProperty: '100', rudderProperty: 'customId' },
          { emersysProperty: '3', rudderProperty: 'email' },
        ],
      };
      const result = buildGroupPayload(message, destination);
      expect(result).toEqual({
        eventType: 'group',
        destinationPayload: {
          payload: {
            key_id: '100',
            external_ids: ['123'],
          },
          contactListId: 'group123',
        },
      });
    });

    it('should throw an InstrumentationError if emersysCustomIdentifier value is not present in payload', () => {
      const message = {
        type: 'group',
        groupId: 'group123',
        context: {
          traits: {
            email: 'test@example.com',
          },
        },
      };
      const destination = {
        emersysCustomIdentifier: 'customId',
        defaultContactList: 'list123',
        fieldMapping: [
          { emersysProperty: 'customId', rudderProperty: 'customId' },
          { emersysProperty: 'email', rudderProperty: 'email' },
        ],
      };
      expect(() => {
        buildGroupPayload(message, destination);
      }).toThrow(InstrumentationError);
    });
  });

  describe('createGroupBatches', () => {
    // Should group events by key_id and contactListId
    it('should group events by key_id and contactListId when events are provided', () => {
      // Arrange
      const events = [
        {
          message: [
            {
              body: {
                JSON: {
                  destinationPayload: {
                    payload: {
                      key_id: 'key1',
                      external_ids: ['id1', 'id2'],
                    },
                    contactListId: 'list1',
                  },
                },
              },
            },
          ],
          metadata: { jobId: 1, userId: 'u1' },
        },
        {
          message: [
            {
              body: {
                JSON: {
                  destinationPayload: {
                    payload: {
                      key_id: 'key2',
                      external_ids: ['id3', 'id4'],
                    },
                    contactListId: 'list2',
                  },
                },
              },
            },
          ],
          metadata: { jobId: 2, userId: 'u2' },
        },
        {
          message: [
            {
              body: {
                JSON: {
                  destinationPayload: {
                    payload: {
                      key_id: 'key1',
                      external_ids: ['id5', 'id6'],
                    },
                    contactListId: 'list1',
                  },
                },
              },
            },
          ],
          metadata: { jobId: 3, userId: 'u3' },
        },
      ];

      // Act
      const result = createGroupBatches(events);

      // Assert
      expect(result).toEqual([
        {
          endpoint: 'https://api.emarsys.net/api/v2/contactlist/list1/add',
          payload: {
            key_id: 'key1',
            external_ids: ['id1', 'id2', 'id5', 'id6'],
          },
          metadata: [
            { jobId: 1, userId: 'u1' },
            { jobId: 3, userId: 'u3' },
          ],
        },
        {
          endpoint: 'https://api.emarsys.net/api/v2/contactlist/list2/add',
          payload: {
            key_id: 'key2',
            external_ids: ['id3', 'id4'],
          },
          metadata: [{ jobId: 2, userId: 'u2' }],
        },
      ]);
    });

    // Should return an empty array if no events are provided
    it('should return an empty array when no events are provided', () => {
      // Arrange
      const events = [];

      // Act
      const result = createGroupBatches(events);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findRudderPropertyByEmersysProperty', () => {
    // Returns the correct rudderProperty when given a valid emersysProperty and fieldMapping
    it('should return the correct rudderProperty when given a valid emersysProperty and fieldMapping', () => {
      const emersysProperty = 'firstName';
      const fieldMapping = [
        { emersysProperty: 'email', rudderProperty: 'email' },
        { emersysProperty: 'firstName', rudderProperty: 'firstName' },
        { emersysProperty: 'lastName', rudderProperty: 'lastName' },
      ];

      const result = findRudderPropertyByEmersysProperty(emersysProperty, fieldMapping);

      expect(result).toBe('firstName');
    });

    // Returns null when given an empty fieldMapping
    it('should return null when given an empty fieldMapping', () => {
      const emersysProperty = 'email';
      const fieldMapping = [];

      const result = findRudderPropertyByEmersysProperty(emersysProperty, fieldMapping);

      expect(result).toBe('email');
    });
  });

  describe('checkIfEventIsAbortableAndExtractErrorMessage', () => {
    // Returns {isAbortable: false, errorMsg: ''} if event is neither a string nor an object with keyId.
    it('should return {isAbortable: false, errorMsg: ""} when event is neither a string nor an object with keyId', () => {
      const event = 123;
      const destinationResponse = {
        response: {
          data: {
            errors: {
              errorKey: {
                errorCode: 'errorMessage',
              },
            },
          },
        },
      };
      const keyId = 'keyId';

      const result = checkIfEventIsAbortableAndExtractErrorMessage(
        event,
        destinationResponse,
        keyId,
      );

      expect(result).toEqual({ isAbortable: false, errorMsg: '' });
    });

    // Returns {isAbortable: false, errorMsg: ''} if errors object is empty.
    it('should return {isAbortable: false, errorMsg: ""} when errors object is empty', () => {
      const event = 'event';
      const destinationResponse = {
        response: {
          data: {
            errors: {},
          },
        },
      };
      const keyId = 'keyId';

      const result = checkIfEventIsAbortableAndExtractErrorMessage(
        event,
        destinationResponse,
        keyId,
      );

      expect(result).toEqual({ isAbortable: false, errorMsg: '' });
    });

    // Returns {isAbortable: true, errorMsg} if event is a string and has a corresponding error in the errors object.
    it('should return {isAbortable: true, errorMsg} when event is a string and has a corresponding error in the errors object', () => {
      const event = 'event';
      const destinationResponse = {
        response: {
          data: {
            errors: {
              event: {
                errorCode: 'errorMessage',
              },
            },
          },
        },
      };
      const keyId = 'keyId';

      const result = checkIfEventIsAbortableAndExtractErrorMessage(
        event,
        destinationResponse,
        keyId,
      );

      expect(result).toEqual({
        isAbortable: true,
        errorMsg: JSON.stringify({ errorCode: 'errorMessage' }),
      });
    });

    // Returns {isAbortable: true, errorMsg} if event is an object with keyId and has a corresponding error in the errors object.
    it('should return {isAbortable: true, errorMsg} when event is an object with keyId and has a corresponding error in the errors object', () => {
      const event = {
        keyId: 'event',
      };
      const destinationResponse = {
        response: {
          data: {
            errors: {
              event: {
                errorCode: 'errorMessage',
              },
            },
          },
        },
      };
      const keyId = 'keyId';

      const result = checkIfEventIsAbortableAndExtractErrorMessage(
        event,
        destinationResponse,
        keyId,
      );

      expect(result).toEqual({
        isAbortable: true,
        errorMsg: JSON.stringify({ errorCode: 'errorMessage' }),
      });
    });
  });

  describe('deduceEventId', () => {
    // When a valid event name is provided and there is a mapping for it, the function should return the corresponding eventId.
    it('should return the corresponding eventId when a valid event name is provided and there is a mapping for it', () => {
      const message = { event: 'validEvent' };
      const destConfig = { eventsMapping: [{ from: 'validEvent', to: 'eventId' }] };
      const result = deduceEventId(message, destConfig);
      expect(result).toBe('eventId');
    });

    // When an invalid event name is provided, the function should throw a ConfigurationError.
    it('should throw a ConfigurationError when an invalid event name is provided', () => {
      const message = { event: 'invalidEvent' };
      const destConfig = { eventsMapping: [{ from: 'validEvent', to: 'eventId' }] };
      expect(() => deduceEventId(message, destConfig)).toThrow(ConfigurationError);
    });

    // When a valid event name is provided and there is no mapping for it, the function should throw a ConfigurationError.
    it('should throw a ConfigurationError when a valid event name is provided and there is no mapping for it', () => {
      const message = { event: 'validEvent' };
      const destConfig = { eventsMapping: [] };
      expect(() => deduceEventId(message, destConfig)).toThrow(ConfigurationError);
    });

    // When eventsMapping is not an array, the function should throw a TypeError.
    it('should throw a TypeError when eventsMapping is not an array', () => {
      const message = { event: 'validEvent' };
      const destConfig = { eventsMapping: 'notAnArray' };
      expect(() => deduceEventId(message, destConfig)).toThrow(
        'validEvent is not mapped to any Emersys external event. Aborting',
      );
    });
  });
});
