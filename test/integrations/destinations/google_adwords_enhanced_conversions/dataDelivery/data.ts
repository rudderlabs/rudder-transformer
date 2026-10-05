import { v1oauthScenarios } from './oauth';
import { testScenariosForV1API } from './business';

/**
 * No env var enrols any of these.
 *
 * gaec declares `{ routerTransform: true, batching: true }` in `features.ts`, and `deliver()` gates
 * on the same `isDestinationIntegrationEnabled` that chose the transform half. So every scenario below
 * reaches the framework's v1 delivery path on its own. The destination-specific network handlers
 * and their v0 compatibility scenarios were removed when framework transport became GA.
 * `gaec_v1_scenario_4` mocks a 401 on `uploadConversionAdjustments` and asserts the REFRESH_TOKEN
 * response, while `delivery.test.ts` covers the 403 -> AUTH_STATUS_INACTIVE branch.
 */
export const data = [...v1oauthScenarios, ...testScenariosForV1API];
