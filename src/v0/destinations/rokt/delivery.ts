import {
  abort,
  success,
  type DeliveryContext,
  type DeliverySpec,
  type StatusOverrideMap,
} from '../../../services/destination/destinationIntegration/destinationIntegration';

const failureReason = ({ status }: DeliveryContext): string =>
  `Rokt rejected the bulk request (status ${status}); no safe error detail returned.`;

const statusOverrides: StatusOverrideMap = {
  202: () => success(),
  '2xx': (ctx) => abort(failureReason(ctx)),
};

export const roktDelivery: DeliverySpec = {
  statusOverrides,
  failureReason,
  failureResponseExposure: 'controlled',
};
