import { identifyTestData } from './identifyTestData';
import { trackTestData } from './trackTestData';
import { pageScreenTestData } from './pageScreenTestData';
import { aliasTestData } from './aliasTestData';
import { validationTestData } from './validationTestData';

export const data = [
  ...identifyTestData,
  ...trackTestData,
  ...pageScreenTestData,
  ...aliasTestData,
  ...validationTestData,
];
