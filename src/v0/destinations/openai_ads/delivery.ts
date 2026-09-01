import {
  retry,
  type DeliveryContext,
  type DeliverySpec,
  type HandleResponseResult,
  type StatusOverrideMap,
} from '../../../services/destination/nativeBatching/batchDestination';

const DEFAULT_ERROR_MESSAGE = 'OpenAI Ads request failed';

type OpenAIAdsError = {
  message?: unknown;
  code?: unknown;
  param?: unknown;
  errors?: unknown;
};

const errorDetails = (error: OpenAIAdsError): string[] =>
  [
    typeof error.code === 'string' ? `code: ${error.code}` : undefined,
    typeof error.param === 'string' ? `param: ${error.param}` : undefined,
  ].filter((detail): detail is string => Boolean(detail));

const formatErrorObject = (error: OpenAIAdsError): string => {
  const message = typeof error.message === 'string' ? error.message : DEFAULT_ERROR_MESSAGE;
  const details = errorDetails(error);
  const nestedErrors = Array.isArray(error.errors)
    ? error.errors
        .filter(
          (item): item is OpenAIAdsError =>
            typeof item === 'object' && item !== null && !Array.isArray(item),
        )
        .map((item) => {
          const itemMessage =
            typeof item.message === 'string' ? item.message : DEFAULT_ERROR_MESSAGE;
          const itemDetails = errorDetails(item);
          return itemDetails.length > 0
            ? `${itemMessage} (${itemDetails.join(', ')})`
            : itemMessage;
        })
    : [];

  const base = details.length > 0 ? `${message} (${details.join(', ')})` : message;
  return [base, ...nestedErrors].join(' | ');
};

const responseToMessage = (response: unknown): string => {
  if (typeof response === 'object' && response !== null && !Array.isArray(response)) {
    const { error } = response as { error?: unknown };
    if (typeof error === 'object' && error !== null && !Array.isArray(error)) {
      return formatErrorObject(error as OpenAIAdsError);
    }
  }
  return DEFAULT_ERROR_MESSAGE;
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
