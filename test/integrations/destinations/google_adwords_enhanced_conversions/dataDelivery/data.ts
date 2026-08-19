import { v0oauthScenarios, v1oauthScenarios } from './oauth';
import { testScenariosForV0API, testScenariosForV1API } from './business';
import { EnvOverride } from '../../../envUtils';

/**
 * Only the delivery flag is load-bearing here.
 *
 * gaec is already **GA** for the batching framework's transform path — `features.ts` declares
 * `{ routerTransform: true, batching: true }` and `getBatchingFrameworkGaDestinations()` reads
 * `batching`, so `isBatchingFrameworkEnabled` returns true before any env var is consulted.
 * Setting `GOOGLE_ADWORDS_ENHANCED_CONVERSIONS_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS` would do
 * nothing; a pre-GA destination is the one that needs it, because
 * `isBatchingFrameworkDeliveryEnabled` short-circuits on the transform flag.
 *
 * Applied to the v0 scenarios harmlessly: the framework branch is guarded on the request carrying
 * a metadata *array*, which only the v1 proxy route produces, so those stay on the legacy handler
 * and continue to assert its behaviour — which is itself the assertion that the shape guard works.
 */
const batchingFrameworkDelivery = {
  GOOGLE_ADWORDS_ENHANCED_CONVERSIONS_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS: 'ALL',
};

/**
 * The oauth scenarios are deliberately **not** enrolled.
 *
 * Every one of them makes `gaecProxyRequest` throw inside `getConversionActionId`
 * (`networkHandler.ts`) — the mocked 401/403 sit on `googleAds:searchStream`, which runs before the
 * upload — so the delivery branch is never reached and they assert the legacy handler's
 * `'... during Google_adwords_enhanced_conversions response transformation'` message either way.
 * Enrolling them would advertise coverage of the framework's auth path that does not exist.
 *
 * That path is covered where it can actually be reached: `gaec_v1_scenario_4` mocks a 401 on
 * `uploadConversionAdjustments` and asserts the framework's REFRESH_TOKEN response, and
 * `delivery.test.ts` covers the 403 -> AUTH_STATUS_INACTIVE branch against the legacy handler.
 */
const withDeliveryFlag = <T>(scenario: T) => ({
  ...scenario,
  envOverrides: {
    ...(scenario as { envOverrides?: EnvOverride }).envOverrides,
    ...batchingFrameworkDelivery,
  },
});

export const data = [
  ...v0oauthScenarios,
  ...v1oauthScenarios,
  ...[...testScenariosForV0API, ...testScenariosForV1API].map(withDeliveryFlag),
];
