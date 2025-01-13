import { validation } from './validation';
import { identify } from './identify';
import { track } from './track';
export const data = [...identify, ...track, ...validation];
