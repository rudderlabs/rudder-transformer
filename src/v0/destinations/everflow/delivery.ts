import {
  abort,
  type DeliveryContext,
  type DeliverySpec,
  type StatusOverrideMap,
} from '../../../services/destination/destinationIntegration/destinationIntegration';

const everflowFailureReason = ({ response, status }: DeliveryContext): string => {
  let detail = '';
  if (typeof response === 'string') {
    detail = response.trim();
  } else if (Object.keys(response ?? {}).length > 0) {
    detail = JSON.stringify(response);
  }

  return (
    detail ||
    `Everflow rejected the conversion (status ${status}); no error detail returned. Check the Everflow conversion report.`
  );
};

// Everflow answers a rejected conversion with a bodyless 204, which the framework would otherwise
// classify as success along with every other 2xx.
const statusOverrides: StatusOverrideMap = {
  204: (ctx) => abort(everflowFailureReason(ctx)),
};

export const everflowDelivery: DeliverySpec = {
  statusOverrides,
  failureReason: everflowFailureReason,
};
