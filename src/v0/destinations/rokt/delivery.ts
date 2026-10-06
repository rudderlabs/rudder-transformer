import { unescape } from 'lodash';
import { z } from 'zod';
import {
  perItem,
  retry,
  success,
  type DeliveryContext,
  type DeliverySpec,
  type StatusOverrideMap,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import { serializeRoktBatches } from './utils';

const RoktErrorsResponseSchema = z.object({ errors: z.array(z.unknown()).nonempty() });
const RoktErrorSchema = z.object({ code: z.string(), message: z.string() });

type RoktErrorDetails = {
  // Every entry in `errors`, including ones without a recognizable code/message.
  count: number;
  errors: string[];
  message: string;
};

const parseRoktErrors = ({ response }: DeliveryContext): RoktErrorDetails | undefined => {
  const parsed = RoktErrorsResponseSchema.safeParse(response);
  if (!parsed.success) {
    return undefined;
  }

  const errors = parsed.data.errors.flatMap((error) => {
    const result = RoktErrorSchema.safeParse(error);
    return result.success ? [`${result.data.code} - ${unescape(result.data.message)}`] : [];
  });

  return {
    count: parsed.data.errors.length,
    errors,
    message: errors.join('; ') || 'Rokt returned no recognized error details.',
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

const failedEventReason = (error: string): string =>
  `Rokt rejected this event: ${error}; retrying it individually.`;

type BatchSpan = {
  start: number;
  end: number;
};

const getBatchSpans = (ctx: DeliveryContext): BatchSpan[] | undefined => {
  const serializedBatch = ctx.request.body?.JSON_ARRAY?.batch;
  if (typeof serializedBatch !== 'string') {
    return undefined;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(serializedBatch);
  } catch {
    return undefined;
  }
  if (
    !Array.isArray(parsed) ||
    parsed.length !== ctx.jobs.length ||
    serializeRoktBatches(parsed) !== serializedBatch
  ) {
    return undefined;
  }

  // The batch is `[` + items joined by `,` + `]`, so each item's span follows from its length.
  let start = 1;
  return parsed.map((item) => {
    const end = start + JSON.stringify(item).length - 1;
    const span = { start, end };
    start = end + 2;
    return span;
  });
};

const getFailedBatchIndex = (
  error: string,
  jobCount: number,
  spans: BatchSpan[] | undefined,
): number | undefined => {
  const pathIndex = /Path '\[(\d+)]/.exec(error)?.[1];
  if (pathIndex !== undefined) {
    const index = Number(pathIndex);
    return index < jobCount ? index : undefined;
  }

  const position = /\bposition\s+(\d+)\b/i.exec(error)?.[1];
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
  const errorsByBatch = new Map<number, string[]>();
  for (const error of errorDetails.errors) {
    const index = getFailedBatchIndex(error, ctx.jobs.length, spans);
    if (typeof index !== 'number') {
      return undefined;
    }
    const batchErrors = errorsByBatch.get(index) ?? [];
    batchErrors.push(error);
    errorsByBatch.set(index, batchErrors);
  }

  return perItem(
    ctx.jobs.map((_job, index) => {
      const errors = errorsByBatch.get(index);
      if (!errors) {
        return success();
      }
      return retry(errors.map(failedEventReason).join(' '), { dontBatch: true });
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
