import { identifyTestData } from './identifyTestData';
import { trackTestData } from './trackTestData';
import { groupTestData } from './groupTestData';
import { validationTestData } from './validationTestData';

export const data = [
  ...identifyTestData,
  ...trackTestData,
  ...groupTestData,
  ...validationTestData,
];
