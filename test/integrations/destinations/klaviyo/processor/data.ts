import { ecomTestData } from './ecomTestData';
import { groupTestData } from './groupTestData';
import { identifyData } from './identifyTestData';
import { screenTestData } from './screenTestData';
import { trackTestData } from './trackTestData';
import { validationTestData } from './validationTestData';

export const data = [
  ...identifyData,
  ...trackTestData,
  ...screenTestData,
  ...groupTestData,
  ...ecomTestData,
  ...validationTestData,
];
