import { businessV0TestScenarios, businessV1TestScenarios } from './business';
import { v0OauthScenarios, v1OauthScenarios } from './oauth';
import { otherScenariosV1 } from './other';

export const data = [
  ...v0OauthScenarios,
  ...v1OauthScenarios,
  ...businessV0TestScenarios,
  ...businessV1TestScenarios,
  ...otherScenariosV1,
];
