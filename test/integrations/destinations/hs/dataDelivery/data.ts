import { businessData } from './business';
import { otherData } from './other';
import { upsertData } from './upsert';

export const data = [...businessData, ...otherData, ...upsertData];
