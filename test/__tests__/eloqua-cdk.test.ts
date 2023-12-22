import fs from 'fs';
import path from 'path';
import { processCdkV2Workflow } from '../../src/cdk/v2/handler';
import tags from '../../src/v0/util/tags';

const integration = 'eloqua';
const destName = 'Eloqua';

// Processor Test files
const processorTestDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}.json`),
  {
    encoding: 'utf8',
  },
);
const processorTestData = JSON.parse(processorTestDataFile);

describe(`${destName} Tests`, () => {
  describe('Processor Tests', () => {
    processorTestData.forEach((dataPoint, index) => {
      it(`${destName} processor payload: ${index}`, async () => {
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
