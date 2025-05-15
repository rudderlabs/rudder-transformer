const sha256 = require('sha256');
const {
  getClickConversionPayloadAndEndpoint,
  buildAndGetAddress,
  getExisitingUserIdentifier,
  getConsentsDataFromIntegrationObj,
  getCallConversionPayload,
  getAddConversionPayload,
} = require('./utils');

const API_VERSION = 'v18';

const getTestMessage = () => {
  let message = {
    event: 'testEventName',
    anonymousId: 'anonId',
    traits: {
      email: 'abc@test.com',
      firstname: 'rudder',
      lastname: 'stack',
      phone: 'dummy phone',
      address: {
        city: 'kolkata',
        country: 'India',
        state: 'WB',
        street: 'T.N.G Road',
      },
      createdAt: '2014-05-21T15:54:20Z',
      timestamp: '2014-05-21T15:54:20Z',
    },
    properties: {
      category: 'test',
      email: 'test@test.com',
      templateId: 1234,
      campaignId: 5678,
      name: 'pageName',
      countryCode: 'IN',
      zipCode: '700114',
      conversionDateTime: '2022-01-01 12:32:45-08:00',
    },
    context: {
      device: {
        token: 1234,
      },
      os: {
        token: 5678,
      },
      mappedToDestination: false,
      externalId: [
        {
          id: '12345',
          identifierType: 'test_identifier',
        },
      ],
    },
  };
  return message;
};

let userIdentifierInfo = {
  email: 'testEmail',
  phone: 'testPhone',
  address: {
    city: 'kolkata',
    country_code: 'IN',
    hashed_first_name: '37d80f43f43cd48f2e363a2d1f2aee343d7ba0a12a6227ee17b4ef3ede78c204',
    hashed_last_name: '6ee08e6eb3bc6f45bc99fcd39fcc479286a1beb0c04d39f204c61762378075d6',
    postal_code: '700114',
  },
};

let config = {
  customerId: '962-581-2972',
  subAccount: false,
  eventsToOfflineConversionsTypeMapping: [
    {
      from: 'Sign up completed',
      to: 'click',
    },
    {
      from: 'Download',
      to: 'call',
    },
    {
      from: 'Promotion Clicked',
      to: 'click',
    },
    {
      from: 'Product Searched',
      to: 'call',
    },
  ],
  eventsToConversionsNamesMapping: [
    {
      from: 'Sign up completed',
      to: 'Sign-up - click',
    },
    {
      from: 'Download',
      to: 'Page view',
    },
    {
      from: 'Promotion Clicked',
      to: 'Sign-up - click',
    },
    {
      from: 'Product Searched',
      to: 'search',
    },
  ],
  customVariables: [
    {
      from: 'value',
      to: 'revenue',
    },
    {
      from: 'total',
      to: 'cost',
    },
  ],
  UserIdentifierSource: 'THIRD_PARTY',
  conversionEnvironment: 'WEB',
  hashUserIdentifier: true,
  defaultUserIdentifier: 'email',
  validateOnly: false,
  rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
};

describe('buildAndGetAddress util tests', () => {
  it('hashUserIdentifier as true', () => {
    let expectedOutput = {
      city: 'kolkata',
      country_code: 'IN',
      hashed_first_name: '37d80f43f43cd48f2e363a2d1f2aee343d7ba0a12a6227ee17b4ef3ede78c204',
      hashed_last_name: '6ee08e6eb3bc6f45bc99fcd39fcc479286a1beb0c04d39f204c61762378075d6',
      postal_code: '700114',
    };
    expect(buildAndGetAddress(getTestMessage(), true)).toEqual(expectedOutput);
  });
  it('hashUserIdentifier as false', () => {
    let expectedOutput = {
      city: 'kolkata',
      country_code: 'IN',
      hashed_first_name: 'rudder',
      hashed_last_name: 'stack',
      postal_code: '700114',
    };
    expect(buildAndGetAddress(getTestMessage(), false)).toEqual(expectedOutput);
  });
});

