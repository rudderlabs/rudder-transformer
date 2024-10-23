import { groupData } from './groupData';
import { identifyData } from './identifyData';
import { trackData } from './trackData';
import { validationData } from './validationData';
export const data = [...identifyData, ...trackData, ...validationData, ...groupData];
