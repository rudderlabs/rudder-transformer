const { getShopifyTopic,
} = require('./util');
jest.mock('ioredis', () => require('../../../../test/__mocks__/redis'));
describe('Shopify Utils Test', () => {
  describe('Fetching Shopify Topic Test Cases', () => {
    it('Invalid Topic Test', () => {
      const input = {
        query_parameters: {},
      };
      const expectedOutput = {
        error: 'Invalid topic in query_parameters',
      };
      try {
        getShopifyTopic(input);
      } catch (error) {
        expect(error.message).toEqual(expectedOutput.error);
      }
    });

    it('No Topic Found Test', () => {
      const input = {
        query_parameters: {
          topic: [],
        },
      };
      const expectedOutput = {
        error: 'Topic not found',
      };
      try {
        getShopifyTopic(input);
      } catch (error) {
        expect(error.message).toEqual(expectedOutput.error);
      }
    });

    it('Successfully fetched topic Test', () => {
      const input = {
        query_parameters: {
          topic: ['<shopify_topic>'],
        },
      };
      const expectedOutput = '<shopify_topic>';
      const actualOutput = getShopifyTopic(input);
      expect(actualOutput).toEqual(expectedOutput);
    });

    it('Empty Query Params Test', () => {
      const input = {
        randomKey: 'randomValue',
      };
      const expectedOutput = {
        error: 'Query_parameters is missing',
      };
      try {
        getShopifyTopic(input);
      } catch (error) {
        expect(error.message).toEqual(expectedOutput.error);
      }
    });
  });

});
