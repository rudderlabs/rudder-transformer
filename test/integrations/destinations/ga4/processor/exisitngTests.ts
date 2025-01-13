import { pageTestData } from './pageTestData';
import { ecommTestData } from './ecomTestData';
import { trackTestData } from './trackTestData';
import { groupTestData } from './groupTestData';
import { validationTestData } from './validationTestData';

export const existingTests = [
  ...pageTestData,
  ...trackTestData,
  ...ecommTestData,
  ...groupTestData,
  ...validationTestData,
];
