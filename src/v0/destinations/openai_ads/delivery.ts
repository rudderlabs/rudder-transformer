import {
  retry,
  type DeliveryContext,
  type DeliverySpec,
  type HandleResponseResult,
  type StatusOverrideMap,
} from '../../../services/destination/nativeBatching/batchDestination';

const responseToMessage = (response: unknown): string => {
  if (typeof response === 'string' && response.length > 0) {
    return response;
  }
  if (response && typeof response === 'object') {
    const record = response as Record<string, unknown>;
    const { error } = record;
    if (typeof error === 'string') {
      return error;
    }
    if (error && typeof error === 'object') {
      const { message } = error as Record<string, unknown>;
      if (typeof message === 'string') {
        return message;
      }
    }
    const { message } = record;
    if (typeof message === 'string') {
      return message;
    }
  }
  return 'OpenAI Ads request failed';
};

const isolateBatchValidationFailure = (
  ctx: DeliveryContext,
  fallback: () => HandleResponseResult,
): HandleResponseResult =>
  ctx.jobs.length > 1 ? retry(responseToMessage(ctx.response), { dontBatch: true }) : fallback();

const statusOverrides: StatusOverrideMap = {
  400: isolateBatchValidationFailure,
  422: isolateBatchValidationFailure,
};

export const openAIAdsDelivery: DeliverySpec = {
  statusOverrides,
  failureReason: (ctx) => responseToMessage(ctx.response),
};
