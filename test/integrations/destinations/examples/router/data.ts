import { TestCaseData } from '../../../testTypes';
export const data: TestCaseData[] = [
  {
    name: 'test',
    module: 'test',
    description: 'test',
    feature: 'test',
    skip: true,
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
