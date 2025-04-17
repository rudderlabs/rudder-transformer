import { removeUndefinedValues } from '@rudderstack/integrations-lib';
import logger from '../../../logger';
import { httpSend, getPayloadData, getFormData } from '../../../adapters/network';
import { processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { ResponseParams, ResponseObject } from '../../../types';
import { isHttpStatusSuccess } from '../../../v0/util';
import { DESTINATION } from '../../../v0/destinations/mp/config';
import {
  createSuccessResponse,
  handleNonSuccessResponse,
  handleEndpointSpecificResponses,
  getZippedPayload,
} from './utils';
import { PrepareProxyResponse } from './types';

/**
 * Main response handler that delegates to specific endpoint handlers
 * Implements partial failure handling for batch requests in v1 proxy
 *
 * @param responseParams - The response parameters
 * @returns The processed response
 */
const responseHandler = (responseParams: ResponseParams): ResponseObject => {
  // Ensure rudderJobMetadata is an array
  const rudderJobMetadata = Array.isArray(responseParams.rudderJobMetadata)
    ? responseParams.rudderJobMetadata
    : [responseParams.rudderJobMetadata];
  const { destinationResponse, destinationRequest } = responseParams;
  const message = `Request for ${DESTINATION} Processed Successfully`;
  const { status } = destinationResponse;
  const endpoint = destinationRequest?.endpoint || '';

  // Handle endpoint-specific responses
  const endpointResponse = handleEndpointSpecificResponses(endpoint, responseParams);
  if (endpointResponse) {
    return endpointResponse;
  }

  // Handle non-success status codes for all endpoints
  if (!isHttpStatusSuccess(status)) {
    handleNonSuccessResponse(responseParams);
  }

  // Default success case for any other endpoints
  return createSuccessResponse(status, message, rudderJobMetadata);
};

const extractPayloadForFormat = async (payload, format) => {
  if (!payload) {
    return undefined;
  }

  const extractors = {
    JSON_ARRAY: () => payload.batch,
    JSON: () => payload,
    XML: () => payload.payload,
    FORM: () => getFormData(payload),
    GZIP: () => getZippedPayload(payload.payload),
  };

  const extractor = extractors[format];
  if (!extractor) {
    logger.debug(`Unknown payload format: ${format}`);
    return undefined;
  }

  return extractor();
};

const prepareProxyRequest = async (request: any): Promise<PrepareProxyResponse> => {
  const { body, method, params, endpoint, headers, destinationConfig: config } = request;
  const { payload, payloadFormat } = getPayloadData(body);
  if (payloadFormat === 'GZIP') {
    headers['Content-Encoding'] = 'gzip';
  }
  const data = await extractPayloadForFormat(payload, payloadFormat);
  // Ref: https://github.com/rudderlabs/rudder-server/blob/master/router/network.go#L164
  headers['User-Agent'] = 'RudderLabs';
  return removeUndefinedValues({
    endpoint,
    data,
    params,
    headers,
    method,
    config,
  }) as PrepareProxyResponse;
};

const proxyRequest = async (request: any, destType: string) => {
  const { metadata } = request;
  const { endpoint, data, method, params, headers } = await prepareProxyRequest(request);
  const requestOptions = {
    url: endpoint,
    data,
    params,
    headers,
    method,
  };
  const response = await httpSend(requestOptions, {
    feature: 'proxy',
    destType,
    metadata,
  });
  return response;
};

function networkHandler(this) {
  this.proxy = proxyRequest;
  this.prepareProxy = prepareProxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

export { networkHandler };
