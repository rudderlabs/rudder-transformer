// utils.test.ts
import crypto from 'crypto';
import { Buffer } from 'buffer';
import lodash from 'lodash';

// Functions under test from utils.ts
import {
  base64Sha,
  getWsseHeader,
  buildHeader,
  deduceCustomIdentifier,
  buildIdentifyPayload,
  findRudderPropertyByEmersysProperty,
  deduceExternalIdValue,
  buildGroupPayload,
  deduceEventId,
  deduceEndPoint,
  createSingleIdentifyPayload,
  ensureSizeConstraints,
  createIdentifyBatches,
  createGroupBatches,
  batchResponseBuilder,
} from './utils';

// Types and constants
import { EMAIL_FIELD_ID } from './config';
import { Message, DestConfig, SuccessfulEvent } from './types';

// Mock external helpers (they come from '../../../../v0/util')
jest.mock('../../../../v0/util', () => ({
  getIntegrationsObj: jest.fn(),
  getValueFromMessage: jest.fn(),
  validateEventName: jest.fn(),
  getHashFromArray: jest.fn(),
}));

import {
  getIntegrationsObj,
  getValueFromMessage,
  validateEventName,
  getHashFromArray,
} from '../../../../v0/util';

describe('Emarsys utils tests', () => {
  /* -------------------- base64Sha -------------------- */
  describe('base64Sha', () => {
    test.each([['test'], ['another string']])(
      'should return the base64 encoding of the sha1 hex digest for "%s"',
      (input) => {
        const hexDigest = crypto.createHash('sha1').update(input).digest('hex');
        const expected = Buffer.from(hexDigest).toString('base64');
        expect(base64Sha(input)).toEqual(expected);
      },
    );
  });

  /* -------------------- getWsseHeader -------------------- */
  describe('getWsseHeader', () => {
    test.each([
      { user: 'user1', secret: 'secret1' },
      { user: 'admin', secret: 'supersecret' },
    ])('should return a properly formatted WSSE header for %o', ({ user, secret }) => {
      const header = getWsseHeader(user, secret);
      const regex = new RegExp(
        `^UsernameToken Username="${user}", PasswordDigest=".+", Nonce=".+", Created=".+?"$`,
      );
      expect(header).toMatch(regex);
    });
  });

  /* -------------------- buildHeader -------------------- */
  describe('buildHeader', () => {
    test.each([
      [{ emersysUsername: 'user1', emersysUserSecret: 'secret1' }, false],
      [{ emersysUsername: '', emersysUserSecret: 'secret1' }, true],
      [{ emersysUsername: 'user1', emersysUserSecret: '' }, true],
    ])('buildHeader with config %o should throw error? %s', (configObj, shouldError) => {
      if (shouldError) {
        expect(() => buildHeader(configObj as DestConfig)).toThrow(
          'Either Emarsys user name or user secret is missing. Aborting',
        );
      } else {
        const header = buildHeader(configObj as DestConfig);
        expect(header).toHaveProperty('Content-Type', 'application/json');
        expect(header).toHaveProperty('Accept', 'application/json');
        expect(header).toHaveProperty('X-WSSE');
        expect(header['X-WSSE']).toMatch(
          new RegExp(`^UsernameToken Username="${configObj.emersysUsername}"`),
        );
      }
    });
  });

  /* -------------------- deduceCustomIdentifier -------------------- */
  describe('deduceCustomIdentifier', () => {
    test.each([
      [{ customIdentifierId: 'customId' }, 'fallback', 'customId'],
      [null, 'fallback', 'fallback'],
      [null, undefined, EMAIL_FIELD_ID],
      [{}, 'provided', 'provided'], // When integrationObject is empty, fallback is used.
    ])(
      'deduceCustomIdentifier(%o, %s) should return %s',
      (integrationObject, fallback, expected) => {
        expect(deduceCustomIdentifier(integrationObject, fallback)).toEqual(expected);
      },
    );
  });

  /* -------------------- buildIdentifyPayload -------------------- */
  describe('buildIdentifyPayload', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test.each([
      {
        description: 'builds valid identify payload',
        message: {
          type: 'identify',
          traits: { email: 'test@example.com' },
          context: { traits: { email: 'test@example.com' } },
        },
        destConfig: {
          fieldMapping: [{ rudderProperty: 'email', emersysProperty: 42 }],
          defaultContactList: 'list123',
          emersysCustomIdentifier: undefined,
          discardEmptyProperties: false,
        },
        integrationObject: { contactListId: 'list123', customIdentifierId: 42 },
        getValue: 'test@example.com',
        expectedResult: {
          eventType: 'identify',
          destinationPayload: {
            key_id: 42,
            contacts: [{ '42': 'test@example.com' }],
            contact_list_id: 'list123',
          },
        },
      },
      {
        description: 'throws error when contact list is missing',
        message: {
          type: 'identify',
          traits: { email: 'test@example.com' },
          context: { traits: { email: 'test@example.com' } },
        },
        destConfig: {
          fieldMapping: [{ rudderProperty: 'email', emersysProperty: 'email' }],
          defaultContactList: undefined,
          emersysCustomIdentifier: undefined,
          discardEmptyProperties: false,
        },
        integrationObject: {},
        getValue: 'test@example.com',
        expectedError:
          'Cannot a find a specific contact list either through configuration or via integrations object',
      },
      {
        description: 'throws error when identifier value is missing',
        message: {
          type: 'identify',
          traits: { name: 'Test' },
          context: { traits: { name: 'Test' } },
        },
        destConfig: {
          fieldMapping: [{ rudderProperty: 'email', emersysProperty: 'email' }],
          defaultContactList: 'list123',
          emersysCustomIdentifier: undefined,
          discardEmptyProperties: false,
        },
        integrationObject: { contactListId: 'list123' },
        getValue: undefined,
        expectedResult: undefined,
        expectedError:
          'Either configured custom contact identifier value or default identifier email value is missing',
      },
    ])(
      '$description',
      ({ message, destConfig, integrationObject, getValue, expectedResult, expectedError }) => {
        (getIntegrationsObj as jest.Mock).mockReturnValue(integrationObject);
        (getValueFromMessage as jest.Mock).mockReturnValue(getValue);

        if (expectedError) {
          expect(() => buildIdentifyPayload(message, destConfig as DestConfig)).toThrow(
            expectedError,
          );
        } else {
          const result = buildIdentifyPayload(message, destConfig as DestConfig);
          expect(result).toEqual(expectedResult);
        }
      },
    );
  });

  /* -------------------- findRudderPropertyByEmersysProperty -------------------- */
  describe('findRudderPropertyByEmersysProperty', () => {
    test.each([
      {
        emersysProp: 'email_address',
        mapping: [{ rudderProperty: 'email', emersysProperty: 'email_address' }],
        expected: 'email',
      },
      {
        emersysProp: 'nonexistent',
        mapping: [{ rudderProperty: 'name', emersysProperty: 'first_name' }],
        expected: 'email',
      },
      {
        emersysProp: 'anything',
        mapping: undefined,
        expected: 'email',
      },
    ])(
      'for emersysProperty=%s and mapping=%o should return %s',
      ({ emersysProp, mapping, expected }) => {
        expect(findRudderPropertyByEmersysProperty(emersysProp, mapping)).toEqual(expected);
      },
    );
  });

  /* -------------------- deduceExternalIdValue -------------------- */
  describe('deduceExternalIdValue', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    test.each([
      {
        description: 'returns valid external id value',
        message: {
          type: 'track',
          traits: { email: 'test@example.com' },
          context: { traits: { email: 'test@example.com' } },
        },
        emersysIdentifier: 'email',
        fieldMapping: [{ rudderProperty: 'email', emersysProperty: 'email' }],
        getValue: 'test@example.com',
        expected: 'test@example.com',
      },
      {
        description: 'throws error if external id value is missing',
        message: { type: 'track', traits: {}, context: { traits: {} } },
        emersysIdentifier: 'email',
        fieldMapping: [{ rudderProperty: 'email', emersysProperty: 'email' }],
        getValue: undefined,
        expectedError: 'Could not find value for externalId required in track call. Aborting.',
      },
    ])(
      '$description',
      ({ message, emersysIdentifier, fieldMapping, getValue, expected, expectedError }) => {
        (getValueFromMessage as jest.Mock).mockReturnValue(getValue);
        if (expectedError) {
          expect(() =>
            deduceExternalIdValue(message as Message, emersysIdentifier, fieldMapping),
          ).toThrow(expectedError);
        } else {
          expect(
            deduceExternalIdValue(message as Message, emersysIdentifier, fieldMapping),
          ).toEqual(expected);
        }
      },
    );
  });

  /* -------------------- buildGroupPayload -------------------- */
  describe('buildGroupPayload', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    test.each([
      {
        description: 'builds valid group payload using provided groupId',
        message: {
          type: 'group',
          groupId: 'group123',
          traits: { email: 'user@example.com' },
          context: { traits: { email: 'user@example.com' } },
        },
        destConfig: {
          fieldMapping: [{ rudderProperty: 'email', emersysProperty: 'email' }],
          defaultContactList: 'defaultList',
          emersysCustomIdentifier: undefined,
        },
        integrationObject: { customIdentifierId: 'email', contactListId: 'listFromIntegration' },
        getValue: 'user@example.com',
        expectedResult: {
          eventType: 'group',
          destinationPayload: {
            payload: { key_id: 'email', external_ids: ['user@example.com'] },
            contactListId: 'group123',
          },
        },
      },
      {
        description: 'throws error when external id value is missing in group payload',
        message: {
          type: 'group',
          groupId: 'group123',
          traits: {},
          context: { traits: {} },
        },
        destConfig: {
          fieldMapping: [{ rudderProperty: 'email', emersysProperty: 'email' }],
          defaultContactList: 'defaultList',
          emersysCustomIdentifier: undefined,
        },
        integrationObject: { customIdentifierId: 'email' },
        getValue: undefined,
        expectedError: 'Could not find value for externalId required in group call. Aborting.',
      },
    ])(
      '$description',
      ({ message, destConfig, integrationObject, getValue, expectedResult, expectedError }) => {
        (getIntegrationsObj as jest.Mock).mockReturnValue(integrationObject);
        (getValueFromMessage as jest.Mock).mockReturnValue(getValue);

        if (expectedError) {
          expect(() => buildGroupPayload(message, destConfig as DestConfig)).toThrow(expectedError);
        } else {
          const result = buildGroupPayload(message, destConfig as DestConfig);
          expect(result).toEqual(expectedResult);
        }
      },
    );
  });

  /* -------------------- deduceEventId -------------------- */
  describe('deduceEventId', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    test.each([
      {
        description: 'returns mapped event id if found',
        message: { event: 'track_event', type: 'track' },
        destConfig: { eventsMapping: [{ from: 'track_event', to: 'evt_123' }] },
        hashReturn: { track_event: 'evt_123' },
        expected: 'evt_123',
      },
      {
        description: 'throws error if event is not mapped',
        message: { event: 'unmapped_event', type: 'track' },
        destConfig: { eventsMapping: [{ from: 'track_event', to: 'evt_123' }] },
        hashReturn: {},
        expectedError: 'unmapped_event is not mapped to any Emersys external event. Aborting',
      },
    ])('$description', ({ message, destConfig, hashReturn, expected, expectedError }) => {
      (getHashFromArray as jest.Mock).mockReturnValue(hashReturn);
      (validateEventName as jest.Mock).mockImplementation(() => {});

      if (expectedError) {
        expect(() => deduceEventId(message as Message, destConfig as DestConfig)).toThrow(
          expectedError,
        );
      } else {
        expect(deduceEventId(message as Message, destConfig as DestConfig)).toEqual(expected);
      }
    });
  });

  /* -------------------- deduceEndPoint -------------------- */
  describe('deduceEndPoint', () => {
    test.each([
      {
        description: 'returns endpoint for identify events',
        finalPayload: {
          eventType: 'identify',
          destinationPayload: {},
        },
        expected: 'https://api.emarsys.net/api/v2/contact/?create_if_not_exists=1',
      },
      {
        description: 'returns endpoint for group events',
        finalPayload: {
          eventType: 'group',
          destinationPayload: { contactListId: 'list123' },
        },
        expected: 'https://api.emarsys.net/api/v2/contactlist/list123/add',
      },
      {
        description: 'returns endpoint for track events',
        finalPayload: {
          eventType: 'track',
          destinationPayload: { eventId: 'evt_456' },
        },
        expected: 'https://api.emarsys.net/api/v2/event/evt_456/trigger',
      },
      {
        description: 'returns undefined for unknown event types',
        finalPayload: {
          eventType: 'unknown',
          destinationPayload: {},
        },
        expected: undefined,
      },
    ])('$description', ({ finalPayload, expected }) => {
      expect(deduceEndPoint(finalPayload)).toEqual(expected);
    });
  });

  /* -------------------- createSingleIdentifyPayload -------------------- */
  describe('createSingleIdentifyPayload', () => {
    test.each([
      {
        keyId: 'id_1',
        contacts: [{ email: 'test@example.com' }],
        contactListId: 'list123',
        expected: {
          key_id: 'id_1',
          contacts: [{ email: 'test@example.com' }],
          contact_list_id: 'list123',
        },
      },
    ])(
      'should create single identify payload correctly',
      ({ keyId, contacts, contactListId, expected }) => {
        expect(createSingleIdentifyPayload(keyId, contacts, contactListId)).toEqual(expected);
      },
    );
  });

  /* -------------------- ensureSizeConstraints -------------------- */
  describe('ensureSizeConstraints', () => {
    test.each([
      {
        contacts: Array(10).fill({ a: 'small' }),
      },
      {
        contacts: [{ a: 'data1' }, { a: 'data2' }, { a: 'data3' }],
      },
    ])('should partition contacts without data loss', ({ contacts }) => {
      const chunks = ensureSizeConstraints(contacts);
      const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
      expect(total).toEqual(contacts.length);
    });
  });

  /* -------------------- createIdentifyBatches -------------------- */
  describe('createIdentifyBatches', () => {
    test('should create identify batches from a successful event', () => {
      const successfulEvent: SuccessfulEvent = {
        message: [
          {
            version: '1',
            type: 'identify',
            headers: {},
            body: {
              JSON: {
                eventType: 'identify',
                destinationPayload: {
                  key_id: 'id_1',
                  contacts: [{ email: 'test@example.com' }],
                  contact_list_id: 'list123',
                },
              },
            },
          },
        ],
        destination: {},
        metadata: ['meta'],
      };

      const batches = createIdentifyBatches([successfulEvent]);
      expect(batches.length).toBeGreaterThan(0);
      batches.forEach((batch) => {
        expect(batch.endpoint).toEqual(
          'https://api.emarsys.net/api/v2/contact/?create_if_not_exists=1',
        );
        expect(batch.payload).toHaveProperty('key_id', 'id_1');
        expect(batch.payload).toHaveProperty('contact_list_id', 'list123');
      });
    });
  });

  /* -------------------- createGroupBatches -------------------- */
  describe('createGroupBatches', () => {
    test('should create group batches from a successful event', () => {
      const successfulEvent: SuccessfulEvent = {
        message: [
          {
            version: '1',
            type: 'group',
            headers: {},
            body: {
              JSON: {
                eventType: 'group',
                destinationPayload: {
                  payload: { key_id: 'id_1', external_ids: ['ext1'] },
                  contactListId: 'list123',
                },
              },
            },
          },
        ],
        destination: {},
        metadata: ['meta'],
      };

      const batches = createGroupBatches([successfulEvent]);
      expect(batches.length).toBeGreaterThan(0);
      batches.forEach((batch) => {
        expect(batch.endpoint).toEqual('https://api.emarsys.net/api/v2/contactlist/list123/add');
        expect(batch.payload).toEqual({
          key_id: 'id_1',
          external_ids: ['ext1'],
        });
      });
    });
  });

  /* -------------------- batchResponseBuilder -------------------- */
  describe('batchResponseBuilder', () => {
    test.each([
      {
        description: 'returns batched requests for provided successful events',
        events: [
          {
            message: [
              {
                // Wrap in array to match [Message] type
                version: '1',
                type: 'identify',
                headers: { 'Content-Type': 'application/json' },
                body: {
                  JSON: {
                    eventType: 'identify',
                    destinationPayload: {
                      key_id: 'id_1',
                      contacts: [{ email: 'test@example.com' }],
                      contact_list_id: 'list123',
                    },
                  },
                },
              },
            ],
            destination: { dest: 'dest1' },
            metadata: ['meta1'],
          },
        ] as SuccessfulEvent[],
        expectedLength: 1,
      },
    ])('$description', ({ events, expectedLength }) => {
      const batchedRequests = batchResponseBuilder(events);
      expect(batchedRequests.length).toEqual(expectedLength);
    });
  });
});
