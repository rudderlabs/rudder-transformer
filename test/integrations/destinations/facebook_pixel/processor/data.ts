import { identifyTestData } from './identifyTestData';
import { trackTestData } from './trackTestData';
import { validationTestData } from './validationTestData';
import { pageScreenTestData } from './pageScreenTestData';
import { ecommTestData } from './ecommTestData';
import { configLevelFeaturesTestData } from './configLevelFeaturesTestData';

export const mockFns = (_) => {
  // @ts-ignore
  jest.useFakeTimers().setSystemTime(new Date('2023-10-15'));
};

export const data = [
  ...identifyTestData,
  ...trackTestData,
  ...validationTestData,
  ...pageScreenTestData,
  ...ecommTestData,
  ...configLevelFeaturesTestData,
].map((d) => ({ ...d, mockFns }));
