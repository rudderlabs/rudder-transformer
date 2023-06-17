import cloneDeep from 'lodash/cloneDeep';
import isObject from 'lodash/isObject';
import isEmpty from 'lodash/isEmpty';
import {
  ProcessorTransformationRequest,
  ProcessorTransformationResponse,
  RouterTransformationResponse,
  ProcessorTransformationOutput,
  DeliveryResponse,
  MetaTransferObject,
  UserDeletionResponse,
} from '../../types/index';
import { generateErrorObject } from '../../v0/util';
import ErrorReportingService from '../errorReporting';

export default class DestinationPostTransformationService {
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
    error: Object,
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
  ): RouterTransformationResponse[] {
    const resultantPayloads: RouterTransformationResponse[] = cloneDeep(transformedPayloads);
    resultantPayloads.forEach((resultantPayload) => {
      if (resultantPayload.batchedRequest && resultantPayload.batchedRequest.userId) {
        resultantPayload.batchedRequest.userId = `${resultantPayload.batchedRequest.userId}`;
      }
    });
    if (destHandler?.processMetadataForRouter) {
      return resultantPayloads.map((resultantPayload) => {
        resultantPayload.metadata = destHandler.processMetadataForRouter(resultantPayload);
        return resultantPayload;
      });
    }
    resultantPayloads
      .filter((resp) => 'error' in resp && isObject(resp.statTags) && !isEmpty(resp.statTags))
      .forEach((resp) => {
        resp.statTags = {
          ...resp.statTags,
          ...metaTo.errorDetails,
        };
      });
    return resultantPayloads;
  }

  public static handleRouterTransformFailureEvents(
    error: Object,
    metaTo: MetaTransferObject,
  ): RouterTransformationResponse {
    const errObj = generateErrorObject(error, metaTo.errorDetails);
    const resp = {
      metadata: metaTo.metadatas,
      batched: false,
      statusCode: errObj.status,
      error: errObj.message || '[Router Transform] Error occurred while processing the payload.',
      statTags: errObj.statTags,
    } as RouterTransformationResponse;
    ErrorReportingService.reportError(error, metaTo.errorContext, resp);
    return resp;
  }

  public static handleBatchTransformFailureEvents(
    error: Object,
    metaTo: MetaTransferObject,
  ): RouterTransformationResponse {
    const errObj = generateErrorObject(error, metaTo.errorDetails);
    const resp = {
      metadata: metaTo.metadatas,
      batched: false,
      statusCode: 500, // for batch we should consider code error hence keeping retryable
      error: errObj.message || '[Batch Transform] Error occurred while processing payload.',
      statTags: errObj.statTags,
    } as RouterTransformationResponse;
    ErrorReportingService.reportError(error, metaTo.errorContext, resp);
    return resp;
  }

  public static handleDeliveryFailureEvents(
    error: Object,
    metaTo: MetaTransferObject,
  ): DeliveryResponse {
    const errObj = generateErrorObject(error, metaTo.errorDetails, false);
    const resp = {
      status: errObj.status,
      message: errObj.message || '[Delivery] Error occured while processing payload',
      destinationResponse: errObj.destinationResponse,
      statTags: errObj.statTags,
      ...(errObj.authErrorCategory && {
        authErrorCategory: errObj.authErrorCategory,
      }),
    } as DeliveryResponse;
    ErrorReportingService.reportError(error, metaTo.errorContext, resp);
    return resp;
  }

  public static handleUserDeletionFailureEvents(
    error: Object,
    metaTo: MetaTransferObject,
  ): UserDeletionResponse {
    const errObj = generateErrorObject(error, metaTo.errorDetails, false);
    // TODO: Add stat tags here
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
