import {
  retry,
  type DeliveryContext,
  type DeliverySpec,
  type HandleResponseResult,
  type StatusOverrideMap,
} from '../../../services/destination/destinationIntegration/destinationIntegration';

const DEFAULT_ERROR_MESSAGE = 'Topsort request failed';

// Topsort returns errors as an array of `{ errCode, docUrl, message }`
// (https://docs.topsort.com/en/api-reference/errors).
type TopsortError = { errCode?: unknown; message?: unknown };

const isTopsortError = (item: unknown): item is TopsortError =>
  typeof item === 'object' && item !== null && !Array.isArray(item);

const formatError = ({ errCode, message }: TopsortError): string | undefined => {
  const parts = [errCode, message].filter((part): part is string => typeof part === 'string');
  return parts.length > 0 ? parts.join(': ') : undefined;
};

const responseToMessage = (response: unknown): string => {
  if (!Array.isArray(response)) {
    return DEFAULT_ERROR_MESSAGE;
  }
  const messages = response
    .filter(isTopsortError)
    .map(formatError)
    .filter((message): message is string => message !== undefined);
  return messages.length > 0 ? messages.join(' | ') : DEFAULT_ERROR_MESSAGE;
};

// The Events API has no per-event results: one invalid event rejects the whole request (e.g.
// `invalid_event_time`: "At least one event is in the future"). Re-send every job on its own so
// only the bad one fails; the framework aborts a job that was already sent alone.
const isolateBatchValidationFailure = (ctx: DeliveryContext): HandleResponseResult =>
  retry(responseToMessage(ctx.response), { dontBatch: true });

const statusOverrides: StatusOverrideMap = {
  400: isolateBatchValidationFailure,
};

export const topsortDelivery: DeliverySpec = {
  statusOverrides,
  failureReason: (ctx) => responseToMessage(ctx.response),
};
