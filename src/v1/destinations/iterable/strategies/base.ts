import { isHttpStatusSuccess } from '../../../../v0/util';
import { GenericProxyHandlerInput } from '../types';

// Base strategy is the base class for all strategies in Iterable destination
abstract class BaseStrategy {
  handleResponse(responseParams: GenericProxyHandlerInput): void {
    const { destinationResponse } = responseParams;
    const { status } = destinationResponse;

    if (!isHttpStatusSuccess(status)) {
      return this.handleError(responseParams);
    }

    return this.handleSuccess(responseParams);
  }

  abstract handleError(responseParams: GenericProxyHandlerInput): void;

  abstract handleSuccess(responseParams: any): void;
}

export { BaseStrategy };
