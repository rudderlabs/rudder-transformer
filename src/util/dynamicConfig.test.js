const { processDynamicConfig } = require('./dynamicConfig');
const { getFuncTestData } = require('../../test/testHelper');

const funcName = 'processDynamicConfig';
const reqType = 'processor';

describe(`${funcName} Tests`, () => {
  const funcTestData = getFuncTestData(__dirname, `./testdata/${funcName}.json`);
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
