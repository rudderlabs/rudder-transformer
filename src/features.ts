import {
  getRegulationDestinations,
  getRouterTransformDestinations,
} from './constants/destinationCanonicalNames';

interface FeaturesConfig {
  routerTransform: Record<string, boolean>;
  regulations: string[];
  supportSourceTransformV1: true;
  supportTransformerProxyV1: true;
  upgradedToSourceTransformV2: true;
  supportDestTransformCompactedPayloadV1: true;
}

const defaultFeaturesConfig: FeaturesConfig = {
  routerTransform: getRouterTransformDestinations(),
  regulations: getRegulationDestinations(),
  supportSourceTransformV1: true,
  supportTransformerProxyV1: true,
  upgradedToSourceTransformV2: true,
  supportDestTransformCompactedPayloadV1: true,
};

export default defaultFeaturesConfig;
