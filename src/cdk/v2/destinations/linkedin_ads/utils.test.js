const crypto = require('crypto');
const {
  formatEmail,
  calculateConversionObject,
  fetchUserIds,
  curateUserInfoObject,
  deduceConversionRules,
  generateHeader,
  constructPartialStatus,
  createResponseArray,
  checkIfPricePresent,
} = require('./utils');
const {
  InstrumentationError,
  ConfigurationError,
  generateRandomString,
} = require('@rudderstack/integrations-lib');
const { API_HEADER_METHOD, API_PROTOCOL_VERSION, API_VERSION } = require('./config');

describe('formatEmail', () => {
  // Returns a hashed email when a valid email is passed as argument.
  it('should return a hashed email when a valid email is passed as argument', () => {
    const email = 'test@example.com';
    const hashedEmail = crypto.createHash('sha256').update(email).digest('hex');
    expect(formatEmail(email, { hashData: true })).toEqual(hashedEmail);
  });

  // Returns null when an empty string is passed as argument.
  it('should return null when an empty string is passed as argument', () => {
    const email = '';
    expect(formatEmail(email)).toBeNull();
  });
});

describe('calculateConversionObject', () => {
  // Returns empty object when message properties are empty
  it('should return empty object when message properties are empty', () => {
    const message = { properties: {} };
    expect(() => {
      const conversionObject = calculateConversionObject(message);
      expect(conversionObject).toEqual({});
    });
  });

  // Returns a conversion object with currency code 'USD' and amount 0 when message properties price is defined but quantity is 0
  it('should return a conversion object with currency code "USD" and amount 0 when message properties price is defined but quantity is 0', () => {
    const message = { properties: { price: 10, quantity: 0 } };
    const conversionObject = calculateConversionObject(message);
    expect(conversionObject).toEqual({ currencyCode: 'USD', amount: '0' });
  });
});

describe('fetchUserIds', () => {
  // Throws an InstrumentationError when no user id is found in the message and no exception is caught
  it('should throw an InstrumentationError when no user id is found in the message and no exception is caught', () => {
    const message = {};
    const destConfig = {
      hashData: true,
    };
    expect(() => {
      fetchUserIds(message, destConfig);
    }).toThrow(InstrumentationError);
  });
  it('should create user Ids array of objects with all allowed values', () => {
    const message = {
      context: {
        traits: {
          email: 'abc@gmail.com',
        },
        externalId: [
          {
            type: 'LINKEDIN_FIRST_PARTY_ADS_TRACKING_UUID',
            id: 'abcdefg',
          },
          {
            type: 'ACXIOM_ID',
            id: '123456',
          },
          {
            type: 'ORACLE_MOAT_ID',
            id: '789012',
          },
        ],
      },
    };
    const destConfig = {
      hashData: true,
    };
    const userIdArray = fetchUserIds(message, destConfig);
    expect(userIdArray).toEqual([
      {
        idType: 'SHA256_EMAIL',
        idValue: '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
      },
      {
        idType: 'LINKEDIN_FIRST_PARTY_ADS_TRACKING_UUID',
        idValue: 'abcdefg',
      },
      {
        idType: 'ACXIOM_ID',
        idValue: '123456',
      },
      {
        idType: 'ORACLE_MOAT_ID',
        idValue: '789012',
      },
    ]);
  });
});

describe('curateUserInfoObject', () => {
  // Returns a non-null object when given a message with both first and last name
  it('should return a non-null object when given a message with both first and last name and other properties', () => {
    const message = {
      context: {
        traits: {
          firstName: 'John',
          lastName: 'Doe',
          title: 'Mr.',
          companyName: 'RudderTest',
          countryCode: 'USA',
        },
      },
    };
    const result = curateUserInfoObject(message);
    expect(result).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      title: 'Mr.',
      companyName: 'RudderTest',
      countryCode: 'USA',
    });
  });
  // Returns a null object when given a message with an empty first name
  it('should return a null object when given a message without both first and last name', () => {
    const message = {
      context: {
        traits: {
          title: 'Mr.',
          companyName: 'RudderTest',
          countryCode: 'USA',
        },
      },
    };
    const result = curateUserInfoObject(message);
    expect(result).toEqual(null);
  });
});