describe('getExisitingUserIdentifier util tests', () => {
  it('getExisitingUserIdentifier when default identifier is email and phone is present', () => {
    expect(getExisitingUserIdentifier(userIdentifierInfo, 'email')).toEqual('phone');
  });

  it('getExisitingUserIdentifier when default identifier is email and phone is absent', () => {
    let fittingPayload = { ...userIdentifierInfo };
    fittingPayload.phone = undefined;
    expect(getExisitingUserIdentifier(fittingPayload, 'email')).toEqual('address');
  });
  it('getExisitingUserIdentifier when default identifier is phone', () => {
    expect(getExisitingUserIdentifier(userIdentifierInfo, 'phone')).toEqual('email');
  });
});

describe('getClickConversionPayloadAndEndpoint util tests', () => {
  it('getClickConversionPayloadAndEndpoint flow check when default field identifier is present', () => {
    let expectedOutput = {
      endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/9625812972:uploadClickConversions`,
      payload: {
        conversions: [
          {
            conversionDateTime: '2022-01-01 12:32:45-08:00',
            conversionEnvironment: 'WEB',
            consent: {
              adPersonalization: 'UNSPECIFIED',
              adUserData: 'UNSPECIFIED',
            },
            userIdentifiers: [
              {
                hashedEmail: 'fa922cb41ff930664d4c9ced3c472ce7ecf29a0f8248b7018456e990177fff75',
                userIdentifierSource: 'THIRD_PARTY',
              },
            ],
          },
        ],
      },
    };
    expect(getClickConversionPayloadAndEndpoint(getTestMessage(), config, '9625812972')).toEqual(
      expectedOutput,
    );
  });

  it('getClickConversionPayloadAndEndpoint flow check when default field identifier is absent', () => {
    let fittingPayload = { ...getTestMessage() };
    delete fittingPayload.traits.email;
    delete fittingPayload.properties.email;
    let expectedOutput = {
      endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/9625812972:uploadClickConversions`,
      payload: {
        conversions: [
          {
            conversionDateTime: '2022-01-01 12:32:45-08:00',
            consent: {
              adPersonalization: 'UNSPECIFIED',
              adUserData: 'UNSPECIFIED',
            },
            conversionEnvironment: 'WEB',
            userIdentifiers: [
              {
                hashedPhoneNumber:
                  '2e0da1dbea5e4dc3ef73fde4de9329dd19f9030b384c169ff776002f45fd9a32',
                userIdentifierSource: 'THIRD_PARTY',
              },
            ],
          },
        ],
      },
    };
    expect(getClickConversionPayloadAndEndpoint(fittingPayload, config, '9625812972')).toEqual(
      expectedOutput,
    );
  });

  it('getClickConversionPayloadAndEndpoint flow check when both email and phone are absent', () => {
    let fittingPayload = { ...getTestMessage() };
    delete fittingPayload.traits.email;
    delete fittingPayload.traits.phone;
    delete fittingPayload.properties.email;

    expect(() =>
      getClickConversionPayloadAndEndpoint(fittingPayload, config, '9625812972'),
    ).toThrow(
      'Either an email address or a phone number is required for user identification when none of gclid, wbraid, or gbraid is provided.',
    );
  });

  it('finaliseConsent', () => {
    let fittingPayload = { ...getTestMessage() };
    fittingPayload.properties.products = [
      {
        product_id: 1234,
        sku: 'abcd',
        name: 'no product array present',
        category: 'categoryTest1, categoryTest2',
        price: '10',
        quantity: '2',
        total: '20',
      },
    ];
    let expectedOutput = {
      endpoint: `https://googleads.googleapis.com/${API_VERSION}/customers/9625812972:uploadClickConversions`,
      payload: {
        conversions: [
          {
            cartData: { items: [{ productId: 1234, quantity: 2, unitPrice: 10 }] },
            conversionDateTime: '2022-01-01 12:32:45-08:00',
            conversionEnvironment: 'WEB',
            consent: {
              adPersonalization: 'UNSPECIFIED',
              adUserData: 'UNSPECIFIED',
            },
            userIdentifiers: [
              {
                hashedEmail: 'fa922cb41ff930664d4c9ced3c472ce7ecf29a0f8248b7018456e990177fff75',
                userIdentifierSource: 'THIRD_PARTY',
              },
            ],
          },
        ],
      },
    };
    expect(getClickConversionPayloadAndEndpoint(fittingPayload, config, '9625812972')).toEqual(
      expectedOutput,
    );
  });
});

