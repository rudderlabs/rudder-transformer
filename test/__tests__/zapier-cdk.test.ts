import fs from 'fs';
import path from 'path';
import { processCdkV2Workflow } from '../../src/cdk/v2/handler';
import tags from '../../src/v0/util/tags';

const integration = 'zapier';
const destName = 'Zapier';

const inputDataFile = fs.readFileSync(path.resolve(__dirname, `./data/${integration}_input.json`), {
  encoding: 'utf8',
});
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/${integration}_cdk_output.json`),
  { encoding: 'utf8' },
);
const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

describe(`${destName} Tests`, () => {
  describe('Processor Tests', () => {
    inputData.forEach((input, index) => {
      it(`${destName} - payload: ${index}`, async () => {
        const expected = expectedData[index];
        try {
          const output = await processCdkV2Workflow(integration, input, tags.FEATURES.PROCESSOR);
          expect(output).toEqual(expected);
        } catch (error: any) {
          expect(error.message).toEqual(expected.error);
        }
      });
    });
  });
});
