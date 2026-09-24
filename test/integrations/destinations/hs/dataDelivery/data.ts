import { businessData } from './business';
import { otherData } from './other';
import { silentFailureData } from './silentFailure';
import { upsertData } from './upsert';
import { updateMultiStatusData } from './updateMultiStatus';

export const data = [
  ...businessData,
  ...otherData,
  ...silentFailureData,
  ...upsertData,
  ...updateMultiStatusData,
];
