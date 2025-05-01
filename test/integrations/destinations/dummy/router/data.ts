import { batched } from './batched';
import { nonBatched } from './nonBatched';

export const data = [...nonBatched, ...batched];
