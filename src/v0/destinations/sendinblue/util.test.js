const { transformUserTraits } = require('./util');

describe('transformUserTraits', () => {
  describe('should handle null/undefined/non-object traits', () => {
    const contactAttributeMapping = [
      { from: 'location', to: 'LOCATION' },
      { from: 'city', to: 'CITY' },
    ];

    it('should return null when traits is null', () => {
      const result = transformUserTraits(null, contactAttributeMapping);
      expect(result).toBeNull();
    });

    it('should return undefined when traits is undefined', () => {
      const result = transformUserTraits(undefined, contactAttributeMapping);
      expect(result).toBeUndefined();
    });

    it('should return the original value when traits is a string', () => {
      const result = transformUserTraits('invalid_string', contactAttributeMapping);
      expect(result).toBe('invalid_string');
    });

    it('should return the original value when traits is a number', () => {
      const result = transformUserTraits(123, contactAttributeMapping);
      expect(result).toBe(123);
    });

    it('should return the original value when traits is a boolean', () => {
      const result = transformUserTraits(true, contactAttributeMapping);
      expect(result).toBe(true);
    });

    it('should return empty object when traits is an empty object', () => {
      const result = transformUserTraits({}, contactAttributeMapping);
      expect(result).toEqual({});
    });
  });

  describe('should transform traits with valid attribute mapping', () => {
    it('should map trait keys to new keys based on contactAttributeMapping', () => {
      const traits = {
        location: 'Mumbai',
        city: 'Delhi',
        age: 25,
      };
      const contactAttributeMapping = [
        { from: 'location', to: 'LOCATION' },
        { from: 'city', to: 'CITY' },
      ];

      const result = transformUserTraits(traits, contactAttributeMapping);

      expect(result).toEqual({
        LOCATION: 'Mumbai',
        CITY: 'Delhi',
        age: 25,
      });
      expect(result.location).toBeUndefined();
      expect(result.city).toBeUndefined();
    });

    it('should not modify traits when contactAttributeMapping is empty', () => {
      const traits = {
        location: 'Mumbai',
        city: 'Delhi',
      };

      const result = transformUserTraits(traits, []);

      expect(result).toEqual({
        location: 'Mumbai',
        city: 'Delhi',
      });
    });

    it('should not modify traits when contactAttributeMapping is undefined', () => {
      const traits = {
        location: 'Mumbai',
        city: 'Delhi',
      };

      const result = transformUserTraits(traits, undefined);

      expect(result).toEqual({
        location: 'Mumbai',
        city: 'Delhi',
      });
    });

    it('should only transform matching keys from attribute mapping', () => {
      const traits = {
        location: 'Mumbai',
        role: 'Engineer',
      };
      const contactAttributeMapping = [
        { from: 'location', to: 'LOCATION' },
        { from: 'city', to: 'CITY' },
      ];

      const result = transformUserTraits(traits, contactAttributeMapping);

      expect(result).toEqual({
        LOCATION: 'Mumbai',
        role: 'Engineer',
      });
    });

    it('should not transform traits with falsy values', () => {
      const traits = {
        location: '',
        city: null,
        country: 'India',
        age: 0,
      };
      const contactAttributeMapping = [
        { from: 'location', to: 'LOCATION' },
        { from: 'city', to: 'CITY' },
        { from: 'country', to: 'COUNTRY' },
        { from: 'age', to: 'AGE' },
      ];

      const result = transformUserTraits(traits, contactAttributeMapping);

      expect(result).toEqual({
        location: '',
        city: null,
        COUNTRY: 'India',
        age: 0,
      });
    });
  });

  describe('edge cases', () => {
    it('should handle traits with nested objects', () => {
      const traits = {
        location: { city: 'Mumbai', state: 'MH' },
        name: 'John',
      };
      const contactAttributeMapping = [{ from: 'location', to: 'LOCATION' }];

      const result = transformUserTraits(traits, contactAttributeMapping);

      expect(result).toEqual({
        LOCATION: { city: 'Mumbai', state: 'MH' },
        name: 'John',
      });
    });

    it('should handle traits with array values', () => {
      const traits = {
        tags: ['tag1', 'tag2'],
        location: 'Mumbai',
      };
      const contactAttributeMapping = [
        { from: 'tags', to: 'TAGS' },
        { from: 'location', to: 'LOCATION' },
      ];

      const result = transformUserTraits(traits, contactAttributeMapping);

      expect(result).toEqual({
        TAGS: ['tag1', 'tag2'],
        LOCATION: 'Mumbai',
      });
    });

    it('should return array as-is when traits is an array (non-plain object)', () => {
      const traits = ['item1', 'item2'];
      const contactAttributeMapping = [{ from: 'location', to: 'LOCATION' }];

      const result = transformUserTraits(traits, contactAttributeMapping);

      expect(result).toEqual(['item1', 'item2']);
    });

    it('should handle traits with when contactAttributeMapping has same key and value', () => {
      const traits = {
        tags: ['tag1', 'tag2'],
        location: 'Mumbai',
      };
      const contactAttributeMapping = [
        { from: 'tags', to: 'tags' },
        { from: 'location', to: 'LOCATION' },
      ];

      const result = transformUserTraits(traits, contactAttributeMapping);

      expect(result).toEqual({
        tags: ['tag1', 'tag2'],
        LOCATION: 'Mumbai',
      });
    });
  });
});
