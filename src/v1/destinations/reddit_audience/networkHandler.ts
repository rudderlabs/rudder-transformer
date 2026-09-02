/**
 * Legacy delivery handler for reddit_audience.
 *
 * reddit_audience declares `batching: true` in features.ts, so `delivery.ts`
 * owns every **v1** proxy response. This handler covers what the framework
 * branch does not reach: a **v0** proxy request, which `isProxyV1Request`
 * excludes because the bridge only produces a v1 response. Without it that
 * request would fall to `genericNetworkHandler`, which throws a bare
 * NetworkError with no `authErrorCategory` — for an API-key destination merely
 * worse error messages, but for an OAuth one a 401 aborts the batch and no
 * refresh is ever requested, so the destination dies at the first token expiry.
 *
 * Both halves classify through `../../v0/destinations/reddit_audience/classify`
 * so they cannot drift.
 */
import {
  NetworkError,
  RetryableError,
  ThrottledError,
  TAG_NAMES,
} from '@rudderstack/integrations-lib';
import { prepareProxyRequest, proxyRequest } from '../../../adapters/network';
import { processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { classifyRedditResponse } from '../../../v0/destinations/reddit_audience/classify';

const { REFRESH_TOKEN } = require('../../../adapters/networkhandler/authConstants');

type ResponseParams = {
  destinationResponse: { status: number; response: unknown };
  destType?: string;
};

const responseHandler = (responseParams: ResponseParams) => {
  const { destinationResponse } = responseParams;
  const { status, response } = destinationResponse;
  const verdict = classifyRedditResponse(status, response);

  switch (verdict.kind) {
    case 'success':
      return {
        status,
        message: '[REDDIT_AUDIENCE] Request processed successfully',
        destinationResponse,
      };
    case 'throttled':
      throw new ThrottledError(`[REDDIT_AUDIENCE] ${verdict.message}`, destinationResponse);
    case 'retry':
      throw new RetryableError(
        `[REDDIT_AUDIENCE] ${verdict.message}`,
        status,
        destinationResponse,
        verdict.refreshToken ? REFRESH_TOKEN : '',
      );
    default:
      throw new NetworkError(
        `[REDDIT_AUDIENCE] ${verdict.message}`,
        status,
        { [TAG_NAMES.ERROR_TYPE]: 'aborted' },
        destinationResponse,
      );
  }
};

function networkHandler(this: any) {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

export { networkHandler, responseHandler };
