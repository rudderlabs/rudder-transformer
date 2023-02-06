const utilities = require('../../../src/v0/util');
const { getFuncTestData } = require('./testHelper');

// Names of the utility functions to test
const functionNames = [
  'flattenJson',
  'getDestinationExternalID',
  'isHybridModeEnabled',
  'handleSourceKeysOperation',
  'getValueFromPropertiesOrTraits',
  'getErrorStatusCode',
  'extractCustomFields'
];

// Names of the utility functions to test which expects multiple arguments as values and not objects
const functionNamesExpectingMultipleArguments = [
  'checkAndCorrectUserId'
]

describe('Utility Functions Tests', () => {
  describe.each(functionNames)('%s Tests', (funcName) => {
    const funcTestData = getFuncTestData(funcName);
    test.each(funcTestData)('$description', async ({ description, input, output }) => {
      try {
        let result;

        // This is to allow sending multiple arguments to the function
        if (Array.isArray(input)) {
          result = utilities[funcName](...input);
        } else {
          result = utilities[funcName](input);
        }
        expect(result).toEqual(output);
      } catch (e) {
        // Explicitly fail the test case
        expect(true).toEqual(false);
      }
    });
  });
  /* This is to allow sending multiple arguments to the function in case  when input is not an array but object
  * Like in case of checkAndCorrectUserId 
  * "input": {
            "statusCode": 200,
            "userId": 1234
        }
  * checkAndCorrectUserId function expects two arguments statusCode and userId and not an object so we need to send them as multiple arguments
  * in the same order that they are defined in the function. 
  * This order should be maintained in the input Object.
  */
  describe.each(functionNamesExpectingMultipleArguments)('%s Tests', (funcName) => {
    const funcTestData = getFuncTestData(funcName);
    test.each(funcTestData)('$description', async ({ description, input, output }) => {
      try {
        let result;
        console.log(Object.values(input));
        result = utilities[funcName](...Object.values(input));
        expect(result).toEqual(output);
      } catch (e) {
        // Explicitly fail the test case
        expect(true).toEqual(false);
      }
    });
  });
});


