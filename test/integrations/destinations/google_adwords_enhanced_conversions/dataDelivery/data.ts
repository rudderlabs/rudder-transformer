import { v0oauthScenarios, v1oauthScenarios } from './oauth';
import { testScenariosForV0API, testScenariosForV1API } from './business';
import { EnvOverride } from '../../../envUtils';

/**
 * gaec is not GA for the batching framework, so the transform flag has to be set alongside the
 * delivery one — `isBatchingFrameworkDeliveryEnabled` returns false without it.
 *
 * Applied to the v0 scenarios too, harmlessly: the framework branch is guarded on the request
 * carrying a metadata *array*, which only the v1 proxy route produces, so those stay on the legacy
 * handler and continue to assert its behaviour.
 */
const batchingFrameworkDelivery = {
  GOOGLE_ADWORDS_ENHANCED_CONVERSIONS_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS: 'ALL',
  GOOGLE_ADWORDS_ENHANCED_CONVERSIONS_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS: 'ALL',
};

export const data = [
  ...v0oauthScenarios,
  ...v1oauthScenarios,
  ...testScenariosForV0API,
  ...testScenariosForV1API,
].map((scenario) => ({
  ...scenario,
  envOverrides: {
    ...(scenario as { envOverrides?: EnvOverride }).envOverrides,
    ...batchingFrameworkDelivery,
  },
}));
