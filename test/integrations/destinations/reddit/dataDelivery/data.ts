import { testScenariosForV0API, testScenariosForV1API } from './business';
import { v0oauthScenarios, v1oauthScenarios } from './oauth';

export const data = [
  ...v0oauthScenarios,
  ...v1oauthScenarios,
  ...testScenariosForV0API,
  ...testScenariosForV1API,
];
