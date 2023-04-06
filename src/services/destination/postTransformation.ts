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
    metaTO: MetaTransferObject,
  ): ProcessorTransformationResponse {
    const errObj = generateErrorObject(error, metaTO.errorDetails);
    const resp = {
      metadata: metaTO.metadata,
      statusCode: errObj.status,
      error: errObj.message || '[Processor Transform] Error occurred while processing the payload.',
      statTags: errObj.statTags,
    } as ProcessorTransformationResponse;
    ErrorReportingService.reportError(error, metaTO.errorContext, resp);
    return resp;
  }

  public static handleRouterTransformSuccessEvents(
    transformedPayloads: RouterTransformationResponse[],
    destHandler: any,
    metaTO: MetaTransferObject,
  ): RouterTransformationResponse[] {
    let resultantPayloads: RouterTransformationResponse[] = cloneDeep(transformedPayloads);
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
          ...metaTO.errorDetails,
        };
      });
    return resultantPayloads;
  }

  public static handleRouterTransformFailureEvents(
    error: Object,
    metaTO: MetaTransferObject,
  ): RouterTransformationResponse {
    const errObj = generateErrorObject(error, metaTO.errorDetails);
    const resp = {
      metadata: metaTO.metadatas,
      batched: false,
      statusCode: errObj.status,
      error: errObj.message || '[Router Transform] Error occurred while processing the payload.',
      statTags: errObj.statTags,
    } as RouterTransformationResponse;
    ErrorReportingService.reportError(error, metaTO.errorContext, resp);
    return resp;
  }

  public static handleBatchTransformFailureEvents(
    error: Object,
    metaTO: MetaTransferObject,
  ): RouterTransformationResponse {
    const errObj = generateErrorObject(error, metaTO.errorDetails);
    const resp = {
      metadata: metaTO.metadatas,
      batched: false,
      statusCode: 500, // for batch we should consider code error hence keeping retryable
      error: errObj.message || '[Batch Transform] Error occurred while processing payload.',
      statTags: errObj.statTags,
    } as RouterTransformationResponse;
    ErrorReportingService.reportError(error, metaTO.errorContext, resp);
    return resp;
  }

  public static handleDeliveryFailureEvents(
    error: Object,
    metaTO: MetaTransferObject,
  ): DeliveryResponse {
    const errObj = generateErrorObject(error, metaTO.errorDetails);
    const resp = {
      status: errObj.status,
      message: errObj.message || '[Delivery] Error occured while processing payload',
      destinationResponse: errObj.destinationResponse,
      statTags: errObj.statTags,
      ...(errObj.authErrorCategory && {
        authErrorCategory: errObj.authErrorCategory,
      }),
    } as DeliveryResponse;
    ErrorReportingService.reportError(error, metaTO.errorContext, resp);
    return resp;
  }

  public static handleUserDeletionFailureEvents(
    error: Object,
    metaTO: MetaTransferObject,
  ): UserDeletionResponse {
    const errObj = generateErrorObject(error, metaTO.errorDetails);
    //TODO: Add stat tags here
    const resp = {
      statusCode: errObj.status,
      error: errObj.message,
      ...(errObj.authErrorCategory && {
        authErrorCategory: errObj.authErrorCategory,
      }),
    } as UserDeletionResponse;
    ErrorReportingService.reportError(error, metaTO.errorContext, resp);
    return resp;
  }
}
