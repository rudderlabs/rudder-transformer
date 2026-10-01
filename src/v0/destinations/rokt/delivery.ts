import {
  abort,
  retry,
  success,
  type DeliveryContext,
  type DeliverySpec,
  type StatusOverrideMap,
} from '../../../services/destination/destinationIntegration/destinationIntegration';

const failureReason = ({ status }: DeliveryContext): string =>
  `Rokt rejected the bulk request (status ${status}); no safe error detail returned.`;

const partialFailureReason =
  'Rokt partially rejected the bulk request; retrying each event individually.';
const completeFailureReason = 'Rokt rejected every event in the bulk request.';

const statusOverrides: StatusOverrideMap = {
  202: (ctx) => {
    const errors =
      typeof ctx.response === 'object' && ctx.response !== null && 'errors' in ctx.response
        ? ctx.response.errors
        : undefined;

    if (Array.isArray(errors) && errors.length > 0) {
      if (errors.length < ctx.jobs.length) {
        return retry(partialFailureReason, { dontBatch: true });
      }
      if (errors.length === ctx.jobs.length) {
        return abort(completeFailureReason);
      }
    }

    return success();
  },
};

export const roktDelivery: DeliverySpec = {
  statusOverrides,
  failureReason,
};
