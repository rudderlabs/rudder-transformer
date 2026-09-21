import {
  abort,
  perItem,
  type DeliveryContext,
  type DeliverySpec,
  type ItemVerdict,
  type StatusOverrideMap,
} from '../../../services/destination/destinationIntegration/destinationIntegration';

const everflowFailureReason = (ctx: DeliveryContext): string => {
  const raw = ctx.response;
  const text = typeof raw === 'string' ? raw.trim() : raw;
  const hasBody =
    typeof text === 'string'
      ? text.length > 0
      : text !== null &&
        text !== undefined &&
        typeof text === 'object' &&
        Object.keys(text).length > 0;

  if (hasBody) {
    return typeof text === 'string' ? text : JSON.stringify(text);
  }

  return `Everflow rejected the conversion (status ${ctx.status}); no error detail returned. Check the Everflow conversion report.`;
};

const allJobs = (ctx: DeliveryContext, verdict: ItemVerdict) =>
  perItem(ctx.jobs.map(() => verdict));

const statusOverrides: StatusOverrideMap = {
  204: (ctx) => allJobs(ctx, abort(everflowFailureReason(ctx))),
};

export const everflowDelivery: DeliverySpec = {
  statusOverrides,
  failureReason: everflowFailureReason,
};
