/* eslint-disable no-param-reassign */
import { PlatformError } from '@rudderstack/integrations-lib';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import {
  DeliveryJobState,
  DeliveryV0Response,
  DeliveryV1Response,
  MetaTransferObject,
  ProcessorTransformationOutput,
  ProcessorTransformationRequest,
  ProcessorTransformationResponse,
  RouterTransformationResponse,
  UserDeletionResponse,
  FixMe,
} from '../../types';
import stats from '../../util/stats';
import { generateErrorObject } from '../../v0/util';
import tags from '../../v0/util/tags';
import { ErrorReportingService } from '../errorReporting';
import logger from '../../logger';

const defaultErrorMessages = {
  router: '[Router Transform] Error occurred while processing the payload.',
  delivery: '[Delivery] Error occured while processing payload',
} as const;

export class DestinationPostTransformationService {
  public static handleProcessorTransformSucessEvents(
    event: ProcessorTransformationRequest,
    transformedPayloads: ProcessorTransformationOutput | ProcessorTransformationOutput[],
    destHandler: any,
  ): ProcessorTransformationResponse[] {
    if (!Array.isArray(transformedPayloads)) {
      transformedPayloads = [transformedPayloads];
    }
    const result = transformedPayloads.map((transformedPayload) => {
      let { userId } = transformedPayload;
      if (!userId) {
        userId = '';
      } else {
        userId = `${userId}`;
      }
      return {
        output: { ...transformedPayload, userId },
        metadata: destHandler?.processMetadata
          ? destHandler.processMetadata({
              metadata: event.metadata,
              inputEvent: event,
              outputEvent: transformedPayload,
            })
          : event.metadata,
        statusCode: 200,
      } as ProcessorTransformationResponse;
    });
    return result;
  }

  public static handleProcessorTransformFailureEvents(
    error: NonNullable<unknown>,
    metaTo: MetaTransferObject,
  ): ProcessorTransformationResponse {
    const errObj = generateErrorObject(error, metaTo.errorDetails);
    const resp = {
      metadata: metaTo.metadata,
      statusCode: errObj.status,
      error: errObj.message || '[Processor Transform] Error occurred while processing the payload.',
      statTags: errObj.statTags,
    } as ProcessorTransformationResponse;
    ErrorReportingService.reportError(error, metaTo.errorContext, resp);
    return resp;
  }

  public static handleRouterTransformSuccessEvents(
    transformedPayloads: RouterTransformationResponse[],
    destHandler: any,
    metaTo: MetaTransferObject,
    implementation: string,
    destinationType: string,
  ): RouterTransformationResponse[] {
    const resultantPayloads: RouterTransformationResponse[] = transformedPayloads.map(
      (payload) => ({ ...payload }),
    );
    resultantPayloads.forEach((resultantPayload) => {
      if (Array.isArray(resultantPayload.batchedRequest)) {
        resultantPayload.batchedRequest = resultantPayload.batchedRequest.map((request) => ({
          ...request,
          userId: request.userId != null ? String(request.userId) : request.userId,
        }));
      } else if (resultantPayload.batchedRequest && resultantPayload.batchedRequest.userId) {
        resultantPayload.batchedRequest = {
          ...resultantPayload.batchedRequest,
          userId: `${resultantPayload.batchedRequest.userId}`,
        };
      }
    });

    if (destHandler?.processMetadataForRouter) {
      return resultantPayloads.map((resultantPayload) => {
        resultantPayload.metadata = destHandler.processMetadataForRouter(resultantPayload);
        return resultantPayload;
      });
    }

    resultantPayloads.forEach((resp) => {
      if ('error' in resp && isObject(resp.statTags) && !isEmpty(resp.statTags)) {
        resp.statTags = {
          ...resp.statTags,
          ...metaTo.errorDetails,
        };
        stats.increment('event_transform_failure', {
          destType: metaTo.errorDetails.destType,
          module: metaTo.errorDetails.module,
          destinationId: metaTo.errorDetails.destinationId,
          workspaceId: metaTo.errorDetails.workspaceId,
          feature: metaTo.errorDetails.feature,
          implementation: metaTo.errorDetails.implementation,
          errorCategory: metaTo.errorDetails.errorCategory,
          errorType: metaTo.errorDetails.errorType,
        });
      } else {
        stats.increment('event_transform_success', {
          destType: destinationType,
          module: tags.MODULES.DESTINATION,
          implementation,
          feature: tags.FEATURES.ROUTER,
          destinationId: metaTo.metadata?.destinationId,
          workspaceId: metaTo.metadata?.workspaceId,
        });
      }
    });

    return resultantPayloads;
  }

