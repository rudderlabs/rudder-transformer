import { V1BusinessTestScenarion } from './business';
import { v1OauthScenarios } from './oauth';
import { v1OtherScenarios } from './other';
export const data = [...V1BusinessTestScenarion, ...v1OauthScenarios, ...v1OtherScenarios];
