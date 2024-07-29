import { groupTestData } from './groupTestDataV2';
import { identifyData } from './identifyTestDataV2';
import { screenTestData } from './screenTestDataV2';
import { trackTestData } from './trackTestDataV2';
import { validationTestData } from './validationTestData';

export const dataV2 = [
  ...identifyData,
  ...trackTestData,
  ...screenTestData,
  ...groupTestData,
  ...validationTestData,
];
