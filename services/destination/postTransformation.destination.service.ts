import cloneDeep from "lodash/cloneDeep";
import {
  ObjectType,
  ProcessorRequest,
  ProcessorResponse,
  RouterData,
  RouterResponse,
  TransformationDefaultResponse,
  DeliveryResponse,
  ErrorDetailer
} from "../../types/types";
import { generateErrorObject } from "../../v0/util";
import { TRANSFORMER_METRIC } from "../../v0/util/constant";
import ErrorReportingService from "../errorReporting.service";

export default class PostTransformationServiceDestination {
  public static handleSuccessEventsAtProcessorDest(
    event: ProcessorRequest,
    transformedPayloads:
      | TransformationDefaultResponse
      | TransformationDefaultResponse[],
    destHandler: any
  ): ProcessorResponse[] {
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
      } as ProcessorResponse;
    });
    return result.flat();
  }

  public static handleFailedEventsAtProcessorDest(
    error: ObjectType,
    errorDTO: ErrorDetailer
  ): ProcessorResponse {
    const errObj = generateErrorObject(
      error,
      errorDTO.integrationType,
      errorDTO.stage
    );
    ErrorReportingService.reportError(error, errObj, errorDTO);
    return {
      metadata: errorDTO.eventMetadatas[0],
      statusCode: errObj.status,
      error:
        errObj.message ||
        "[Processor Transform] Error occurred while processing the payload.",
      statTags: {
        errorAt: TRANSFORMER_METRIC.ERROR_AT.PROC,
        ...errObj.statTags
      },
      output: undefined
    } as ProcessorResponse;
  }

  public static handleSuccessEventsAtRouterDest(
    transformedPayloads: RouterResponse[],
    destHandler: any
  ): RouterResponse[] {
    let resultantPayloads: RouterResponse[] = cloneDeep(transformedPayloads);
    if (destHandler.processMetadataForRouter) {
      return resultantPayloads.map(resultantPayload => {
        resultantPayload.metadata = destHandler.processMetadataForRouter(
          resultantPayload
        );
        return resultantPayload;
      });
    }
    return resultantPayloads;
  }

  public static handleFailureEventsAtRouterDest(
    error: ObjectType,
    errorDTO: ErrorDetailer
  ): RouterResponse {
    const errObj = generateErrorObject(
      error,
      errorDTO.integrationType,
      errorDTO.stage
    );
    ErrorReportingService.reportError(error, errObj, errorDTO);
    return {
      batchedRequest: undefined,
      metadata: errorDTO.eventMetadatas,
      batched: false,
      statusCode: errObj.status,
      error:
        errObj.message ||
        "[Router Transform] Error occurred while processing the payload.",
      statTags: {
        ...errObj.statTags,
        errorAt: TRANSFORMER_METRIC.ERROR_AT.RT
      }
    } as RouterResponse;
  }

  public static handleFailureEventsAtBatchDest(
    error: ObjectType,
    errorDTO: ErrorDetailer
  ): RouterResponse {
    const errObj = generateErrorObject(
      error,
      errorDTO.integrationType,
      errorDTO.stage
    );
    ErrorReportingService.reportError(error, errObj, errorDTO);
    return {
      metadata: errorDTO.eventMetadatas,
      batched: false,
      statusCode: 500, // for batch we should consider code error hence keeping retryable
      error:
        errObj.message ||
        "[Batch Transform] Error occurred while processing payload.",
      statTags: {
        ...errObj.statTags,
        errorAt: TRANSFORMER_METRIC.ERROR_AT.BATCH
      }
    } as RouterResponse;
  }

  public static handleFailureEventsAtDeliveryDest(
    error: ObjectType,
    errorDTO: ErrorDetailer
  ): DeliveryResponse {
    const errObj = generateErrorObject(
      error,
      errorDTO.integrationType,
      errorDTO.stage
    );
    ErrorReportingService.reportError(error, errObj, errorDTO);
    return {
      status: errObj.status,
      message:
        errObj.message || "[Delivery] Error occured while processing payload",
      destinationResponse: errObj.destinationResponse,
      statTags: {
        errorAt: TRANSFORMER_METRIC.ERROR_AT.PROXY,
        ...errObj.statTags
      },
      authErrorCategory: errObj.authErrorCategory
    } as DeliveryResponse;
  }
}
