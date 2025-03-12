import { TestCaseData } from '../../../testTypes';
export const skip = true;
export const data: TestCaseData[] = [
  {
    name: 'test',
    module: 'test',
    description: 'test',
    feature: 'test',
    input: {
      request: {
        method: 'GET',
        body: {
          test: 'test',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: 'test',
      },
    },
  },
];
