import { TransformerProxyError } from '../../../v0/util/errorTypes';
import { prepareProxyRequest, proxyRequest } from '../../../adapters/network';
import { isHttpStatusSuccess, getAuthErrCategoryFromStCode } from '../../../v0/util/index';
import { HTTP_STATUS_CODES } from '../../../v0/util/constant';
import {
  DeliveryV1Response,
  DeliveryJobState,
  ProxyMetdata,
  ProxyV1Request,
} from '../../../types/index';

import { processAxiosResponse, getDynamicErrorType } from '../../../adapters/utils/networkUtils';

const tags = require('../../../v0/util/tags');

/**
 *
 * @param results
 * @param rudderJobMetadata
 * @param destinationConfig
 * @returns boolean
 */

const findFeatureandVersion = (response, rudderJobMetadata, destinationConfig) => {
  const { results, errors } = response;
  if (Array.isArray(rudderJobMetadata) && rudderJobMetadata.length === 1) {
    return 'singleEvent';
  }
  if (destinationConfig?.apiVersion === 'legacyApi') {
    return 'legacyApiWithMultipleEvents';
  }
  if (destinationConfig?.apiVersion === 'newApi') {
    if (Array.isArray(results) && results.length === rudderJobMetadata.length)
      return 'newApiWithMultipleEvents';

    if (
      Array.isArray(results) &&
      results.length !== rudderJobMetadata.length &&
      Array.isArray(errors) &&
      results.length + errors.length === rudderJobMetadata.length
    )
      return 'newApiWithMultipleEventsAndErrors';
  }
  return 'unableToFindVersionWithMultipleEvents';
};

const populateResponseWithDontBatch = (rudderJobMetadata, response) => {
  const errorMessage = JSON.stringify(response);
  const responseWithIndividualEvents: DeliveryJobState[] = [];

  rudderJobMetadata.forEach((metadata) => {
    responseWithIndividualEvents.push({
      statusCode: 500,
      metadata: { ...metadata, dontBatch: true },
      error: errorMessage,
    });
  });
  return responseWithIndividualEvents;
};

type Response = {
  status?: string;
  results?: Array<object>;
  errors?: Array<object>;
  startedAt?: Date;
  completedAt?: Date;
  message?: string;
  correlationId?: string;
  failureMessages?: Array<object>;
};

type UpsertResult = {
  id?: string;
  properties?: object;
  objectWriteTraceId?: string;
};

type UpsertError = {
  status?: string;
  category?: string;
  message?: string;
  context?: {
    objectWriteTraceId?: string[];
  };
};

type UpsertResponse = {
  results?: UpsertResult[];
  errors?: UpsertError[];
};

const SILENT_FAILURE_MESSAGE = '[HUBSPOT Response V1 Handler] - Silent failure detected';
const SILENT_FAILURE_ERROR =
  '[HUBSPOT] Silent failure: HubSpot returned 2xx but the response indicates no records were processed (empty results and errors).';

// Explicit list of new API v3 batch write endpoints. Using regex (not substring
// match) keeps this deterministic — only known write endpoints are matched, so
// new batch verbs (e.g., batch/read) added later won't accidentally trigger
// silent-failure detection. Dynamic segments (:objectType, :from, :to) are
// matched via [^/]+.
const NEW_BATCH_ENDPOINT_PATTERNS: RegExp[] = [
  /\/crm\/v3\/objects\/[^/]+\/batch\/(upsert|create|update)(\?|$)/,
  /\/crm\/v3\/associations\/[^/]+\/[^/]+\/batch\/create(\?|$)/,
];

const isNewBatchEndpoint = (endpoint?: string): boolean => {
  if (!endpoint) {
    return false;
  }
  return NEW_BATCH_ENDPOINT_PATTERNS.some((pattern) => pattern.test(endpoint));
};

const isSilentFailure = (response: Response, endpoint?: string): boolean => {
  if (!isNewBatchEndpoint(endpoint)) {
    return false;
  }
  const results = response?.results ?? [];
  const errors = response?.errors ?? [];
  return results.length === 0 && errors.length === 0;
};

