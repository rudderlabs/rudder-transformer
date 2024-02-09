// import { ecomTestData } from './ecomTestData';
import { identifyData } from './identifyTestData';
// import { trackTestData } from './trackTestData';
import { validationTestData } from './validationTestData';

export const mockFns = (_) => {
  // @ts-ignore
  jest.useFakeTimers().setSystemTime(new Date('2023-10-15'));
};

export const data = [
  ...identifyData,
  // ...trackTestData,
  // ...ecomTestData,
  ...validationTestData,
].map((d) => ({ ...d, mockFns }));