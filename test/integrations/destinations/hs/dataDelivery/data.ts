import { businessData } from './business';
import { otherData } from './other';
import { silentFailureData } from './silentFailure';
import { upsertData } from './upsert';

export const data = [...businessData, ...otherData, ...silentFailureData, ...upsertData];
