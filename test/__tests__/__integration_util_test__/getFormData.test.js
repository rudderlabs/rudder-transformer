const { getFormData } = require('../../../src/adapters/network');
const { getFuncTestData } = require('./testHelper');

const funcName = 'getFormData';

describe(`${funcName} Tests`, () => {
  const funcTestData = getFuncTestData(funcName);
  test.each(funcTestData)('$description', async ({ description, input, output }) => {
    let result;
    if (Array.isArray(input)) {
      result = getFormData(...input);
    } else {
      result = getFormData(input);
    }
    expect(result.toString()).toEqual(output);
  });
});
