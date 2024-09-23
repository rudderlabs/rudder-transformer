const {
  getRequestData,
  extractIDsForSearchAPI,
  validatePayloadDataTypes,
  getObjectAndIdentifierType,
  isIterable,
} = require('./util');
const { primaryToSecondaryFields } = require('./config');

const propertyMap = {
  firstName: 'string',
  lstName: 'string',
  age: 'number',
  city: 'string',
  isPaidPlan: 'bool',
  address: 'enumeration',
};

describe('Validate payload data types utility function test cases', () => {
  it('Should validate payload data type and return it', () => {
    const expectedOutput = 'rohan';
    expect(validatePayloadDataTypes(propertyMap, 'firstName', 'rohan', 'fn')).toEqual(
      expectedOutput,
    );
  });

  it('Should convert payload data type and return it', () => {
    const expectedOutput = { surname: 'shah' };
    expect(validatePayloadDataTypes(propertyMap, 'lastName', { surname: 'shah' }, 'ln')).toEqual(
      expectedOutput,
    );
  });

  it('Should convert payload data type and return it', () => {
    const expectedOutput = '45';
    expect(validatePayloadDataTypes(propertyMap, 'city', 45, 'city')).toEqual(expectedOutput);
  });

  it('Should throw an error as data type is not matching with hubspot data type', () => {
    const expectedOutput =
      'Property userAge data type string is not matching with Hubspot property data type number';
    try {
      const output = validatePayloadDataTypes(propertyMap, 'age', 'Twenty', 'userAge');
      expect(output).toEqual('');
    } catch (error) {
      expect(error.message).toEqual(expectedOutput);
    }
  });
});

describe('getObjectAndIdentifierType utility test cases', () => {
  it('should return an object with objectType and identifierType properties when given a valid input', () => {
    const firstMessage = {
      type: 'identify',
      traits: {
        to: {
          id: 1,
        },
        from: {
          id: 940,
        },
      },
      userId: '1',
      context: {
        externalId: [
          {
            id: 1,
            type: 'HS-association',
            toObjectType: 'contacts',
            fromObjectType: 'companies',
            identifierType: 'id',
            associationTypeId: 'engineer',
          },
        ],
        mappedToDestination: 'true',
      },
    };
    const result = getObjectAndIdentifierType(firstMessage);
    expect(result).toEqual({ objectType: 'association', identifierType: 'id' });
  });

  it('should throw an error when objectType or identifierType is not present in input', () => {
    const firstMessage = {
      type: 'identify',
      traits: {
        to: {
          id: 1,
        },
        from: {
          id: 940,
        },
      },
      userId: '1',
      context: {
        externalId: [
          {
            id: 1,
            type: 'HS-',
            toObjectType: 'contacts',
            fromObjectType: 'companies',
            associationTypeId: 'engineer',
          },
        ],
        mappedToDestination: 'true',
      },
    };
    try {
      getObjectAndIdentifierType(firstMessage);
    } catch (err) {
      expect(err.message).toBe('rETL - external Id not found.');
    }
  });
});

describe('extractUniqueValues utility test cases', () => {
  it('Should return an array of unique values', () => {
    const inputs = [
      {
        message: {
          context: {
            externalId: [
              {
                identifierType: 'email',
                id: 'testhubspot2@email.com',
                type: 'HS-lead',
              },
            ],
            mappedToDestination: true,
          },
        },
      },
      {
        message: {
          context: {
            externalId: [
              {
                identifierType: 'email',
                id: 'Testhubspot3@email.com',
                type: 'HS-lead',
              },
            ],
            mappedToDestination: true,
          },
        },
      },
      {
        message: {
          context: {
            externalId: [
              {
                identifierType: 'email',
                id: 'testhubspot4@email.com',
                type: 'HS-lead',
              },
            ],
            mappedToDestination: true,
          },
        },
      },
      {
        message: {
          context: {
            externalId: [
              {
                identifierType: 'email',
                id: 'testHUBSPOT5@email.com',
                type: 'HS-lead',
              },
            ],
            mappedToDestination: true,
          },
        },
      },
      {
        message: {
          context: {
            externalId: [
              {
                identifierType: 'email',
                id: 'testhubspot2@email.com',
                type: 'HS-lead',
              },
            ],
            mappedToDestination: true,
          },
        },
      },
    ];

    const result = extractIDsForSearchAPI(inputs);

    expect(result).toEqual([
      'testhubspot2@email.com',
      'testhubspot3@email.com',
      'testhubspot4@email.com',
      'testhubspot5@email.com',
    ]);
  });

  it('Should return an empty array when the input is empty', () => {
    const inputs = [];
    const result = extractIDsForSearchAPI(inputs);
    expect(result).toEqual([]);
  });
});

describe('getRequestDataAndRequestOptions utility test cases', () => {
  it('Should return an object with requestData and requestOptions', () => {
    const identifierType = 'email';
    const chunk = ['test1@gmail.com'];
    const accessToken = 'dummyAccessToken';

    const expectedRequestData = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: identifierType,
              values: chunk,
              operator: 'IN',
            },
          ],
        },
        {
          filters: [
            {
              propertyName: primaryToSecondaryFields[identifierType],
              values: chunk,
              operator: 'IN',
            },
          ],
        },
      ],
      properties: [identifierType, primaryToSecondaryFields[identifierType]],
      limit: 100,
      after: 0,
    };

    const requestData = getRequestData(identifierType, chunk, accessToken);
    expect(requestData).toEqual(expectedRequestData);
  });
});

describe('isIterable utility test cases', () => {
  it('should return true when the input is an array', () => {
    const input = [1, 2, 3];
    const result = isIterable(input);
    expect(result).toBe(true);
  });
  it('should return false when the input is null', () => {
    const input = null;
    const result = isIterable(input);
    expect(result).toBe(false);
  });
  it('should return false when the input is undefined', () => {
    const input = undefined;
    const result = isIterable(input);
    expect(result).toBe(false);
  });
});
