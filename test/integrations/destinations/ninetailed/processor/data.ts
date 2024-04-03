import { validationFailures } from './validation';
import { track } from './track';
import { page } from './page';
import { identify } from './identify';
export const data = [...identify, ...page, ...track, ...validationFailures];
