import { otherScenariosV0, otherScenariosV1 } from './other';
import { testScenariosForV0API, testScenariosForV1API } from './business';

export const data = [
  ...otherScenariosV0,
  ...otherScenariosV1,
  ...testScenariosForV0API,
  ...testScenariosForV1API,
];
