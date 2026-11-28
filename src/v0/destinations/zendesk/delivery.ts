import stats from '../../../util/stats';
import { getDestinationVersion } from '../../../util/utils';
import {
  authExpired,
  type DeliverySpec,
} from '../../../services/destination/destinationIntegration/destinationIntegration';

export const zendeskDelivery: DeliverySpec = {
  statusOverrides: {
    401: (ctx, fallback) => {
      if (getDestinationVersion(ctx.request.destinationVersion) < 2) return fallback();
      stats.counter('zendesk_delivery_auth_expired_count', 1, { destVersion: '2' });
      return authExpired('Zendesk OAuth access token expired');
    },
  },
};
