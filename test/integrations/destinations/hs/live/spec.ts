import type { LiveSpec } from '../../../live/types';
import { buildScenarios } from './scenarios';

const hasServiceKeyAccessToken = (): boolean => {
  try {
    const secret: unknown = JSON.parse(process.env.LIVE_SECRET_HS ?? '{}');
    if (typeof secret !== 'object' || secret === null || !('config' in secret)) {
      return false;
    }
    const { config } = secret;
    if (typeof config !== 'object' || config === null || !('serviceKeyAccessToken' in config)) {
      return false;
    }
    return (
      typeof config.serviceKeyAccessToken === 'string' && config.serviceKeyAccessToken.length > 0
    );
  } catch {
    return false;
  }
};

const serviceKeyConfigured = hasServiceKeyAccessToken();
if (!serviceKeyConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    '[live:hs] Skipping service-key scenarios: LIVE_SECRET_HS.config.serviceKeyAccessToken is not configured.',
  );
}

const serviceKeyScenarios = buildScenarios({
  label: 'service-key',
  configKey: 'serviceKeyAccessToken',
}).map((scenario) => ({ ...scenario, enabled: serviceKeyConfigured }));

export const live = {
  enabled: true,
  authType: 'apiKey',
  resolveConfig: (s) => ({
    authorizationType: 'newPrivateAppApi',
    apiVersion: 'newApi',
    lookupField: 'email',
    ...s.config,
  }),
  scenarios: [
    ...buildScenarios({ label: 'private-app', configKey: 'accessToken' }),
    ...serviceKeyScenarios,
  ],
} satisfies LiveSpec;

export default live;
