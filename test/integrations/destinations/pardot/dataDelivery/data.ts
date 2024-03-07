import { businessV0TestScenarios, businessV1TestScenarios } from './business';
import { v1OauthScenarios } from './oauth';
import { otherScenariosV1 } from './other';

export const data = [
  ...v1OauthScenarios,
  ...businessV1TestScenarios,
  ...businessV0TestScenarios,
  ...otherScenariosV1,
];
