const { processDynamicConfig } = require('../../../src/util/dynamicConfig');
const { getFuncTestData } = require('./testHelper');

const funcName = 'processDynamicConfig';
const reqType = 'processor';

describe(`${funcName} Tests`, () => {
  const funcTestData = getFuncTestData(funcName);
  test.each(funcTestData)('$description', async ({ description, input, output }) => {
    let result;
    if (Array.isArray(input)) {
      result = processDynamicConfig(...input);
    } else {
      result = processDynamicConfig(input, reqType);
    }
    expect(result).toEqual(output);
  });
});
