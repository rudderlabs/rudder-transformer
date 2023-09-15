import fs from 'fs';
import path from 'path';
import { processCdkV2Workflow } from '../../src/cdk/v2/handler';
import tags from '../../src/v0/util/tags';

const integration = 'launchdarkly_audience';
const destName = 'LaunchDarkly Audience';

// Processor Test files
const testDataFile = fs.readFileSync(path.resolve(__dirname, `./data/${integration}.json`), {
  encoding: 'utf8',
});
const testData = JSON.parse(testDataFile);

jest.mock(`../../src/cdk/v2/destinations/launchdarkly_audience/config`, () => {
  const originalConfig = jest.requireActual(
    `../../src/cdk/v2/destinations/launchdarkly_audience/config`,
  );
  return {
    ...originalConfig,
    MAX_IDENTIFIERS: 2,
  };
});

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
