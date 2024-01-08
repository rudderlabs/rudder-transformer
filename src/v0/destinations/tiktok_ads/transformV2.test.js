const { processRouterDest } = require('./transformV2');

jest.mock('axios');
jest.mock(`./config`, () => {
  const originalConfig = jest.requireActual(`./config`);
  return {
    ...originalConfig,
    maxBatchSizeV2: 3,
  };
});
const fs = require('fs');
const path = require('path');

const testDataFile = fs.readFileSync(path.resolve(__dirname, `routerBatchingTestCases.json`));

const testData = JSON.parse(testDataFile);

describe(`Router Batching Tests`, () => {
  testData.forEach((event, index) => {
    it(`${index} -> ${event.description}`, async () => {
      const output = await processRouterDest(event.input);
      expect(output).toEqual(event.output);
    });
  });
});
