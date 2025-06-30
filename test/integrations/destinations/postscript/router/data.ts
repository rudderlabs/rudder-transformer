import { identifyTestData } from './identifyTestData';
import { trackTestData } from './trackTestData';
import { mixedEventsTestData } from './mixedEventsTestData';
import { errorHandlingTestData } from './errorHandlingTestData';

export const data = [
  ...identifyTestData,
  ...trackTestData,
  ...mixedEventsTestData,
  ...errorHandlingTestData,
];
