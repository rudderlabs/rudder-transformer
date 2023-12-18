import fs from 'fs';
import path from 'path';
import { processCdkV2Workflow } from '../../src/cdk/v2/handler';
import tags from '../../src/v0/util/tags';

const integration = 'fullstory';
const destName = 'Fullstory';

// Processor Test files
const testDataFile = fs.readFileSync(path.resolve(__dirname, `./data/${integration}.json`), {
  encoding: 'utf8',
});
const testData = JSON.parse(testDataFile);

describe(`${destName} Tests`, () => {
  describe('Processor Tests', () => {
    testData.forEach((dataPoint, index) => {
      it(`${destName} - payload: ${index}`, async () => {
        try {
          const output = await processCdkV2Workflow(
            integration,
            dataPoint.input,
            tags.FEATURES.PROCESSOR,
          );
          expect(output).toEqual(dataPoint.output);
        } catch (error: any) {
          expect(error.message).toEqual(dataPoint.output.error);
        }
      });
    });
  });
});
