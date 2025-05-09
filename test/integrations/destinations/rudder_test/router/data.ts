import { batched } from './batched';
import { nonBatched } from './nonBatched';

export const data = [...batched, ...nonBatched];
