const {
  getClickConversionPayloadAndEndpoint,
  buildAndGetAddress,
  getExisitingUserIdentifier,
} = require('./utils');

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
      endpoint: 'https://googleads.googleapis.com/v14/customers/9625812972:uploadClickConversions',
      payload: {
        conversions: [
          {
            conversionDateTime: '2022-01-01 12:32:45-08:00',
            conversionEnvironment: 'WEB',
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
      endpoint: 'https://googleads.googleapis.com/v14/customers/9625812972:uploadClickConversions',
      payload: {
        conversions: [
          {
            conversionDateTime: '2022-01-01 12:32:45-08:00',
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
    let expectedOutput = {
      endpoint: 'https://googleads.googleapis.com/v14/customers/9625812972:uploadClickConversions',
      payload: {
        conversions: [
          {
            conversionDateTime: '2022-01-01 12:32:45-08:00',
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
    expect(() =>
      getClickConversionPayloadAndEndpoint(fittingPayload, config, '9625812972'),
    ).toThrow('Either of email or phone is required for user identifier');
  });

  it('getClickConversionPayloadAndEndpoint flow check when default field identifier is present and product list present', () => {
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
      endpoint: 'https://googleads.googleapis.com/v14/customers/9625812972:uploadClickConversions',
      payload: {
        conversions: [
          {
            cartData: { items: [{ productId: 1234, quantity: 2, unitPrice: 10 }] },
            conversionDateTime: '2022-01-01 12:32:45-08:00',
            conversionEnvironment: 'WEB',
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