describe('deduceConversionRules', () => {
  // When conversionMapping is empty, return ConfigurationError
  it('should return ConfigurationError when conversionMapping is empty', () => {
    const trackEventName = 'eventName';
    const destConfig = {
      conversionMapping: [],
    };
    expect(() => deduceConversionRules(trackEventName, destConfig)).toThrow(ConfigurationError);
  });

  // When conversionMapping is not empty, return the conversion rule
  it('should return the conversion rule when conversionMapping is not empty', () => {
    const trackEventName = 'eventName';
    const destConfig = {
      conversionMapping: [{ from: 'eventName', to: 'conversionEvent' }],
    };
    const result = deduceConversionRules(trackEventName, destConfig);
    expect(result).toEqual(['conversionEvent']);
  });

  it('should return the conversion rule when conversionMapping is not empty', () => {
    const trackEventName = 'eventName';
    const destConfig = {
      conversionMapping: [
        { from: 'eventName', to: 'conversionEvent' },
        { from: 'eventName', to: 'conversionEvent2' },
      ],
    };
    const result = deduceConversionRules(trackEventName, destConfig);
    expect(result).toEqual(['conversionEvent', 'conversionEvent2']);
  });
});

describe('generateHeader', () => {
  // Returns a headers object with Content-Type, X-RestLi-Method, X-Restli-Protocol-Version, LinkedIn-Version, and Authorization keys when passed a valid access token.
  it('should return a headers object with all keys when passed a valid access token', () => {
    // Arrange
    const accessToken = generateRandomString();

    // Act
    const result = generateHeader(accessToken);

    // Assert
    expect(result).toEqual({
      'Content-Type': 'application/json',
      'X-RestLi-Method': API_HEADER_METHOD,
      'X-Restli-Protocol-Version': API_PROTOCOL_VERSION,
      'LinkedIn-Version': API_VERSION,
      Authorization: `Bearer ${accessToken}`,
    });
  });

  // Returns a headers object with default values for all keys when passed an invalid access token.
  it('should return a headers object with default values for all keys when passed an invalid access token', () => {
    // Arrange
    const accessToken = generateRandomString();

    // Act
    const result = generateHeader(accessToken);

    // Assert
    expect(result).toEqual({
      'Content-Type': 'application/json',
      'X-RestLi-Method': API_HEADER_METHOD,
      'X-Restli-Protocol-Version': API_PROTOCOL_VERSION,
      'LinkedIn-Version': API_VERSION,
      Authorization: `Bearer ${accessToken}`,
    });
  });
});

describe('constructPartialStatus', () => {
  // The function correctly constructs a map of error messages when given a string containing error messages.
  it('should correctly construct a map of error messages when given a string containing error messages', () => {
    const errorMessage = 'Index: 1, ERROR :: Error 1\nIndex: 2, ERROR :: Error 2\n';
    const expectedErrorMap = {
      1: 'Error 1',
      2: 'Error 2',
    };

    const result = constructPartialStatus(errorMessage);

    expect(result).toEqual(expectedErrorMap);
  });

  // The function throws an error when given a non-string input.
  it('should throw an error when given a non-string input', () => {
    const errorMessage = 123;
    const result = constructPartialStatus(errorMessage);
    expect(result).toEqual({});
  });
});

describe('createResponseArray', () => {
  // Returns an array of objects with statusCode, metadata and error properties
  it('should return an array of objects with statusCode, metadata and error properties', () => {
    // Arrange
    const metadata = [{ jobId: 1 }, { jobId: 2 }, { jobId: 3 }];
    const partialStatus = {
      0: 'Partial status message 1',
      2: 'Partial status message 3',
    };

    // Act
    const result = createResponseArray(metadata, partialStatus);

    // Assert
    expect(result).toEqual([
      {
        statusCode: 400,
        metadata: { jobId: 1 },
        error: 'Partial status message 1',
      },
      {
        statusCode: 500,
        metadata: { jobId: 2 },
        error: 'success',
      },
      {
        statusCode: 400,
        metadata: { jobId: 3 },
        error: 'Partial status message 3',
      },
    ]);
  });
});

describe('checkIfPricePresent', () => {
  // Returns true if properties object has a 'price' field
  it('should return true when properties object has a price field', () => {
    const properties = { price: 10 };
    const result = checkIfPricePresent(properties);
    expect(result).toBe(true);
  });

  // Returns true if properties object has a 'products' array with an object containing a 'price' field and a 'price' field in the properties object
  it('should return true when properties object has a products array with an object containing a price field and a price field in the properties object', () => {
    const properties = { products: [{ price: 10 }, { quantity: 3 }], price: 20 };
    const result = checkIfPricePresent(properties);
    expect(result).toBe(true);
  });

  // Returns false if properties object does not have a 'price' field or a 'products' array with an object containing a 'price' field
  it('should return false when properties object does not have a price field or a products array with an object containing a price field', () => {
    const properties = { quantity: 5 };
    const result = checkIfPricePresent(properties);
    expect(result).toBe(false);
  });
});
