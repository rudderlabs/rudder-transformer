import cloneDeep from "lodash/cloneDeep";
import isObject from "lodash/isObject";
import isEmpty from "lodash/isEmpty";
import {
  ProcessorTransformRequest,
  ProcessorTransformResponse,
  RouterTransformResponse,
  TransformedEvent,
  DeliveryResponse,
  MetaTransferObject
} from "../../types/index";
import { generateErrorObject } from "../../v0/util";
import ErrorReportingService from "../errorReporting.service";

export default class PostTransformationDestinationService {
  public static handleSuccessEventsAtProcessorDest(
    event: ProcessorTransformRequest,
    transformedPayloads: TransformedEvent | TransformedEvent[],
    destHandler: any
  ): ProcessorTransformResponse[] {
    if (!Array.isArray(transformedPayloads)) {
      transformedPayloads = [transformedPayloads];
    }
    const result = transformedPayloads.map(transformedPayload => {
      let { userId } = transformedPayload;
      if (!userId) {
        userId = "";
      } else {
        userId = `${userId}`;
      }
      return {
        output: { ...transformedPayload, userId },
        metadata: destHandler?.processMetadata
          ? destHandler.processMetadata({
              metadata: event.metadata,
              inputEvent: event,
              outputEvent: transformedPayload
            })
          : event.metadata,
        statusCode: 200
      } as ProcessorTransformResponse;
    });
    return result;
  }

  public static handleFailedEventsAtProcessorDest(
    error: Object,
    metaTO: MetaTransferObject
  ): ProcessorTransformResponse {
    const errObj = generateErrorObject(error, metaTO.errorDetails);
    const resp = {
      metadata: metaTO.metadata,
      statusCode: errObj.status,
      error:
        errObj.message ||
        "[Processor Transform] Error occurred while processing the payload.",
      statTags: errObj.statTags
    } as ProcessorTransformResponse;
    ErrorReportingService.reportError(error, metaTO.errorDetails.context, resp);
    return resp;
  }

  public static handleSuccessEventsAtRouterDest(
    transformedPayloads: RouterTransformResponse[],
    destHandler: any,
    metaTO: MetaTransferObject
  ): RouterTransformResponse[] {
    let resultantPayloads: RouterTransformResponse[] = cloneDeep(transformedPayloads);
    if (destHandler?.processMetadataForRouter) {
      return resultantPayloads.map(resultantPayload => {
        resultantPayload.metadata = destHandler.processMetadataForRouter(
          resultantPayload
        );
        return resultantPayload;
      });
    }
    resultantPayloads
      .filter(
        resp =>
          "error" in resp && isObject(resp.statTags) && !isEmpty(resp.statTags)
      )
      .forEach(resp => {
        resp.statTags = {
          ...resp.statTags,
          ...metaTO.errorDetails
        };
      });
    return resultantPayloads;
  }

  public static handleFailureEventsAtRouterDest(
    error: Object,
    metaTO: MetaTransferObject
  ): RouterTransformResponse {
    const errObj = generateErrorObject(error, metaTO.errorDetails);
    const resp = {
      metadata: metaTO.metadatas,
      batched: false,
      statusCode: errObj.status,
      error:
        errObj.message ||
        "[Router Transform] Error occurred while processing the payload.",
      statTags: errObj.statTags
    } as RouterTransformResponse;
    ErrorReportingService.reportError(error, metaTO.errorDetails.context, resp);
    return resp;
  }

  public static handleFailureEventsAtBatchDest(
    error: Object,
    metaTO: MetaTransferObject
  ): RouterTransformResponse {
    const errObj = generateErrorObject(error, metaTO.errorDetails);
    const resp = {
      metadata: metaTO.metadatas,
      batched: false,
      statusCode: 500, // for batch we should consider code error hence keeping retryable
      error:
        errObj.message ||
        "[Batch Transform] Error occurred while processing payload.",
      statTags: errObj.statTags
    } as RouterTransformResponse;
    ErrorReportingService.reportError(error, metaTO.errorDetails.context, resp);
    return resp;
  }

  public static handleFailureEventsAtDeliveryDest(
    error: Object,
    metaTO: MetaTransferObject
  ): DeliveryResponse {
    const errObj = generateErrorObject(error, metaTO.errorDetails);
    const resp = {
      status: errObj.status,
      message:
        errObj.message || "[Delivery] Error occured while processing payload",
      destinationResponse: errObj.destinationResponse,
      statTags: errObj.statTags,
      ...(errObj.authErrorCategory && {
        authErrorCategory: errObj.authErrorCategory
      })
    } as DeliveryResponse;
    ErrorReportingService.reportError(error, metaTO.errorDetails.context, resp);
    return resp;
  }
}
