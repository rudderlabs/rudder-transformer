import { trackTestData } from './trackTestData';
import { validationTestData } from './validationTestData';
import { configLevelFeaturesTestData } from './configLevelFeaturesTestData';

export const mockFns = (_) => {
  // @ts-ignore
  jest.useFakeTimers().setSystemTime(new Date('2023-10-15'));
};
export const data = [...trackTestData, ...validationTestData, ...configLevelFeaturesTestData].map(
  (d) => ({ ...d, mockFns }),
);
