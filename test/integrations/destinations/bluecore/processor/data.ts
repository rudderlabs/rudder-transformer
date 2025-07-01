/**
 * Auto-migrated and optimized test cases
 * Generated on: 2025-05-21T05:11:32.254Z
 */

import { ProcessorTestData } from '../../../testTypes';
import { identifyData } from './identifyTestData';
import { trackTestData } from './trackTestData';
import { ecomTestData } from './ecommTestData';
import { validationTestData } from './validationTestData';

export const data: ProcessorTestData[] = [
  ...identifyData,
  ...trackTestData,
  ...ecomTestData,
  ...validationTestData,
];
