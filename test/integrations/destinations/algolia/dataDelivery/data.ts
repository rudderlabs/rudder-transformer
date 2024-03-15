import { testScenariosForV0API, testScenariosForV1API } from './business';
import { otherScenariosV0, otherScenariosV1 } from './other';

export const data = [
  ...testScenariosForV0API,
  ...testScenariosForV1API,
  ...otherScenariosV0,
  ...otherScenariosV1,
];
