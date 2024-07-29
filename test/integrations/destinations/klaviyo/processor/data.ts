import { ecomTestData } from './ecomTestData';
import { groupTestData } from './groupTestData';
import { identifyData } from './identifyTestData';
import { screenTestData } from './screenTestData';
import { trackTestData } from './trackTestData';
import { validationTestData } from './validationTestData';
import { dataV2 } from './dataV2';

export const data = [
  ...dataV2,
  ...identifyData,
  ...trackTestData,
  ...screenTestData,
  ...groupTestData,
  ...ecomTestData,
  ...validationTestData,
];
