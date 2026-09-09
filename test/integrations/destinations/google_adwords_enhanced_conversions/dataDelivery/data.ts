import { v0oauthScenarios, v1oauthScenarios } from './oauth';
import { testScenariosForV0API, testScenariosForV1API } from './business';

/**
 * No env var enrols any of these.
 *
 * gaec declares `{ routerTransform: true, batching: true }` in `features.ts`, and `deliver()` gates
 * on the same `isDestinationIntegrationEnabled` that chose the transform half. So every scenario below
 * reaches the framework's delivery path on its own — except where one of two guards keeps it on the
 * legacy handler, and each of those exceptions is itself worth asserting:
 *
 *  - **The v0 scenarios.** The framework branch is guarded on the request carrying a metadata
 *    *array*, which only the v1 proxy route produces. They continue to assert the legacy handler's
 *    behaviour, which is the assertion that the shape guard works.
 *  - **The oauth scenarios.** Every one of them makes `gaecProxyRequest` throw inside
 *    `getConversionActionId` (`networkHandler.ts`) — the mocked 401/403 sit on
 *    `googleAds:searchStream`, which runs before the upload — so delivery is never reached and they
 *    assert the legacy `'... during Google_adwords_enhanced_conversions response transformation'`
 *    message. The framework's auth path is covered where it can actually be reached:
 *    `gaec_v1_scenario_4` mocks a 401 on `uploadConversionAdjustments` and asserts the REFRESH_TOKEN
 *    response, and `delivery.test.ts` covers the 403 -> AUTH_STATUS_INACTIVE branch.
 */
export const data = [
  ...v0oauthScenarios,
  ...v1oauthScenarios,
  ...testScenariosForV0API,
  ...testScenariosForV1API,
];
