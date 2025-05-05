import { ProcessorTestData } from '../../../testTypes';
import { identifyTestData } from './identifyTestData';
import { trackTestData } from './trackTestData';
import { validationTestData } from './validationTestData';

export const data: ProcessorTestData[] = [
  ...identifyTestData,
  ...trackTestData,
  ...validationTestData,
];
