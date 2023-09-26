const fs = require("fs");
import path from 'path';
import { processCdkV2Workflow } from '../../src/cdk/v2/handler';
import tags from '../../src/v0/util/tags';

const integration = 'statsig';
const destName = 'Statsig';

const testDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}.json`)
);
const testData = JSON.parse(testDataFile);

describe(`${destName} Tests`, () => {
  describe('Processor Tests', () => {
    testData.forEach((dataPoint, index) => {
      it(`${destName} - payload: ${index}`, async () => {
        const expected = dataPoint.output;
        try {
          const output = await processCdkV2Workflow(integration, dataPoint.input, tags.FEATURES.PROCESSOR);
          expect(output).toEqual(expected);
        } catch (error: any) {
          expect(error.message).toEqual(expected.error);
        }
      });
    });
  });
});