  public static handleRouterTransformFailureEvents(
    error: NonNullable<unknown>,
    metaTo: MetaTransferObject,
  ): RouterTransformationResponse {
    const errObj = generateErrorObject(error, metaTo.errorDetails);
    const resp = {
      metadata: metaTo.metadatas,
      batched: false,
      statusCode: errObj.status,
      error: errObj.message || defaultErrorMessages.router,
      statTags: errObj.statTags,
    } as RouterTransformationResponse;
    ErrorReportingService.reportError(error, metaTo.errorContext, resp);

    stats.increment('event_transform_failure', {
      destType: metaTo.errorDetails.destType,
      module: metaTo.errorDetails.module,
      destinationId: metaTo.errorDetails.destinationId,
      workspaceId: metaTo.errorDetails.workspaceId,
      feature: metaTo.errorDetails.feature,
      implementation: metaTo.errorDetails.implementation,
      errorCategory: metaTo.errorDetails.errorCategory,
      errorType: metaTo.errorDetails.errorType,
    });
    return resp;
  }

  public static handleBatchTransformFailureEvents(
    error: NonNullable<unknown>,
    metaTo: MetaTransferObject,
  ): RouterTransformationResponse {
    const errObj = generateErrorObject(error, metaTo.errorDetails);
    const resp = {
      metadata: metaTo.metadatas,
      batched: false,
      statusCode: 500, // for batch we should consider code error hence keeping retryable
      error: errObj.message || defaultErrorMessages.delivery,
      statTags: errObj.statTags,
    } as RouterTransformationResponse;
    ErrorReportingService.reportError(error, metaTo.errorContext, resp);
    return resp;
  }

  public static handleDeliveryFailureEvents(
    error: any,
    metaTo: MetaTransferObject,
  ): DeliveryV0Response {
    const errObj = generateErrorObject(error, metaTo.errorDetails, false);
    const resp = {
      status: errObj.status,
      message: errObj.message || '[Delivery] Error occured while processing payload',
      destinationResponse: errObj.destinationResponse,
      statTags: errObj.statTags,
      ...(errObj.authErrorCategory && {
        authErrorCategory: errObj.authErrorCategory,
      }),
    } as DeliveryV0Response;
    ErrorReportingService.reportError(error, metaTo.errorContext, resp);
    return resp;
  }

  public static handlevV1DeliveriesFailureEvents(
    error: FixMe,
    metaTo: MetaTransferObject,
  ): DeliveryV1Response {
    const errObj = generateErrorObject(error, metaTo.errorDetails, false);
    const metadataArray = metaTo.metadatas;
    if (!Array.isArray(metadataArray)) {
      logger.error('Proxy v1 endpoint error : metadataArray is not an array', metaTo.errorDetails);
      // Panic
      throw new PlatformError('Proxy v1 endpoint error : metadataArray is not an array');
    }
    const responses = metadataArray.map((metadata) => {
      const resp = {
        error:
          JSON.stringify(error.destinationResponse?.response) ||
          errObj.message ||
          defaultErrorMessages.delivery,
        statusCode: errObj.status,
        metadata,
      } as DeliveryJobState;
      return resp;
    });

    const resp = {
      response: responses,
      statTags: errObj.statTags,
      message: errObj.message.toString(),
      status: errObj.status,
      ...(errObj.authErrorCategory && {
        authErrorCategory: errObj.authErrorCategory,
      }),
    } as DeliveryV1Response;
    ErrorReportingService.reportError(error, metaTo.errorContext, resp);
    return resp;
  }

  public static handleUserDeletionFailureEvents(
    error: NonNullable<unknown>,
    metaTo: MetaTransferObject,
  ): UserDeletionResponse {
    const errObj = generateErrorObject(error, metaTo.errorDetails, false);

    stats.increment('regulation_worker_user_deletion_failure', {
      destType: metaTo.errorDetails.destType,
      module: metaTo.errorDetails.module,
      implementation: metaTo.errorDetails.implementation,
      feature: metaTo.errorDetails.feature,
      destinationId: metaTo.errorDetails.destinationId,
      errorCategory: metaTo.errorDetails.errorCategory,
      errorType: metaTo.errorDetails.errorType,
    });
    const resp = {
      statusCode: errObj.status,
      error: errObj.message,
      ...(errObj.authErrorCategory && {
        authErrorCategory: errObj.authErrorCategory,
      }),
    } as UserDeletionResponse;
    ErrorReportingService.reportError(error, metaTo.errorContext, resp);
    return resp;
  }
}
