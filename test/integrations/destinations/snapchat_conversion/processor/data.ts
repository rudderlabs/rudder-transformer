import { ProcessorTestData } from '../../../testTypes';
import { dataV3 } from './dataV3';
import { dataV2 } from './dataV2';
import { validationTestDataV2 } from './validationTestDataV2';
import { validationTestDataV3 } from './validationTestDataV3';

export const data: ProcessorTestData[] = [
  ...dataV2,
  ...validationTestDataV2,
  ...dataV3,
  ...validationTestDataV3,
];
