const { EVENT_TYPE } = require('rudder-transformer-cdk/build/constants');
const {
  buildIdentifyPayload,
  buildGroupPayload,
  deduceEndPoint,
  batchResponseBuilder,
  base64Sha,
  getWsseHeader,
  findRudderPropertyByEmersysProperty,
  formatIdentifyPayloadsWithEndpoint,
} = require('./utils');
const crypto = require('crypto');
const { InstrumentationError } = require('@rudderstack/integrations-lib');

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
      },
    };
    const destination = {
      Config: {
        fieldMapping: [
          { rudderProperty: 'firstName', emersysProperty: '1' },
          { rudderProperty: 'lastName', emersysProperty: '2' },
          { rudderProperty: 'email', emersysProperty: '3' },
          { rudderProperty: 'optin', emersysProperty: '31' },
        ],
        defaultContactList: 'dummyContactList',
      },
    };
    const expectedPayload = {
      contact_list_id: 'dummyContactList',
      contacts: [
        {
          1: 'John',
          2: 'Doe',
          3: 'john.doe@example.com',
          31: 1,
        },
      ],
      key_id: 3,
    };

    const result = buildIdentifyPayload(message, destination);

    expect(result.eventType).toBe(EVENT_TYPE.IDENTIFY);
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
      Config: {
        fieldMapping: [
          { rudderProperty: 'firstName', emersysProperty: '1' },
          { rudderProperty: 'lastName', emersysProperty: '2' },
          { rudderProperty: 'email', emersysProperty: '3' },
          { rudderProperty: 'optin', emersysProperty: '31' },
        ],
        defaultContactList: 'dummyList',
      },
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
      Config: {
        fieldMapping: [
          { rudderProperty: 'firstName', emersysProperty: '1' },
          { rudderProperty: 'lastName', emersysProperty: '2' },
          { rudderProperty: 'email', emersysProperty: '3' },
          { rudderProperty: 'optin', emersysProperty: '31' },
        ],
      },
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
        EMERSYS: {
          customIdentifierId: 1,
          contactListId: 'objectListId',
        },
      },
    };
    const destination = {
      Config: {
        fieldMapping: [
          { rudderProperty: 'firstName', emersysProperty: '1' },
          { rudderProperty: 'lastName', emersysProperty: '2' },
          { rudderProperty: 'email', emersysProperty: '3' },
          { rudderProperty: 'optin', emersysProperty: '31' },
        ],
        defaultContactList: 'dummyContactList',
      },
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

    expect(result.eventType).toBe(EVENT_TYPE.IDENTIFY);
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
          key_id: '3',
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
      Config: {
        emersysCustomIdentifier: '100',
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
      Config: {
        emersysCustomIdentifier: 'customId',
        defaultContactList: 'list123',
        fieldMapping: [
          { emersysProperty: 'customId', rudderProperty: 'customId' },
          { emersysProperty: 'email', rudderProperty: 'email' },
        ],
      },
    };
    expect(() => {
      buildGroupPayload(message, destination);
    }).toThrow(InstrumentationError);
  });
});
