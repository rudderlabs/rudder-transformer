import {
  retry,
  type DeliveryContext,
  type DeliverySpec,
  type HandleResponseResult,
  type StatusOverrideMap,
} from '../../../services/destination/nativeBatching/batchDestination';

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;

const formatErrorObject = (error: Record<string, unknown>): string | undefined => {
  const message = typeof error.message === 'string' ? error.message : undefined;
  if (!message) return undefined;

  const details = [
    typeof error.code === 'string' ? `code: ${error.code}` : undefined,
    typeof error.param === 'string' ? `param: ${error.param}` : undefined,
  ].filter(Boolean);
  const nestedErrors = Array.isArray(error.errors)
    ? error.errors
        .map(asRecord)
        .filter((item): item is Record<string, unknown> => Boolean(item))
        .map((item) => {
          const itemMessage = typeof item.message === 'string' ? item.message : undefined;
          if (!itemMessage) return undefined;
          const itemDetails = [
            typeof item.code === 'string' ? `code: ${item.code}` : undefined,
            typeof item.param === 'string' ? `param: ${item.param}` : undefined,
          ].filter(Boolean);
          return itemDetails.length > 0
            ? `${itemMessage} (${itemDetails.join(', ')})`
            : itemMessage;
        })
        .filter(Boolean)
    : [];

  const base = details.length > 0 ? `${message} (${details.join(', ')})` : message;
  return [base, ...nestedErrors].join(' | ');
};

const responseToMessage = (response: unknown): string => {
  if (typeof response === 'string' && response.length > 0) {
    return response;
  }
  const record = asRecord(response);
  if (record) {
    const { error } = record;
    if (typeof error === 'string') {
      return error;
    }
    const errorRecord = asRecord(error);
    const errorMessage = errorRecord ? formatErrorObject(errorRecord) : undefined;
    if (errorMessage) {
      return errorMessage;
    }
    const { message } = record;
    if (typeof message === 'string') {
      return message;
    }
  }
  return 'OpenAI Ads request failed';
};

const isolateBatchValidationFailure = (ctx: DeliveryContext): HandleResponseResult =>
  retry(responseToMessage(ctx.response), { dontBatch: true });

const statusOverrides: StatusOverrideMap = {
  400: isolateBatchValidationFailure,
  422: isolateBatchValidationFailure,
};

export const openAIAdsDelivery: DeliverySpec = {
  statusOverrides,
  failureReason: (ctx) => responseToMessage(ctx.response),
};
