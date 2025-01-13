import { identify } from './identify';
import { track } from './track';
import { validation } from './validation';
export const data = [...identify, ...track, ...validation];
