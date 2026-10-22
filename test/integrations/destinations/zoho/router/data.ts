import { upsertData } from './upsert';
import { deleteDataBatch } from './deletionBatch';
import { identifierEscapingData } from './identifierEscaping';
import { accountTestData } from './account';
import { concurrentSyncsData } from './concurrentSyncs';

export const data = [
  ...upsertData,
  ...deleteDataBatch,
  ...identifierEscapingData,
  ...accountTestData,
  ...concurrentSyncsData,
];
