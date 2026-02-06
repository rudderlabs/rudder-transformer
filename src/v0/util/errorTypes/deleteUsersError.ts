import { BaseError } from '@rudderstack/integrations-lib';

/**
 * DeleteUsersError wraps a BaseError to support separate messages
 * for client response and logging/instrumentation.
 *
 * Use this when the error message contains PII that should not be logged,
 * but needs to be returned to the client for debugging.
 */
export class DeleteUsersError extends BaseError {
  logMessage: string;

  /**
   * @param baseError - The underlying error object
   * @param logMessage - Sanitized message for logging (no PII)
   */
  constructor(baseError: BaseError, logMessage: string) {
    super(
      baseError.message,
      baseError.status,
      baseError.statTags,
      baseError.destinationResponse,
      baseError.authErrorCategory,
    );
    this.logMessage = logMessage;
  }
}
