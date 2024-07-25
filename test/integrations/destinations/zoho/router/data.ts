import { upsertData } from './upsert';
import { deleteData } from './deletion';

export const data = [...upsertData, ...deleteData];
