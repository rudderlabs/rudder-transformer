import { validation } from './validation';
import { identify } from './identify';
import { track } from './track';
import { page } from './page';
export const data = [...identify, ...track, ...page, ...validation];
