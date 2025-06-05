import { upsertData } from './upsert';
import { deleteData } from './deletion';
import { accountTestData } from './account';

export const data = [...upsertData, ...deleteData, ...accountTestData];