const BATCH_UPDATE_ENDPOINT_PATTERN = /\/crm\/v3\/objects\/[^/]+\/batch\/update(\?|$)/;
const NOT_UPDATED_ERROR =
  '[HUBSPOT] Record not updated: HubSpot left its id out of the batch/update results without an error (e.g. the record was merged into another one).';

/**
 * batch/update leaves an input out of `results`, and reports no error for it, when its id no
 * longer addresses a record of its own (e.g. it was merged into another record). Returns the job
 * ids (from each such input's objectWriteTraceId) so they fail instead of reading as delivered.
 */
const findNotUpdatedJobIds = (
  response: UpsertResponse,
  destinationRequest?: ProxyV1Request,
): string[] => {
  if (!BATCH_UPDATE_ENDPOINT_PATTERN.test(destinationRequest?.endpoint ?? '')) {
    return [];
  }
  const inputs = destinationRequest?.body?.JSON?.inputs;
  if (!Array.isArray(inputs)) {
    return [];
  }
  const resultIds = new Set((response?.results ?? []).map((result) => String(result.id)));
  return inputs
    .filter((input) => input?.objectWriteTraceId && !resultIds.has(String(input.id)))
    .flatMap((input) => String(input.objectWriteTraceId).split(','))
    .filter(Boolean);
};

const buildSilentFailureResponse = (
  rudderJobMetadata: ProxyMetdata[],
  status: number,
): DeliveryV1Response => ({
  status,
  message: SILENT_FAILURE_MESSAGE,
  response: rudderJobMetadata.map((metadata) => ({
    statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
    metadata,
    error: SILENT_FAILURE_ERROR,
  })),
});

/**
 * Handles 207 Multi-Status responses from HubSpot batch upsert/update APIs.
 * HubSpot echoes each failed input's objectWriteTraceId in error.context (for batch/update
 * OBJECT_NOT_FOUND too); a trace id lists the job id(s) the input was built from. Those jobs,
 * and the not-updated jobs (see findNotUpdatedJobIds), are marked as failed (400). All other
 * events are marked as success (200).
 *
 * @param response - The parsed response body from HubSpot
 * @param rudderJobMetadata - Array of metadata for each job in the batch
 * @param notUpdatedJobIds - Jobs whose batch/update input HubSpot left out of the results
 * @returns DeliveryV1Response with individual status for each job
 */
const handle207MultiStatus = (
  response: UpsertResponse,
  rudderJobMetadata: ProxyMetdata[],
  notUpdatedJobIds: string[] = [],
): DeliveryV1Response => {
  const { errors = [] } = response;
  const responseWithIndividualEvents: DeliveryJobState[] = [];

  // Build a map of failed jobIds with their error messages from errors array
  const failedJobsMap = new Map<string, string>();
  errors.forEach((error: UpsertError) => {
    // objectWriteTraceId is in error.context as an array
    const traceIds = error.context?.objectWriteTraceId || [];
    const errorMessage = error.message!;

    // a trace id lists one job id, or several (comma-separated) for a merged input
    traceIds
      .flatMap((traceId: string) => traceId.split(','))
      .forEach((jobId) => {
        if (jobId) {
          failedJobsMap.set(jobId, errorMessage);
        }
      });
  });
  // HubSpot's own error for a job (e.g. OBJECT_NOT_FOUND) is more specific, so it wins
  notUpdatedJobIds.forEach((jobId) => {
    if (!failedJobsMap.has(jobId)) {
      failedJobsMap.set(jobId, NOT_UPDATED_ERROR);
    }
  });

  // Process all metadata: mark as failed if in failedJobsMap, otherwise success
  rudderJobMetadata.forEach((metadata) => {
    const jobId = String(metadata?.jobId);

    if (failedJobsMap.has(jobId)) {
      responseWithIndividualEvents.push({
        statusCode: 400,
        metadata,
        error: failedJobsMap.get(jobId) ?? 'Unknown error from HubSpot',
      });
    } else {
      responseWithIndividualEvents.push({
        statusCode: 200,
        metadata,
        error: 'success',
      });
    }
  });

  return {
    status: 207,
    message: '[HUBSPOT Response V1 Handler] - Batch upsert completed with partial results',
    response: responseWithIndividualEvents,
  };
};

