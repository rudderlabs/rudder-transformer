import { businessCDKTestData } from './business';
import { businessNativeTestData } from './business-native';
import { validationCDKTestData } from './validation';
import { validationNativeTestData } from './validation-native';
export const data = [
  ...validationCDKTestData,
  ...businessCDKTestData,
  ...businessNativeTestData,
  ...validationNativeTestData,
];