describe('getConsentsDataFromIntegrationObj', () => {
  it('should return an empty object when conversionType is "store"', () => {
    const message = {};
    const result = getConsentsDataFromIntegrationObj(message);
    expect(result).toEqual({});
  });
  it('should return the consent object when conversion type is call', () => {
    const message = {
      integrations: {
        GOOGLE_ADWORDS_OFFLINE_CONVERSIONS: {
          consents: {
            adUserData: 'GRANTED',
            adPersonalization: 'DENIED',
          },
        },
      },
    };
    const conversionType = 'call';
    const result = getConsentsDataFromIntegrationObj(message, conversionType);
    expect(result).toEqual({
      adPersonalization: 'DENIED',
      adUserData: 'GRANTED',
    });
  });
});

describe('getCallConversionPayload', () => {
  it('should call conversion payload with consent object and set default consent for adUserData', () => {
    const message = {
      properties: {
        callerId: '1234',
        callStartDateTime: '2022-01-01 12:32:45-08:00',
        conversionDateTime: '2022-01-01 12:32:45-08:00',
      },
    };
    const result = getCallConversionPayload(message, {
      adPersonalization: 'GRANTED',
    });
    expect(result).toEqual({
      conversions: [
        {
          callStartDateTime: '2022-01-01 12:32:45-08:00',
          callerId: '1234',
          consent: {
            adPersonalization: 'GRANTED',
            adUserData: 'UNSPECIFIED',
          },
          conversionDateTime: '2022-01-01 12:32:45-08:00',
        },
      ],
    });
  });
  it('should call conversion payload with consent object', () => {
    const message = {
      properties: {
        callerId: '1234',
        callStartDateTime: '2022-01-01 12:32:45-08:00',
        conversionDateTime: '2022-01-01 12:32:45-08:00',
      },
    };
    const result = getCallConversionPayload(message, {
      adUserData: 'GRANTED',
      adPersonalization: 'DENIED',
    });
    expect(result).toEqual({
      conversions: [
        {
          callStartDateTime: '2022-01-01 12:32:45-08:00',
          callerId: '1234',
          consent: {
            adPersonalization: 'DENIED',
            adUserData: 'GRANTED',
          },
          conversionDateTime: '2022-01-01 12:32:45-08:00',
        },
      ],
    });
  });
  it('should call conversion payload with consent object even if no consent input from UI as well as event level', () => {
    const message = {
      properties: {
        callerId: '1234',
        callStartDateTime: '2022-01-01 12:32:45-08:00',
        conversionDateTime: '2022-01-01 12:32:45-08:00',
      },
    };
    const result = getCallConversionPayload(message, {}, {});
    expect(result).toEqual({
      conversions: [
        {
          callStartDateTime: '2022-01-01 12:32:45-08:00',
          callerId: '1234',
          consent: {
            adPersonalization: 'UNSPECIFIED',
            adUserData: 'UNSPECIFIED',
          },
          conversionDateTime: '2022-01-01 12:32:45-08:00',
        },
      ],
    });
  });
});

