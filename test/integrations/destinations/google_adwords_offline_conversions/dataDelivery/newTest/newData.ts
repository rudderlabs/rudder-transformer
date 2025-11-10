import { v0oauthScenarios, v1oauthScenarios } from './oauth';
import { testScenariosForV0API, testScenariosForV1API } from './business';

export const newData = [
  ...v0oauthScenarios,
  ...v1oauthScenarios,
  ...testScenariosForV0API,
  ...testScenariosForV1API,
];
