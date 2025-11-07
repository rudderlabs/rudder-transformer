const { transformTraits, getEndpoints } = require('./utils');

// Mock dependencies
jest.mock('./config', () => ({
  DEFAULT_BASE_URL: 'https://api.userpilot.com',
  MAPPINGS: { firstName: 'first_name', lastName: 'last_name' },
}));

jest.mock('../../../../v0/util', () => ({
  stripTrailingSlash: jest.fn((url) => url.replace(/\/$/, '')),
}));

describe('utils.js', () => {
  describe('getEndpoints', () => {
    it('should return correct endpoints with default base URL', () => {
      const endpoints = getEndpoints({});
      expect(endpoints).toEqual({
        IDENTIFY: 'https://api.userpilot.com/v1/identify',
        TRACK: 'https://api.userpilot.com/v1/track',
        GROUP: 'https://api.userpilot.com/v1/companies/identify',
      });
    });

    it('should return correct endpoints with custom base URL', () => {
      const endpoints = getEndpoints({ apiEndpoint: 'https://custom.url/' });
      expect(endpoints).toEqual({
        IDENTIFY: 'https://custom.url/v1/identify',
        TRACK: 'https://custom.url/v1/track',
        GROUP: 'https://custom.url/v1/companies/identify',
      });
    });
  });

  describe('transformTraits', () => {
    it('should transform traits based on mappings', () => {
      const traits = { firstName: 'John', lastName: 'Doe', age: 30 };
      const transformed = transformTraits(traits);
      expect(transformed).toEqual({ first_name: 'John', last_name: 'Doe', age: 30 });
    });

    it('should return the same traits if no mappings are found', () => {
      const traits = { age: 30, city: 'New York' };
      const transformed = transformTraits(traits);
      expect(transformed).toEqual({ age: 30, city: 'New York' });
    });
  });
});
