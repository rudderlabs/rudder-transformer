
const utilities = require("../../../src/v0/util");
const { getFuncTestData } = require("./testHelper");

const functionsToTest = [
  "flattenJson",
  "getDestinationExternalID"
]

describe("Utility Functions Tests", () => {
  describe.each(functionsToTest)("%s Tests", (funcName) => {
    const funcTestData = getFuncTestData(funcName);
    test.each(funcTestData)(
      "$description",
      async ({description, input, output}) => {
        let result;
        if (Array.isArray(input)) {
          result = utilities[funcName](...input);
        } else {
          result = utilities[funcName](input);
        }
        expect(result).toEqual(output);
      }
    );
  });
});
