import { identifyTestData } from './identifyTestData';
import { trackTestData } from './trackTestData';
import { groupTestData } from './groupTestData';

export const data = [...identifyTestData, ...trackTestData, ...groupTestData];
