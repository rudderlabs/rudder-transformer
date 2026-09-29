import { ConfigurationError } from '@rudderstack/integrations-lib';
import {
  abort,
  success,
  type DeliveryContext,
  type DeliverySpec,
  type StatusOverrideMap,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import { JSON_MIME_TYPE } from '../../util/constant';
import { resolveEndpoint } from './utils';

const failureReason = ({ status }: DeliveryContext): string =>
  `mParticle rejected the bulk request (status ${status}); no safe error detail returned.`;

const statusOverrides: StatusOverrideMap = {
  202: () => success(),
  '2xx': (ctx) => abort(failureReason(ctx)),
};

export const roktDelivery: DeliverySpec = {
  statusOverrides,
  failureReason,
  failureResponseExposure: 'controlled',
  prepareRequest: (request, ctx) => {
    const { apiEndpoint, serverToServerKey, serverToServerSecret } = ctx.destinationConfig;
    if (typeof apiEndpoint !== 'string' || request.endpoint !== resolveEndpoint(apiEndpoint)) {
      throw new ConfigurationError('ROKT delivery endpoint does not match the configured endpoint');
    }
    if (
      typeof serverToServerKey !== 'string' ||
      serverToServerKey.trim() === '' ||
      typeof serverToServerSecret !== 'string' ||
      serverToServerSecret.trim() === ''
    ) {
      throw new ConfigurationError('ROKT delivery credentials are not configured');
    }
    return {
      ...request,
      headers: {
        ...request.headers,
        Authorization: `Basic ${Buffer.from(`${serverToServerKey}:${serverToServerSecret}`).toString('base64')}`,
        'Content-Type': JSON_MIME_TYPE,
      },
    };
  },
};
