import { testScenariosForV0API, testScenariosForV1API } from './business';
import { v0oauthScenarios, v1oauthScenarios } from './oauth';
import { otherScenariosV0, otherScenariosV1 } from './other';

export const data = [
  ...testScenariosForV0API,
  ...testScenariosForV1API,
  ...v0oauthScenarios,
  ...v1oauthScenarios,
  ...otherScenariosV0,
  ...otherScenariosV1,
];
