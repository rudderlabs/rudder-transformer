import { upsertData } from './upsert';
import { deleteData } from './deletion';
import { accountData } from './account';

export const data = [...upsertData, ...deleteData, ...accountData];
