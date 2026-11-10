import axios from 'axios';
import { Agent } from 'https';
import { requiredResourceId } from '../../live/requiredFields';
import type { LiveSpec, RunContext } from '../../live/types';

const DEST = 'everflow';
const CLICK_RESOURCE = 'everflow-click';
// keepAlive:false so the click socket doesn't linger as an open handle.
const agent = new Agent({ keepAlive: false });

// A stored transaction_id stops converting once its click ages past the offer's attribution
// window, so mint a fresh click every run via the tracking domain's JS SDK click endpoint.
const mintClick = async (ctx: RunContext): Promise<void> => {
  const { origin } = new URL(String(ctx.liveSecret.config.postbackUrl));
  const { data } = await axios.get<{ transaction_id?: string }>(`${origin}/sdk/click`, {
    params: {
      oid: requiredResourceId(ctx.liveSecret, DEST, 'offerId', 'the test offer id (oid)'),
      affid: requiredResourceId(
        ctx.liveSecret,
        DEST,
        'affiliateId',
        'a partner id (affid) with access to the offer',
      ),
      async: 'json',
    },
    httpsAgent: agent,
  });
  if (!data.transaction_id) {
    throw new Error(
      'Everflow returned no transaction_id - check resourceIds.offerId/affiliateId in LIVE_SECRET_EVERFLOW',
    );
  }
  ctx.register({ type: CLICK_RESOURCE, id: data.transaction_id });
};

const transactionId = (ctx: RunContext): string => {
  const click = ctx.resources.find((resource) => resource.type === CLICK_RESOURCE);
  if (!click) {
    throw new Error('no Everflow click minted - run the "mint click" action first');
  }
  return click.id;
};

const trackEvent = (ctx: RunContext, id: string, suffix: string) => ({
  type: 'track',
  messageId: `${ctx.runId}-${suffix}`,
  timestamp: ctx.now(),
  integrations: { All: true },
  properties: { transactionId: id },
});

export const live = {
  enabled: true,
  authType: 'apiKey',
  resolveConfig: (secret) => ({ ...secret.config }),
  scenarios: [
    {
      id: 'everflow-track-conversion',
      description: 'A track event delivers one Everflow Advertiser S2S conversion',
      steps: [
        { stepType: 'action', name: 'mint click', run: mintClick },
        {
          stepType: 'pipeline',
          name: 'deliver conversion',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => trackEvent(ctx, transactionId(ctx), 'conversion'),
        },
      ],
    },
    {
      id: 'everflow-random-transaction-rejected',
      description: 'A random transaction ID exercises Everflow HTTP 204 rejection handling',
      steps: [
        {
          stepType: 'pipeline',
          name: 'reject random transaction ID',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          expectedFailure: { items: [0] },
          seed: (ctx) => trackEvent(ctx, ctx.identity('random-transaction'), 'random-transaction'),
        },
      ],
    },
  ],
} satisfies LiveSpec;

export default live;
