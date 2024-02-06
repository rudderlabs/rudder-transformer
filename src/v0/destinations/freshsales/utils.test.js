const { createCustomField } = require('./utils');

describe('createCustomField', () => {
  // Should return an empty object when given an empty traits object and customPropertyMapping array
  it('should return an empty object when given an empty traits object and customPropertyMapping array', () => {
    const traits = {};
    const customPropertyMapping = [];
    const result = createCustomField(traits, customPropertyMapping);
    expect(result).toEqual({});
  });

  // Should return an empty object when given a traits object with no matching keys in customPropertyMapping array
  it('should return an empty object when given a traits object with no matching keys in customPropertyMapping array', () => {
    const traits = { name: 'John', age: 30 };
    const customPropertyMapping = [{ from: 'email', to: 'email' }];
    const result = createCustomField(traits, customPropertyMapping);
    expect(result).toEqual({});
  });

  // Should return a customField object with key-value pairs when given a traits object with matching keys in customPropertyMapping array
  it('should return a customField object with key-value pairs when given a traits object with matching keys in customPropertyMapping array', () => {
    const traits = { name: 'John', age: 30, email: 'john@example.com' };
    const customPropertyMapping = [
      { from: 'name', to: 'user_name' },
      { from: 'email', to: 'user_email' },
    ];
    const result = createCustomField(traits, customPropertyMapping);
    expect(result).toEqual({ user_name: 'John', user_email: 'john@example.com' });
  });

  // Should return an empty object when given a null customPropertyMapping array
  it('should return an empty object when given a null customPropertyMapping array', () => {
    const traits = { name: 'John' };
    const customPropertyMapping = null;
    const result = createCustomField(traits, customPropertyMapping);
    expect(result).toEqual({});
  });

  // Should return an empty object when given a traits object with no matching keys in customPropertyMapping array and customPropertyMapping array with no 'to' values
  it("should return an empty object when given a traits object with no matching keys in customPropertyMapping array and customPropertyMapping array with no 'to' values", () => {
    const traits = { name: 'John', age: 30 };
    const customPropertyMapping = [{ from: 'email' }, { from: 'phone' }];
    const result = createCustomField(traits, customPropertyMapping);
    expect(result).toEqual({});
  });
});
