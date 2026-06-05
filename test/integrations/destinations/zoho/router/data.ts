import { upsertData } from './upsert';
import { deleteData } from './deletion';
import { deleteDataBatch } from './deletionBatch';
import { identifierEscapingData } from './identifierEscaping';
import { accountTestData } from './account';

export const data = [
  ...upsertData,
  ...deleteData,
  ...deleteDataBatch,
  ...identifierEscapingData,
  ...accountTestData,
];
