import { ecomTestData } from './ecommTestData';
import { identifyData } from './identifyTestData';
import { trackTestData } from './trackTestData';
import { validationTestData } from './validationTestData';

export const data = [...identifyData, ...trackTestData, ...ecomTestData, ...validationTestData];
