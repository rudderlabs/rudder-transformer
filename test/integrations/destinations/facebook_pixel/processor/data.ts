// import { ecomTestData } from './ecomTestData';
//  import { identifyTestData } from './identifyTestData';
// import { trackTestData } from './trackTestData';
// import { validationTestData } from './validationTestData';
import { pageScreenTestData } from './pageScreenTestData';

export const mockFns = (_) => {
  // @ts-ignore
  jest.useFakeTimers().setSystemTime(new Date('2023-10-15'));
};

export const data = [
  //...identifyTestData,
  // ...trackTestData,
  // ...ecomTestData,
  //  ...validationTestData,
  ...pageScreenTestData,
].map((d) => ({ ...d, mockFns }));
