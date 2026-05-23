import { BaseStrategy } from '../../iterable/strategies/base';
import { createBatchErrorChecker } from '../../iterable/utils';
import type { GenericProxyHandlerInput } from '../../iterable/types';
import type { IterableAudienceProxyInput, IterableSubscriber } from '../types';
import type { DeliveryJobState, DeliveryV1Response } from '../../../../types';
import { TransformerProxyError } from '../../../../v0/util/errorTypes';
import { getDynamicErrorType } from '../../../../adapters/utils/networkUtils';
import { TAG_NAMES } from '../../../../v0/util/tags';

const stats = require('../../../../util/stats');

const DEST_TYPE = 'ITERABLE_AUDIENCE';
const SUCCESS = 'success';

const UNSUBSCRIBE_ENDPOINT_FRAGMENT = '/api/lists/unsubscribe';

type IdentifierLookups = {
  emails: Set<string>;
  userIds: Set<string>;
};

// Build O(1) lookup sets specifically for the `forgottenEmails` /
// `forgottenUserIds` paths. The existing `createBatchErrorChecker` flags these
// as `isAbortable: true` — but GDPR-forgotten users should be returned as 200
// with a metric (not 400) because they can never be retried successfully.
const buildForgottenLookups = (
  failedUpdates:
    | {
        forgottenEmails?: string[];
        forgottenUserIds?: string[];
      }
    | undefined,
): IdentifierLookups => ({
  emails: new Set((failedUpdates?.forgottenEmails ?? []).map((v) => v.toLowerCase())),
  userIds: new Set(failedUpdates?.forgottenUserIds ?? []),
});

// Same for `notFoundEmails` / `notFoundUserIds` — a no-op success on
// unsubscribe (user was already not on the list), but an error on subscribe.
const buildNotFoundLookups = (
  failedUpdates:
    | {
        notFoundEmails?: string[];
        notFoundUserIds?: string[];
      }
    | undefined,
): IdentifierLookups => ({
  emails: new Set((failedUpdates?.notFoundEmails ?? []).map((v) => v.toLowerCase())),
  userIds: new Set(failedUpdates?.notFoundUserIds ?? []),
});

const matchesIdentifier = (subscriber: IterableSubscriber, lookups: IdentifierLookups): boolean => {
  if ('email' in subscriber) {
    // Iterable lowercases emails server-side; same case-folding applied on the
    // request side, so what we sent matches what we look up here.
    return lookups.emails.has(subscriber.email.toLowerCase());
  }
  return lookups.userIds.has(subscriber.userId);
};

class AudienceListStrategy extends BaseStrategy {
  handleSuccess(responseParams: IterableAudienceProxyInput): DeliveryV1Response {
    const { destinationResponse, rudderJobMetadata, destinationRequest } = responseParams;
    const { status } = destinationResponse;
    const failedUpdates = destinationResponse.response?.failedUpdates;

    const requestBody = destinationRequest?.body?.JSON;
    const subscribers: IterableSubscriber[] = requestBody?.subscribers ?? [];

    const isUnsubscribe = (destinationRequest?.endpoint ?? '').includes(
      UNSUBSCRIBE_ENDPOINT_FRAGMENT,
    );
    const checkEventError = createBatchErrorChecker(destinationResponse);
    const forgottenLookups = buildForgottenLookups(failedUpdates);
    const notFoundLookups = buildNotFoundLookups(failedUpdates);

    const destinationId = rudderJobMetadata[0]?.destinationId ?? '';
    const workspaceId = rudderJobMetadata[0]?.workspaceId ?? '';

    const response: DeliveryJobState[] = subscribers.map((subscriber, idx) => {
      const metadata = rudderJobMetadata[idx];
      const identifierType: 'email' | 'userId' = 'email' in subscriber ? 'email' : 'userId';
      const eventForCheck = {
        email: 'email' in subscriber ? subscriber.email.toLowerCase() : undefined,
        userId: 'userId' in subscriber ? subscriber.userId : undefined,
      };

      // 1. GDPR-forgotten user → success + metric.
      if (matchesIdentifier(subscriber, forgottenLookups)) {
        stats.counter('iterable_forgotten_user_violations', 1, {
          destType: DEST_TYPE,
          destinationId,
          workspaceId,
          identifierType,
          // NEVER tag the identifier VALUE — it is GDPR-protected.
        });
        return { statusCode: 200, metadata, error: SUCCESS };
      }

      // 2. notFound on unsubscribe → no-op success.
      if (isUnsubscribe && matchesIdentifier(subscriber, notFoundLookups)) {
        return { statusCode: 200, metadata, error: SUCCESS };
      }

      // 3. Delegate everything else to the shared abortability check.
      const { isAbortable, errorMsg } = checkEventError(eventForCheck);
      if (isAbortable) {
        return { statusCode: 400, metadata, error: errorMsg };
      }
      return { statusCode: 200, metadata, error: SUCCESS };
    });

    return {
      status,
      message: '[ITERABLE_AUDIENCE Response Handler] - Request Processed Successfully',
      destinationResponse,
      response,
    };
  }

  handleError(responseParams: GenericProxyHandlerInput): void {
    const { destinationResponse, rudderJobMetadata } = responseParams;
    const { response, status } = destinationResponse;
    const responseMessage = response?.params ?? response?.msg ?? response?.message;
    const errorMessage = JSON.stringify(responseMessage) || 'unknown error format';

    const responseWithIndividualEvents = rudderJobMetadata.map((metadata) => ({
      statusCode: status,
      metadata,
      error: errorMessage,
    }));

    // On 401 (bad / revoked API key) set AuthErrorCategory: 'AUTH' so the
    // downstream platform layer can flag the destination. Auto-disable on
    // persistent 401 is out of M1 scope (see concerns.md).
    const authErrorCategory = status === 401 ? 'AUTH' : '';

    throw new TransformerProxyError(
      `ITERABLE_AUDIENCE: Error transformer proxy during ITERABLE_AUDIENCE response transformation. ${errorMessage}`,
      status,
      { [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status) },
      destinationResponse,
      authErrorCategory,
      responseWithIndividualEvents,
    );
  }
}

export { AudienceListStrategy };
