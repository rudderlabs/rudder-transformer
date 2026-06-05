import {
  buildMemberConsentFromConfig,
  buildAudienceMemberFromProcessedFields,
  isDataManagerAccount,
} from './util';
import { DM_ACCOUNT_DEFINITION_NAME } from './config';
import type { Consent, AudienceMember, GARLDestination } from './types';

const LEGACY_ACCOUNT_DEFINITION_NAME = 'DESTINATION_GOOGLE_ADWORDS_REMARKETING_LISTS_OAUTH';

const buildDestination = (accountDefinitionName?: string): GARLDestination =>
  ({
    deliveryAccount:
      accountDefinitionName === undefined ? undefined : ({ accountDefinitionName } as never),
  }) as unknown as GARLDestination;

describe('isDataManagerAccount', () => {
  const testCases: {
    description: string;
    destination?: GARLDestination;
    expected: boolean;
  }[] = [
    {
      description: 'DM account definition name → true',
      destination: buildDestination(DM_ACCOUNT_DEFINITION_NAME),
      expected: true,
    },
    {
      description: 'legacy account definition name → false',
      destination: buildDestination(LEGACY_ACCOUNT_DEFINITION_NAME),
      expected: false,
    },
    {
      description: 'undefined account definition name → false',
      destination: buildDestination(undefined),
      expected: false,
    },
    {
      description: 'missing destination → false',
      destination: undefined,
      expected: false,
    },
  ];

  it.each(testCases)('$description', ({ destination, expected }) => {
    expect(isDataManagerAccount(destination)).toBe(expected);
  });
});

describe('buildMemberConsentFromConfig', () => {
  const testCases: {
    description: string;
    input: Record<string, unknown>;
    expected: Consent;
  }[] = [
    {
      description: 'no consent fields → both CONSENT_STATUS_UNSPECIFIED',
      input: {
        rudderAccountId: '258Yea7usSKNpbkIaesL9oJ9iYw',
        audienceId: '7090784486',
        customerId: '7693729833',
        isHashRequired: true,
        typeOfList: 'General',
      },
      expected: {
        adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
        adUserData: 'CONSENT_STATUS_UNSPECIFIED',
      },
    },
    {
      description: 'both GRANTED → both CONSENT_GRANTED',
      input: {
        personalizationConsent: 'GRANTED',
        userDataConsent: 'GRANTED',
      },
      expected: {
        adPersonalization: 'CONSENT_GRANTED',
        adUserData: 'CONSENT_GRANTED',
      },
    },
    {
      description: 'both DENIED → both CONSENT_DENIED',
      input: {
        personalizationConsent: 'DENIED',
        userDataConsent: 'DENIED',
      },
      expected: {
        adPersonalization: 'CONSENT_DENIED',
        adUserData: 'CONSENT_DENIED',
      },
    },
    {
      description: 'personalizationConsent GRANTED, userDataConsent DENIED → mixed',
      input: {
        personalizationConsent: 'GRANTED',
        userDataConsent: 'DENIED',
      },
      expected: {
        adPersonalization: 'CONSENT_GRANTED',
        adUserData: 'CONSENT_DENIED',
      },
    },
    {
      description: 'personalizationConsent DENIED, userDataConsent GRANTED → mixed',
      input: {
        personalizationConsent: 'DENIED',
        userDataConsent: 'GRANTED',
      },
      expected: {
        adPersonalization: 'CONSENT_DENIED',
        adUserData: 'CONSENT_GRANTED',
      },
    },
    {
      description:
        'invalid value for personalizationConsent → maps to UNKNOWN → CONSENT_STATUS_UNSPECIFIED',
      input: {
        personalizationConsent: 'INVALID_VALUE',
        userDataConsent: 'GRANTED',
      },
      expected: {
        adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
        adUserData: 'CONSENT_GRANTED',
      },
    },
    {
      description: 'explicit UNSPECIFIED value → CONSENT_STATUS_UNSPECIFIED',
      input: {
        personalizationConsent: 'UNSPECIFIED',
        userDataConsent: 'UNSPECIFIED',
      },
      expected: {
        adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
        adUserData: 'CONSENT_STATUS_UNSPECIFIED',
      },
    },
    {
      description: 'only personalizationConsent set (GRANTED), userDataConsent absent',
      input: {
        personalizationConsent: 'GRANTED',
      },
      expected: {
        adPersonalization: 'CONSENT_GRANTED',
        adUserData: 'CONSENT_STATUS_UNSPECIFIED',
      },
    },
    {
      description: 'only userDataConsent set (GRANTED), personalizationConsent absent',
      input: {
        userDataConsent: 'GRANTED',
      },
      expected: {
        adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
        adUserData: 'CONSENT_GRANTED',
      },
    },
    {
      description: 'empty config → both CONSENT_STATUS_UNSPECIFIED',
      input: {},
      expected: {
        adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
        adUserData: 'CONSENT_STATUS_UNSPECIFIED',
      },
    },
  ];

  it.each(testCases)('$description', ({ input, expected }) => {
    expect(buildMemberConsentFromConfig(input as never)).toEqual(expected);
  });
});

