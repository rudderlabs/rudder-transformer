import type { LiveSpec } from '../../../live/types';
import { buildScenarios } from './scenarios';

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
    ...buildScenarios({ label: 'service-key', configKey: 'serviceKeyAccessToken' }),
  ],
} satisfies LiveSpec;

export default live;
