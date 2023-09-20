const { getFormData } = require('./network');
const { getFuncTestData } = require('../../test/testHelper');

const funcName = 'getFormData';

describe(`${funcName} Tests`, () => {
  const funcTestData = getFuncTestData(__dirname, `./testdata/${funcName}.json`);
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
