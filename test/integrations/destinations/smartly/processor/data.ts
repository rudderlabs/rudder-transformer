import { trackTestData } from './track';
import { validationFailures } from './validation';

export const mockFns = (_) => {
  // @ts-ignore
  jest.useFakeTimers().setSystemTime(new Date('2024-02-01'));
};

export const data = [...trackTestData, ...validationFailures].map((d) => ({ ...d, mockFns }));
