import _ from 'lodash';
import { NetworkError, BaseError, mapInBatches } from '@rudderstack/integrations-lib';
import { handleHttpRequest } from '../../../adapters/network';
import { getDynamicErrorType } from '../../../adapters/utils/networkUtils';
import { isHttpStatusSuccess } from '../../util';
import { collectStatsForAliasFailure, getEndpointFromConfig } from './util';
import { getIdentifyEndpoint, IDENTIFY_BRAZE_MAX_REQ_COUNT } from './config';
import * as stats from '../../../util/stats';
import * as tags from '../../util/tags';
import * as logger from '../../../logger';
import { Destination } from '../../../types';

interface AliasToIdentify {
  external_id: string;
  alias_name: string;
  alias_label: string;
}

interface IdentifyPayload {
  aliases_to_identify: AliasToIdentify[];
  merge_behavior?: string;
}

// -------------------------------

interface BrazeDestinationConfig {
  restApiKey: string;
  dataCenter?: string;
  [key: string]: unknown;
}

interface IdentifyCall {
  identifyPayload: IdentifyPayload;
  destination: Destination<BrazeDestinationConfig>;
  metadata: unknown;
}

interface BrazePartialError {
  type?: string;
  input_array?: string;
  index?: number;
}

interface BrazeResponse {
  status: number;
  response: {
    message?: string;
    errors?: BrazePartialError[];
    users?: Record<string, unknown>[];
  };
}

interface BatchIdentifyResult {
  success: boolean;
  error?: NetworkError | BaseError;
}

/**
 * Processes a single batch of identity resolution calls to Braze's /users/identify endpoint.
 *
 * @param identifyCallsChunk - Array of identity resolution call objects (max 50)
 * @param destinationId - The destination ID for stats tracking
 * @returns Promise that resolves to BatchIdentifyResult
 */
async function processSingleBatch(
  identifyCallsChunk: IdentifyCall[],
  destinationId: string,
): Promise<BatchIdentifyResult> {
  const { destination } = identifyCallsChunk[0];
  const { endpoint } = getIdentifyEndpoint(getEndpointFromConfig(destination));

  const aliasesToIdentify = identifyCallsChunk.flatMap(
    (identifyCall) => identifyCall.identifyPayload.aliases_to_identify,
  );

  const { processedResponse: brazeIdentifyResp }: { processedResponse: BrazeResponse } =
    await handleHttpRequest(
      'post',
      endpoint,
      { aliases_to_identify: aliasesToIdentify, merge_behavior: 'merge' },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${destination.Config.restApiKey}`,
        },
      },
      {
        destType: 'braze',
        feature: 'transformation',
        requestMethod: 'POST',
        module: 'router',
        endpointPath: '/users/identify',
      },
    );

  // Handle network/connection errors (already processed by handleHttpRequest)
  if (!isHttpStatusSuccess(brazeIdentifyResp.status)) {
    logger.error('Braze identity resolution failed', JSON.stringify(brazeIdentifyResp.response));
    collectStatsForAliasFailure(brazeIdentifyResp.response, destination.ID);
    stats.increment('braze_batched_identify_func_calls_count', {
      destination_id: destinationId,
      status: brazeIdentifyResp.status,
      error: 'non_2xx_status',
    });

    return {
      success: false,
      error: new NetworkError(
        `Braze identify failed - ${JSON.stringify(brazeIdentifyResp.response)}`,
        brazeIdentifyResp.status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(brazeIdentifyResp.status),
        },
        brazeIdentifyResp.response,
      ),
    };
  }

  // Handle application-level errors that should trigger Bugsnag
  if (brazeIdentifyResp.response?.errors && brazeIdentifyResp.response.errors.length > 0) {
    logger.error(
      'Braze Unhandled Identify Resolution Error',
      JSON.stringify(brazeIdentifyResp.response),
    );
    stats.increment('braze_batched_identify_func_calls_count', {
      destination_id: destinationId,
      status: brazeIdentifyResp.status,
      error: 'unhandled_error',
    });
    // throw new Error(
    //   `[Unhandled Identify Resolution Error] ${brazeIdentifyResp.response?.errors[0]?.type}`,
    // );
    return {
      success: false,
      error: new BaseError(
        `[Unhandled Identify Resolution Error] ${brazeIdentifyResp.response.errors[0]?.type}`,
      ),
    };
  }

  return { success: true };
}

/**
 * Processes batched identity resolution calls to Braze's /users/identify endpoint.
 * Handles batching, error processing, and stats collection internally.
 *
 * @param identifyCallsArray - Array of identity resolution call objects
 * @param destinationId - The destination ID for stats tracking
 * @returns Promise that resolves when all batches are processed
 */
async function processBatchedIdentify(
  identifyCallsArray: IdentifyCall[],
  destinationId: string,
): Promise<void> {
  if (!identifyCallsArray || identifyCallsArray.length === 0) {
    return;
  }

  const identifyCallsArrayChunks = _.chunk(identifyCallsArray, IDENTIFY_BRAZE_MAX_REQ_COUNT);

  const results = await mapInBatches(identifyCallsArrayChunks, async (identifyCallsChunk) =>
    processSingleBatch(identifyCallsChunk, destinationId),
  );

  // Check if all requests succeeded
  const allSucceeded = results.every((result) => result.success);

  if (allSucceeded) {
    stats.increment('braze_batched_identify_func_calls_count', {
      destination_id: destinationId,
      status: '2xx',
    });
  }
}

export { processBatchedIdentify, processSingleBatch };
