import { unescape } from 'lodash';
import {
  perItem,
  retry,
  success,
  type DeliveryContext,
  type DeliverySpec,
  type StatusOverrideMap,
} from '../../../services/destination/destinationIntegration/destinationIntegration';

type RoktError = {
  message: string;
};

type RoktErrorDetails = {
  count: number;
  errors: RoktError[];
  message: string;
};

const parseRoktErrors = ({ response }: DeliveryContext): RoktErrorDetails | undefined => {
  if (
    typeof response !== 'object' ||
    response === null ||
    !('errors' in response) ||
    !Array.isArray(response.errors) ||
    response.errors.length === 0
  ) {
    return undefined;
  }

  const errors = response.errors.flatMap((error): RoktError[] => {
    if (
      typeof error !== 'object' ||
      error === null ||
      !('code' in error) ||
      typeof error.code !== 'string' ||
      !('message' in error) ||
      typeof error.message !== 'string'
    ) {
      return [];
    }
    return [{ message: `${error.code} - ${unescape(error.message)}` }];
  });

  return {
    count: response.errors.length,
    errors,
    message:
      errors.map(({ message }) => message).join('; ') ||
      'Rokt returned no recognized error details.',
  };
};

const failureReason = (ctx: DeliveryContext): string => {
  const prefix = `Rokt rejected the bulk request (status ${ctx.status})`;
  const errorDetails = parseRoktErrors(ctx);
  if (errorDetails) {
    return `${prefix}: ${errorDetails.message}`;
  }
  if (ctx.status === 401) {
    return `${prefix}: no credentials were sent.`;
  }
  if (ctx.status === 403) {
    return `${prefix}: the Server-to-Server key/secret were rejected; check the destination credentials.`;
  }
  return `${prefix}: Rokt returned no recognized error details.`;
};

const partialFailureReason = (ctx: DeliveryContext, errors: RoktErrorDetails): string =>
  `Rokt rejected ${errors.count} of ${ctx.jobs.length} events (${errors.message}); ` +
  'retrying each event individually.';

const failedEventReason = ({ message }: RoktError): string =>
  `Rokt rejected this event: ${message}; retrying it individually.`;

type BatchSpan = {
  start: number;
  end: number;
};

const getBatchSpans = (ctx: DeliveryContext): BatchSpan[] | undefined => {
  const serializedBatch = ctx.request.body?.JSON_ARRAY?.batch;
  if (typeof serializedBatch !== 'string') {
    return undefined;
  }

  try {
    const parsed: unknown = JSON.parse(serializedBatch);
    if (!Array.isArray(parsed) || parsed.length !== ctx.jobs.length) {
      return undefined;
    }

    const serializedItems = parsed
      .map((item) => JSON.stringify(item))
      .filter((item): item is string => item !== undefined);
    if (serializedItems.length !== parsed.length) {
      return undefined;
    }
    if (`[${serializedItems.join(',')}]` !== serializedBatch) {
      return undefined;
    }

    let start = 1;
    return serializedItems.map((item) => {
      const span = { start, end: start + item.length - 1 };
      start = span.end + 2;
      return span;
    });
  } catch {
    return undefined;
  }
};

const getFailedBatchIndex = (
  error: RoktError,
  jobCount: number,
  spans: BatchSpan[] | undefined,
): number | undefined => {
  const pathIndex = /Path '\[(\d+)]/.exec(error.message)?.[1];
  if (pathIndex !== undefined) {
    const index = Number(pathIndex);
    return Number.isSafeInteger(index) && index < jobCount ? index : undefined;
  }

  const position = /\bposition\s+(\d+)\b/i.exec(error.message)?.[1];
  if (position === undefined || !spans) {
    return undefined;
  }

  const offset = Number(position) - 1;
  const index = spans.findIndex(({ start, end }) => offset >= start && offset <= end);
  return index >= 0 ? index : undefined;
};

const getPerItemVerdicts = (ctx: DeliveryContext, errorDetails: RoktErrorDetails) => {
  if (errorDetails.errors.length !== errorDetails.count) {
    return undefined;
  }

  const spans = getBatchSpans(ctx);
  const errorsByBatch = new Map<number, RoktError[]>();
  for (const error of errorDetails.errors) {
    const index = getFailedBatchIndex(error, ctx.jobs.length, spans);
    if (typeof index !== 'number') {
      return undefined;
    }
    const existingErrors = errorsByBatch.get(index);
    errorsByBatch.set(index, [...(existingErrors ?? []), error]);
  }

  return perItem(
    ctx.jobs.map((_job, index) => {
      const errors = errorsByBatch.get(index);
      if (!errors) {
        return success();
      }
      return retry(errors.map((error) => failedEventReason(error)).join(' '), { dontBatch: true });
    }),
  );
};

const statusOverrides: StatusOverrideMap = {
  202: (ctx) => {
    const errors = parseRoktErrors(ctx);

    if (errors) {
      const verdicts = getPerItemVerdicts(ctx, errors);
      if (verdicts) {
        return verdicts;
      }
      return retry(partialFailureReason(ctx, errors), { dontBatch: true });
    }

    return success();
  },
};

export const roktDelivery: DeliverySpec = {
  statusOverrides,
  failureReason,
};