const responseHandler = (responseParams: {
  rudderJobMetadata: ProxyMetdata[];
  destinationResponse: { response: Response; status: number };
  destinationRequest: ProxyV1Request;
}) => {
  const { destinationResponse, rudderJobMetadata, destinationRequest } = responseParams;
  const successMessage = `[HUBSPOT Response V1 Handler] - Request Processed Successfully`;
  const failureMessage =
    'HUBSPOT: Error in transformer proxy v1 during HUBSPOT response transformation';
  const responseWithIndividualEvents: DeliveryJobState[] = [];
  const { response, status } = destinationResponse;

  // Detect silent failures on new API v3 batch endpoints: HubSpot returned 2xx
  // but the response indicates no records were processed (empty results and
  // errors). When errors are present, the 207 multi-status handler below
  // preserves the specific error messages from HubSpot. Legacy batch endpoint
  // /contacts/v1/contact/batch/ returns empty body by design (202 Accepted)
  // and is excluded.
  // Mark all events as 400 since retrying with the same payload would produce
  // the same silent no-op.
  if (isHttpStatusSuccess(status) && isSilentFailure(response, destinationRequest.endpoint)) {
    return buildSilentFailureResponse(rudderJobMetadata, status);
  }

  // Handle 207 Multi-Status response from batch upsert/update APIs, and a 2xx batch/update that
  // left some inputs out of its results (handled the same way: those jobs fail, the rest succeed)
  const notUpdatedJobIds = isHttpStatusSuccess(status)
    ? findNotUpdatedJobIds(response as UpsertResponse, destinationRequest)
    : [];
  if (status === 207 || notUpdatedJobIds.length > 0) {
    return handle207MultiStatus(response as UpsertResponse, rudderJobMetadata, notUpdatedJobIds);
  }

  if (isHttpStatusSuccess(status)) {
    // populate different response for each event
    const destResponse = response;
    let proxyOutputObj: DeliveryJobState;
    const featureAndVersion = findFeatureandVersion(
      destResponse,
      rudderJobMetadata,
      destinationRequest?.destinationConfig,
    );
    switch (featureAndVersion) {
      case 'singleEvent':
        proxyOutputObj = {
          statusCode: status,
          metadata: rudderJobMetadata[0],
          error: JSON.stringify(destResponse),
        };
        responseWithIndividualEvents.push(proxyOutputObj);
        break;
      case 'newApiWithMultipleEvents':
        rudderJobMetadata.forEach((metadata: any, index: string | number) => {
          proxyOutputObj = {
            statusCode: 200,
            metadata,
            error: JSON.stringify(destResponse.results?.[index]),
          };
          responseWithIndividualEvents.push(proxyOutputObj);
        });
        break;
      default:
        rudderJobMetadata.forEach((metadata) => {
          proxyOutputObj = {
            statusCode: 200,
            metadata,
            error: 'success',
          };
          responseWithIndividualEvents.push(proxyOutputObj);
        });
        break;
    }
    return {
      status,
      message: successMessage,
      response: responseWithIndividualEvents,
    } as DeliveryV1Response;
  }

  // At least one event in the batch is invalid.
  if (status === 400 && Array.isArray(rudderJobMetadata) && rudderJobMetadata.length > 1) {
    // sending back 500 for retry only when events came in a batch
    return {
      status: 500,
      message: failureMessage,
      response: populateResponseWithDontBatch(rudderJobMetadata, response),
    } as DeliveryV1Response;
  }
  throw new TransformerProxyError(
    failureMessage,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    destinationResponse,
    getAuthErrCategoryFromStCode(status),
    response,
  );
};

function networkHandler(this: any) {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

module.exports = { networkHandler, SILENT_FAILURE_MESSAGE, SILENT_FAILURE_ERROR };