describe('getAddConversionPayload', () => {
  // Helper function to create a valid message with required fields
  const createValidMessage = (overrides = {}) => {
    return {
      event: 'testEvent',
      timestamp: '2022-01-01T12:32:45Z',
      properties: {
        revenue: 100, // Required field
        currency: 'USD', // Required field
        ...(overrides.properties || {}),
      },
      traits: {
        email: 'test@example.com',
        phone: '+1234567890',
        ...(overrides.traits || {}),
      },
    };
  };

  it('should create add conversion payload with default config', () => {
    const message = createValidMessage();

    const config = {
      validateOnly: false,
      hashUserIdentifier: true,
      defaultUserIdentifier: 'email',
    };

    const result = getAddConversionPayload(message, config, {});

    expect(result.enable_partial_failure).toBe(false);
    expect(result.enable_warnings).toBe(false);
    expect(result.validate_only).toBe(false);
    expect(result.operations.create.transaction_attribute.transaction_date_time).toBeDefined();
    expect(result.operations.create.userIdentifiers[0].hashedEmail).toBeDefined();
    expect(result.operations.create.consent).toBeDefined();
  });

  it('should hash email when hashUserIdentifier is true and email is a string', () => {
    const message = createValidMessage();

    const config = {
      validateOnly: false,
      hashUserIdentifier: true,
      defaultUserIdentifier: 'email',
    };

    const result = getAddConversionPayload(message, config, {});

    // Email should be hashed
    expect(result.operations.create.userIdentifiers[0].hashedEmail).not.toBe('test@example.com');
    expect(result.operations.create.userIdentifiers[0].hashedEmail).toBe(
      sha256('test@example.com').toString(),
    );
  });

  it('should not hash email when hashUserIdentifier is false', () => {
    const message = createValidMessage();

    const config = {
      validateOnly: false,
      hashUserIdentifier: false,
      defaultUserIdentifier: 'email',
    };

    const result = getAddConversionPayload(message, config, {});

    // Email should not be hashed
    expect(result.operations.create.userIdentifiers[0].hashedEmail).toBe('test@example.com');
  });

  it('should hash phone when hashUserIdentifier is true and phone is a string', () => {
    const message = createValidMessage({
      traits: { email: undefined, phone: '+1234567890' },
    });

    const config = {
      validateOnly: false,
      hashUserIdentifier: true,
      defaultUserIdentifier: 'phone',
    };

    const result = getAddConversionPayload(message, config, {});

    // Phone should be hashed
    expect(result.operations.create.userIdentifiers[0].hashedPhoneNumber).not.toBe('+1234567890');
    expect(result.operations.create.userIdentifiers[0].hashedPhoneNumber).toBe(
      sha256('+1234567890').toString(),
    );
  });

  it('should use alternative identifier when default identifier is not available', () => {
    const message = createValidMessage({
      traits: { email: undefined, phone: '+1234567890' },
    });

    const config = {
      validateOnly: false,
      hashUserIdentifier: true,
      defaultUserIdentifier: 'email', // Email is not available in the message
    };

    const result = getAddConversionPayload(message, config, {});

    // Should use phone as alternative
    expect(result.operations.create.userIdentifiers[0].hashedEmail).toBeUndefined();
    expect(result.operations.create.userIdentifiers[0].hashedPhoneNumber).toBeDefined();
  });

  it('should handle empty userIdentifiers when no identifiers are available', () => {
    const message = createValidMessage({
      traits: { email: {}, phone: {} },
    });

    const config = {
      validateOnly: false,
      hashUserIdentifier: true,
      defaultUserIdentifier: 'email',
    };

    const result = getAddConversionPayload(message, config, {});

    // Should have empty userIdentifiers
    expect(result.operations.create.userIdentifiers[0]).toEqual({
      hashedEmail: {},
    });
  });

  it('should convert transaction amount to micros', () => {
    const message = createValidMessage({
      properties: { revenue: 100 },
    });

    const config = {
      validateOnly: false,
      hashUserIdentifier: true,
      defaultUserIdentifier: 'email',
    };

    const result = getAddConversionPayload(message, config, {});

    // Should convert to micros (100 * 1000000)
    expect(result.operations.create.transaction_attribute.transaction_amount_micros).toBe(
      '100000000',
    );
  });

  it('should set consent object from eventLevelConsentsData', () => {
    const message = createValidMessage();

    const config = {
      validateOnly: false,
      hashUserIdentifier: true,
      defaultUserIdentifier: 'email',
    };

    const eventLevelConsentsData = {
      adUserData: 'GRANTED',
      adPersonalization: 'DENIED',
    };

    const result = getAddConversionPayload(message, config, eventLevelConsentsData);

    // Should set consent from eventLevelConsentsData
    expect(result.operations.create.consent).toEqual({
      adUserData: 'GRANTED',
      adPersonalization: 'DENIED',
    });
  });
});
