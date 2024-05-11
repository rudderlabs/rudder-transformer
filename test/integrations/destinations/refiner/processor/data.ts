import { identifyTestData } from './identifyTestData';
import { trackTestData } from './trackTestData';
import { pageTestData } from './pageTestData';
import { groupTestData } from './groupTestData';
import { validationTestData } from './validationTestData';

export const data = [
  ...identifyTestData,
  ...trackTestData,
  ...pageTestData,
  ...groupTestData,
  ...validationTestData,
];
