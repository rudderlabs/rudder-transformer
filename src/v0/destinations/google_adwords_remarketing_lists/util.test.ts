import sha256 from 'sha256';
import { generateRandomString } from '@rudderstack/integrations-lib';
import {
  populateIdentifiers,
  responseBuilder,
  getOperationAudienceId,
  populateIdentifiersForRecordEvent,
} from './util';
import { API_VERSION } from './config';
import stats from '../../../util/stats';

const accessToken = generateRandomString();
const body = {
  operations: [
    {
      create: {
        userIdentifiers: [
          {
            hashedEmail: 'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
          },
          {
            hashedPhoneNumber: '8846dcb6ab2d73a0e67dbd569fa17cec2d9d391e5b05d1dd42919bc21ae82c45',
          },
          {
            addressInfo: {
              hashedFirstName: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
              hashedLastName: 'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
              countryCode: 'US',
              postalCode: '1245',
            },
          },
        ],
      },
    },
  ],
};
const baseDestination = {
  Config: {
    rudderAccountId: '258Yea7usSKNpbkIaesL9oJ9iYw',
    audienceId: '7090784486',
    customerId: '7693729833',
    loginCustomerId: '',
    subAccount: false,
    userSchema: ['email', 'phone', 'addressInfo'],
    isHashRequired: true,
    typeOfList: 'General',
  },
};
const consentBlock = {
  adPersonalization: 'UNSPECIFIED',
  adUserData: 'UNSPECIFIED',
};
const message = {
  action: 'insert',
  context: {
    ip: '14.5.67.21',
    library: {
      name: 'http',
    },
  },
  recordId: '2',
  rudderId: '2',
  fields: {
    email: 'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
    phone: '8846dcb6ab2d73a0e67dbd569fa17cec2d9d391e5b05d1dd42919bc21ae82c45',
    firstName: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    lastName: 'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
    country: 'US',
    postalCode: '1245',
  },
  type: 'record',
};
const expectedResponse = {
  version: '1',
  type: 'REST',
  method: 'POST',
  endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/7693729833/offlineUserDataJobs`,
  endpointPath: 'offlineUserDataJobs',
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  params: {
    listId: '7090784486',
    customerId: '7693729833',
    consent: {
      adPersonalization: 'UNSPECIFIED',
      adUserData: 'UNSPECIFIED',
    },
  },
  body: {
    JSON: {
      operations: [
        {
          create: {
            userIdentifiers: [
              {
                hashedEmail: 'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
              },
              {
                hashedPhoneNumber:
                  '8846dcb6ab2d73a0e67dbd569fa17cec2d9d391e5b05d1dd42919bc21ae82c45',
              },
              {
                addressInfo: {
                  hashedFirstName:
                    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                  hashedLastName:
                    'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
                  countryCode: 'US',
                  postalCode: '1245',
                },
              },
            ],
          },
        },
      ],
    },
    JSON_ARRAY: {},
    XML: {},
    FORM: {},
  },
  files: {},
};
const attributeArray = [
  {
    email: 'test@abc.com',
    phone: '@09876543210',
    firstName: 'test',
    lastName: 'rudderlabs',
    country: 'US',
    postalCode: '1245',
  },
];

const hashedArray = [
  {
    // test@abc.com → normalized (non-Gmail: trim+lowercase only) → test@abc.com → sha256
    hashedEmail: 'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
  },
  {
    // @09876543210 → strip spaces/dashes/parens/dots (@ not stripped) → @09876543210 → add + → +@09876543210 → sha256
    hashedPhoneNumber: sha256('+@09876543210'),
  },
  {
    addressInfo: {
      // 'test' → trim+lowercase → 'test' → sha256
      hashedFirstName: sha256('test'),
      // 'rudderlabs' → trim+lowercase → 'rudderlabs' → sha256
      hashedLastName: sha256('rudderlabs'),
      countryCode: 'US',
      postalCode: '1245',
    },
  },
];

describe('GARL utils test', () => {
  describe('responseBuilder function tests', () => {
    it('Should return correct response for given payload', () => {
      const response = responseBuilder(
        accessToken,
        body,
        baseDestination,
        getOperationAudienceId(baseDestination.Config.audienceId, message),
        consentBlock,
      );
      expect(response).toEqual(expectedResponse);
    });

    it('Should throw error if subaccount is true and loginCustomerId is not defined', () => {
      try {
        const destination2 = Object.create(baseDestination);
        destination2.Config.subAccount = true;
        destination2.Config.loginCustomerId = '';
        const response = responseBuilder(
          accessToken,
          body,
          destination2,
          getOperationAudienceId(baseDestination.Config.audienceId, message),
          consentBlock,
        );
        expect(response).toEqual(undefined);
      } catch (error: unknown) {
        expect((error as Error).message).toEqual(
          `loginCustomerId is required as subAccount is true.`,
        );
      }
    });

    it('Should throw error if operationAudienceId is not defined', () => {
      try {
        const destination1 = Object.create(baseDestination);
        destination1.Config.audienceId = '';
        const response = responseBuilder(
          accessToken,
          body,
          destination1,
          getOperationAudienceId(baseDestination.Config.audienceId, message),
          consentBlock,
        );
        expect(response).toEqual(undefined);
      } catch (error: unknown) {
        expect((error as Error).message).toEqual(`List ID is a mandatory field`);
      }
    });
  });

  describe('populateIdentifiers function tests', () => {
    it('Should hash and return identifiers for a given list of attributes', () => {
      const { typeOfList, isHashRequired } = baseDestination.Config;
      const identifier = populateIdentifiers(
        attributeArray,
        typeOfList,
        baseDestination.Config.userSchema,
        isHashRequired,
        'test-workspace-id',
        'test-destination-id',
      );
      expect(identifier).toEqual(hashedArray);
    });
  });

  describe('Google-specific PII normalization', () => {
    const wsId = 'test-workspace-id';
    const destId = 'test-destination-id';

    describe('email normalization', () => {
      it.each([
        {
          description: 'Gmail: removes dots and +suffix from username',
          input: 'Jane.Doe+Shopping@googlemail.com',
          expected: sha256('janedoe@googlemail.com'),
        },
        {
          description: 'Gmail: removes dots (no +suffix)',
          input: 'Jane.Doe@gmail.com',
          expected: sha256('janedoe@gmail.com'),
        },
        {
          description: 'Non-Gmail: preserves dots and +suffix, only lowercases',
          input: 'user.name+NYC@Example.com',
          expected: sha256('user.name+nyc@example.com'),
        },
        {
          description: 'Non-Gmail: already lowercase, no change',
          input: 'test@abc.com',
          expected: sha256('test@abc.com'),
        },
        {
          description: 'Gmail: multiple dots in username',
          input: 'a.b.c@gmail.com',
          expected: sha256('abc@gmail.com'),
        },
      ])('$description', ({ input, expected }) => {
        const result = populateIdentifiersForRecordEvent(
          [{ email: input }],
          'General',
          ['email'],
          true,
          wsId,
          destId,
        );
        expect(result).toEqual([{ identifiers: [{ hashedEmail: expected }] }]);
      });
    });

    describe('phone normalization', () => {
      it.each([
        {
          description: 'strips formatting characters and preserves + prefix',
          input: '+1 (800) 555-0101',
          expected: sha256('+18005550101'),
        },
        {
          description: 'adds + prefix when missing',
          input: '18005550101',
          expected: sha256('+18005550101'),
        },
        {
          description: 'already normalized phone passes through unchanged',
          input: '+19876543210',
          expected: sha256('+19876543210'),
        },
        {
          description: 'strips parentheses and dashes',
          input: '+1(800)555-0101',
          expected: sha256('+18005550101'),
        },
      ])('$description', ({ input, expected }) => {
        const result = populateIdentifiersForRecordEvent(
          [{ phone: input }],
          'General',
          ['phone'],
          true,
          wsId,
          destId,
        );
        expect(result).toEqual([{ identifiers: [{ hashedPhoneNumber: expected }] }]);
      });

      it.each([
        { description: 'whitespace only', input: '   ' },
        { description: 'separators only', input: '().-' },
        { description: 'empty string', input: '' },
      ])('blank phone ($description) is skipped, not hashed as "+"', ({ input }) => {
        const result = populateIdentifiersForRecordEvent(
          [{ phone: input }],
          'General',
          ['phone'],
          true,
          wsId,
          destId,
        );
        expect(result).toEqual([{ error: expect.any(Error) }]);
      });
    });

    describe('name normalization', () => {
      it.each([
        {
          description: 'firstName: trims whitespace and lowercases',
          field: 'firstName',
          input: '  John  ',
          expected: sha256('john'),
        },
        {
          description: 'lastName: trims whitespace and lowercases',
          field: 'lastName',
          input: '  DOE  ',
          expected: sha256('doe'),
        },
      ])('$description', ({ field, input, expected }) => {
        const result = populateIdentifiersForRecordEvent(
          [{ [field]: input, country: 'US', postalCode: '12345' }],
          'General',
          ['addressInfo'],
          true,
          wsId,
          destId,
        );
        const addressInfo = (result[0] as { identifiers: Record<string, unknown>[] }).identifiers[0]
          .addressInfo as Record<string, unknown>;
        expect(addressInfo[field === 'firstName' ? 'hashedFirstName' : 'hashedLastName']).toEqual(
          expected,
        );
      });
    });

    describe('country and postal code normalization', () => {
      it('trims whitespace from country code (not hashed)', () => {
        const result = populateIdentifiersForRecordEvent(
          [{ country: '  US  ', postalCode: '12345' }],
          'General',
          ['addressInfo'],
          true,
          wsId,
          destId,
        );
        const addressInfo = (result[0] as { identifiers: Record<string, unknown>[] }).identifiers[0]
          .addressInfo as Record<string, unknown>;
        expect(addressInfo.countryCode).toEqual('US');
      });

      it('trims whitespace from postal code (not hashed)', () => {
        const result = populateIdentifiersForRecordEvent(
          [{ country: 'US', postalCode: '  90210  ' }],
          'General',
          ['addressInfo'],
          true,
          wsId,
          destId,
        );
        const addressInfo = (result[0] as { identifiers: Record<string, unknown>[] }).identifiers[0]
          .addressInfo as Record<string, unknown>;
        expect(addressInfo.postalCode).toEqual('90210');
      });
    });
  });

  describe('populateIdentifiersForRecordEvent', () => {
    const wsId = 'test-workspace-id';
    const destId = 'test-destination-id';

    const HASHED_EMAIL = 'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419';
    const HASHED_PHONE = '8846dcb6ab2d73a0e67dbd569fa17cec2d9d391e5b05d1dd42919bc21ae82c45';

    beforeEach(() => {
      delete process.env.GOOGLE_ADWORDS_REMARKETING_LISTS_REJECT_INVALID_FIELDS;
      jest.spyOn(stats, 'increment').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return empty array for empty identifiers array', () => {
      expect(
        populateIdentifiersForRecordEvent([], 'General', ['email'], true, wsId, destId),
      ).toEqual([]);
    });

    describe('valid inputs — correct hashing and field mapping (isHashRequired=true)', () => {
      it.each([
        {
          description: 'valid email → hashedEmail',
          identifiers: [{ email: 'test@example.com' }],
          userSchema: ['email'],
          expected: [{ identifiers: [{ hashedEmail: sha256('test@example.com') }] }],
        },
        {
          description: 'valid phone with + → hashedPhoneNumber',
          identifiers: [{ phone: '+19876543210' }],
          userSchema: ['phone'],
          expected: [{ identifiers: [{ hashedPhoneNumber: sha256('+19876543210') }] }],
        },
        {
          description: 'valid phone without + → normalized to +19876543210 → hashedPhoneNumber',
          identifiers: [{ phone: '19876543210' }],
          userSchema: ['phone'],
          expected: [{ identifiers: [{ hashedPhoneNumber: sha256('+19876543210') }] }],
        },
        {
          description: 'full addressInfo with 2-letter country',
          identifiers: [{ firstName: 'John', lastName: 'Doe', country: 'US', postalCode: '12345' }],
          userSchema: ['addressInfo'],
          expected: [
            {
              identifiers: [
                {
                  addressInfo: {
                    hashedFirstName: sha256('john'),
                    hashedLastName: sha256('doe'),
                    countryCode: 'US',
                    postalCode: '12345',
                  },
                },
              ],
            },
          ],
        },
        {
          description: 'addressInfo with 3-letter country code',
          identifiers: [{ firstName: 'John', country: 'USA' }],
          userSchema: ['addressInfo'],
          expected: [
            {
              identifiers: [
                { addressInfo: { hashedFirstName: sha256('john'), countryCode: 'USA' } },
              ],
            },
          ],
        },
        {
          description: 'email and phone together',
          identifiers: [{ email: 'test@example.com', phone: '+19876543210' }],
          userSchema: ['email', 'phone'],
          expected: [
            {
              identifiers: [
                { hashedEmail: sha256('test@example.com') },
                { hashedPhoneNumber: sha256('+19876543210') },
              ],
            },
          ],
        },
      ])('$description', ({ identifiers, userSchema, expected }) => {
        const result = populateIdentifiersForRecordEvent(
          identifiers,
          'General',
          userSchema,
          true,
          wsId,
          destId,
        );
        expect(result).toEqual(expected);
      });
    });

    describe('pre-hashed values pass through unchanged (isHashRequired=false)', () => {
      it.each([
        {
          description: 'pre-hashed email',
          identifiers: [{ email: HASHED_EMAIL }],
          userSchema: ['email'],
          expected: [{ identifiers: [{ hashedEmail: HASHED_EMAIL }] }],
        },
        {
          description: 'pre-hashed phone',
          identifiers: [{ phone: HASHED_PHONE }],
          userSchema: ['phone'],
          expected: [{ identifiers: [{ hashedPhoneNumber: HASHED_PHONE }] }],
        },
        {
          description: 'pre-hashed email and phone together',
          identifiers: [{ email: HASHED_EMAIL, phone: HASHED_PHONE }],
          userSchema: ['email', 'phone'],
          expected: [
            { identifiers: [{ hashedEmail: HASHED_EMAIL }, { hashedPhoneNumber: HASHED_PHONE }] },
          ],
        },
      ])('$description', ({ identifiers, userSchema, expected }) => {
        const result = populateIdentifiersForRecordEvent(
          identifiers,
          'General',
          userSchema,
          false,
          wsId,
          destId,
        );
        expect(result).toEqual(expected);
      });
    });

    describe('invalid fields stripped when GOOGLE_ADWORDS_REMARKETING_LISTS_REJECT_INVALID_FIELDS=true (isValidGARLField cases)', () => {
      beforeEach(() => {
        process.env.GOOGLE_ADWORDS_REMARKETING_LISTS_REJECT_INVALID_FIELDS = 'true';
      });

      it.each([
        {
          description: 'invalid email format',
          identifiers: [{ email: 'not-an-email' }],
          userSchema: ['email'],
          isHashRequired: true,
          expected: [{ error: expect.any(Error) }],
        },
        {
          description: 'phone with @ character',
          identifiers: [{ phone: '@09876543210' }],
          userSchema: ['phone'],
          isHashRequired: true,
          expected: [{ error: expect.any(Error) }],
        },
        {
          description: 'whitespace-only firstName stripped, rest of addressInfo kept',
          identifiers: [{ firstName: '', lastName: 'Doe', country: 'US', postalCode: '12345' }],
          userSchema: ['addressInfo'],
          isHashRequired: true,
          expected: [
            {
              identifiers: [
                {
                  addressInfo: {
                    hashedLastName: sha256('doe'),
                    countryCode: 'US',
                    postalCode: '12345',
                  },
                },
              ],
            },
          ],
        },
        {
          description: 'country code longer than 3 letters',
          identifiers: [{ firstName: 'John', country: 'INVALID', postalCode: '12345' }],
          userSchema: ['addressInfo'],
          isHashRequired: true,
          expected: [
            {
              identifiers: [
                { addressInfo: { hashedFirstName: sha256('john'), postalCode: '12345' } },
              ],
            },
          ],
        },
        {
          description: 'country code containing digits',
          identifiers: [{ country: 'U1', postalCode: '12345' }],
          userSchema: ['addressInfo'],
          isHashRequired: true,
          expected: [{ identifiers: [{ addressInfo: { postalCode: '12345' } }] }],
        },
        {
          description: 'unhashed email when isHashRequired=false passes through unchanged',
          identifiers: [{ email: 'test@example.com' }],
          userSchema: ['email'],
          isHashRequired: false,
          expected: [{ identifiers: [{ hashedEmail: 'test@example.com' }] }],
        },
      ])('$description', ({ identifiers, userSchema, isHashRequired, expected }) => {
        const result = populateIdentifiersForRecordEvent(
          identifiers,
          'General',
          userSchema,
          isHashRequired,
          wsId,
          destId,
        );
        expect(result).toEqual(expected);
      });
    });

    describe('invalid fields pass through when GOOGLE_ADWORDS_REMARKETING_LISTS_REJECT_INVALID_FIELDS=false (default)', () => {
      it.each([
        {
          description: 'invalid email → hashed and passed through',
          identifiers: [{ email: 'not-an-email' }],
          userSchema: ['email'],
          isHashRequired: true,
          expected: [{ identifiers: [{ hashedEmail: sha256('not-an-email') }] }],
        },
        {
          description:
            'invalid phone → normalized (@ preserved, + added) → hashed and passed through',
          identifiers: [{ phone: '@09876543210' }],
          userSchema: ['phone'],
          isHashRequired: true,
          expected: [{ identifiers: [{ hashedPhoneNumber: sha256('+@09876543210') }] }],
        },
        {
          description: 'unhashed email when isHashRequired=false → passed through as-is',
          identifiers: [{ email: 'test@example.com' }],
          userSchema: ['email'],
          isHashRequired: false,
          expected: [{ identifiers: [{ hashedEmail: 'test@example.com' }] }],
        },
      ])('$description', ({ identifiers, userSchema, isHashRequired, expected }) => {
        const result = populateIdentifiersForRecordEvent(
          identifiers,
          'General',
          userSchema,
          isHashRequired,
          wsId,
          destId,
        );
        expect(result).toEqual(expected);
      });
    });

    describe('google_adwords_remarketing_lists_invalid_field metric (processAudienceRecord)', () => {
      it.each([
        {
          description: 'invalid email format',
          identifiers: [{ email: 'not-an-email' }],
          userSchema: ['email'],
          isHashRequired: true,
          invalidFieldName: 'email',
        },
        {
          description: 'phone with @ character',
          identifiers: [{ phone: '@invalid' }],
          userSchema: ['phone'],
          isHashRequired: true,
          invalidFieldName: 'phone',
        },
        {
          description: 'invalid country code',
          identifiers: [{ country: 'INVALID' }],
          userSchema: ['addressInfo'],
          isHashRequired: true,
          invalidFieldName: 'country',
        },
      ])(
        'emits metric for $description',
        ({ identifiers, userSchema, isHashRequired, invalidFieldName }) => {
          populateIdentifiersForRecordEvent(
            identifiers,
            'General',
            userSchema,
            isHashRequired,
            wsId,
            destId,
          );
          expect(stats.increment).toHaveBeenCalledWith(
            'google_adwords_remarketing_lists_invalid_field',
            {
              fieldName: invalidFieldName,
              workspaceId: wsId,
              destinationId: destId,
            },
          );
        },
      );

      it('does not emit metric for valid fields', () => {
        const identifiers = [{ email: 'test@example.com' }];
        populateIdentifiersForRecordEvent(identifiers, 'General', ['email'], true, wsId, destId);
        expect(stats.increment).not.toHaveBeenCalledWith(
          'google_adwords_remarketing_lists_invalid_field',
          expect.anything(),
        );
      });

      it('does not emit metric for unknown fields (no fieldConfig → always valid)', () => {
        process.env.GOOGLE_ADWORDS_REMARKETING_LISTS_REJECT_INVALID_FIELDS = 'true';
        const identifiers = [{ email: 'test@example.com', customField: 'any-value' }];
        populateIdentifiersForRecordEvent(identifiers, 'General', ['email'], true, wsId, destId);
        expect(stats.increment).not.toHaveBeenCalledWith(
          'google_adwords_remarketing_lists_invalid_field',
          expect.objectContaining({ fieldName: 'customField' }),
        );
      });
    });
  });
});