describe('filterFieldsBySchema (via buildAudienceMemberFromProcessedFields)', () => {
  // All fields pre-processed (already hashed / normalized)
  const allFields = {
    email: 'hashed_email',
    phone: 'hashed_phone',
    firstName: 'John',
    lastName: 'Doe',
    country: 'US',
    postalCode: '12345',
  };

  const fullAddress = {
    givenName: 'John',
    familyName: 'Doe',
    regionCode: 'US',
    postalCode: '12345',
  };

  const testCases: {
    description: string;
    fields: Record<string, unknown>;
    userSchema: string[] | undefined;
    expected: AudienceMember | null;
  }[] = [
    {
      description: 'userSchema undefined → no filtering, all identifiers produced',
      fields: allFields,
      userSchema: undefined,
      expected: {
        userData: {
          userIdentifiers: [
            { emailAddress: 'hashed_email' },
            { phoneNumber: 'hashed_phone' },
            { addressInfo: fullAddress },
          ],
        },
      },
    },
    {
      description: "userSchema ['email', 'phone', 'addressInfo'] → all identifiers",
      fields: allFields,
      userSchema: ['email', 'phone', 'addressInfo'],
      expected: {
        userData: {
          userIdentifiers: [
            { emailAddress: 'hashed_email' },
            { phoneNumber: 'hashed_phone' },
            { addressInfo: fullAddress },
          ],
        },
      },
    },
    {
      description: "userSchema ['email'] → only email identifier",
      fields: allFields,
      userSchema: ['email'],
      expected: { userData: { userIdentifiers: [{ emailAddress: 'hashed_email' }] } },
    },
    {
      description: "userSchema ['phone'] → only phone identifier",
      fields: allFields,
      userSchema: ['phone'],
      expected: { userData: { userIdentifiers: [{ phoneNumber: 'hashed_phone' }] } },
    },
    {
      description: "userSchema ['addressInfo'] → only address identifier",
      fields: allFields,
      userSchema: ['addressInfo'],
      expected: { userData: { userIdentifiers: [{ addressInfo: fullAddress }] } },
    },
    {
      description: "userSchema ['email', 'phone'] → email and phone, no address",
      fields: allFields,
      userSchema: ['email', 'phone'],
      expected: {
        userData: {
          userIdentifiers: [{ emailAddress: 'hashed_email' }, { phoneNumber: 'hashed_phone' }],
        },
      },
    },
    {
      description: "userSchema ['email', 'addressInfo'] → email and address identifier",
      fields: allFields,
      userSchema: ['email', 'addressInfo'],
      expected: {
        userData: {
          userIdentifiers: [{ emailAddress: 'hashed_email' }, { addressInfo: fullAddress }],
        },
      },
    },
    {
      description:
        "individual address field in userSchema (e.g. ['firstName']) triggers needsAddress → all address fields included, email/phone excluded",
      fields: allFields,
      userSchema: ['firstName'],
      expected: { userData: { userIdentifiers: [{ addressInfo: fullAddress }] } },
    },
    {
      description: 'empty userSchema → all fields filtered out → null',
      fields: allFields,
      userSchema: [],
      expected: null,
    },
    {
      description:
        'partial address fields with addressInfo in schema → addressInfo skipped (requires all 4 fields)',
      fields: { email: 'hashed_email', firstName: 'John' },
      userSchema: ['email', 'addressInfo'],
      expected: { userData: { userIdentifiers: [{ emailAddress: 'hashed_email' }] } },
    },
  ];

  it.each(testCases)('$description', ({ fields, userSchema, expected }) => {
    expect(buildAudienceMemberFromProcessedFields(fields, 'General', userSchema)).toEqual(expected);
  });
});
