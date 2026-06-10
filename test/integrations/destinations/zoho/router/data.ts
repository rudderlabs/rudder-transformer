import { upsertData } from './upsert';
import { deleteDataBatch } from './deletionBatch';
import { identifierEscapingData } from './identifierEscaping';
import { accountTestData } from './account';

export const data = [
  ...upsertData,
  ...deleteDataBatch,
  ...identifierEscapingData,
  ...accountTestData,
];
