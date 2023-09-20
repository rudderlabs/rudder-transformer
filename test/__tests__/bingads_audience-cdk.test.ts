import fs from 'fs';
import path from 'path';
import {
  processCdkV2Workflow,
  executeStep,
  getCachedWorkflowEngine,
  getEmptyExecutionBindings,
} from '../../src/cdk/v2/handler';
import tags from '../../src/v0/util/tags';
import { data as stepsTestData } from './data/bingads_audience_steps';

const integration = 'bingads_audience';
const destName = 'BingAds Audience';

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

  describe('Step Tests', () => {
    stepsTestData.forEach((dataPoint, index) => {
      it(`${destName} steps payload: ${index}`, async () => {
        const workflowEngine = await getCachedWorkflowEngine(integration, tags.FEATURES.PROCESSOR);
        try {
          const output = await executeStep(
            workflowEngine,
            dataPoint.stepName,
            dataPoint.input,
            dataPoint.bindings,
          );
          expect(output.output).toEqual(dataPoint.output);
        } catch (error: any) {
          expect(error.message).toEqual(dataPoint.error);
        }
      });
    });
  });
});
