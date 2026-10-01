import { unescape } from 'lodash';
import {
  abort,
  retry,
  success,
  type DeliveryContext,
  type DeliverySpec,
  type StatusOverrideMap,
} from '../../../services/destination/destinationIntegration/destinationIntegration';

type RoktErrorDetails = {
  count: number;
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

  const messages = response.errors.flatMap((error) => {
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
    return [`${error.code} - ${unescape(error.message)}`];
  });

  return {
    count: response.errors.length,
    message: messages.join('; ') || 'Rokt returned no recognized error details.',
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

const completeFailureReason = (ctx: DeliveryContext, errors: RoktErrorDetails): string =>
  `Rokt rejected all ${ctx.jobs.length} events: ${errors.message}`;

const statusOverrides: StatusOverrideMap = {
  202: (ctx) => {
    const errors = parseRoktErrors(ctx);

    if (errors) {
      if (errors.count < ctx.jobs.length) {
        return retry(partialFailureReason(ctx, errors), { dontBatch: true });
      }
      if (errors.count === ctx.jobs.length) {
        return abort(completeFailureReason(ctx, errors));
      }
    }

    return success();
  },
};

export const roktDelivery: DeliverySpec = {
  statusOverrides,
  failureReason,
};
