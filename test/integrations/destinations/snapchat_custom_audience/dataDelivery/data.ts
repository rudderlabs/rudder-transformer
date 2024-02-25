import { businessTestScenarios } from './business';
import { v0OauthScenarios, v1OauthScenarios } from './oauth';

export const data = [ ...v0OauthScenarios, ...v1OauthScenarios, ...businessTestScenarios];