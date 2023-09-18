const { validatePayloadDataTypes } = require('../../../../src/v0/destinations/hs/util');

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
