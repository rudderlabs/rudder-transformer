import groupBy from "lodash/groupBy";
import {
  Metadata,
  ProcessorRequest,
  ProcessorResponse,
  ProxyResponse,
  RouterData,
  RouterResponse,
  TransformationDefaultResponse
} from "../types/types";
import { generateErrorObject } from "../v0/util";
import { TRANSFORMER_METRIC } from "../v0/util/constant";
import IWorkFlow from "./IWorkFlow";

export default class VanillaWorkflowService implements IWorkFlow {
  public async processorWorkflow(
    events: ProcessorRequest[],
    destinationType: string,
    destHandler: any
  ): Promise<ProcessorResponse[]> {
    // TODO: Change the promise type
    const respList: ProcessorResponse[] = await Promise.all<any>(
      events.map(async event => {
        try {
          let respEvents:
            | TransformationDefaultResponse
            | TransformationDefaultResponse[] = await destHandler.process(
            event
          );
          if (!Array.isArray(respEvents)) {
            respEvents = [respEvents];
          }
          return respEvents.map(ev => {
            let { userId } = ev;
            // Set the user ID to an empty string for
            // all the falsy values (including 0 and false)
            // Otherwise, server panics while un-marshalling the response
            // while expecting only strings.
            if (!userId) {
              userId = "";
            }

            if (ev.statusCode !== 400 && userId) {
              userId = `${userId}`;
            }

            return {
              output: { ...ev, userId },
              metadata: destHandler?.processMetadata
                ? destHandler.processMetadata({
                    metadata: event.metadata,
                    inputEvent: event,
                    outputEvent: ev
                  })
                : event.metadata,
              statusCode: 200
            } as ProcessorResponse;
          });
        } catch (error) {
          const errObj = generateErrorObject(
            error,
            destinationType,
            TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM
          );
          return {
            metadata: event.metadata,
            statusCode: errObj.status,
            error:
              errObj.message || "Error occurred while processing the payload.",
            statTags: {
              errorAt: TRANSFORMER_METRIC.ERROR_AT.PROC,
              ...errObj.statTags
            },
            output: undefined
          } as ProcessorResponse;
        }
      })
    );
    return respList;
  }

  public async routerWorkflow(
    events: RouterData[],
    destinationType: string,
    destHandler: any
  ): Promise<RouterResponse[]> {
    const allDestEvents: Object = groupBy(
      events,
      (ev: RouterData) => ev.destination?.ID
    );
    // TODO: Change the promise type
    const response: RouterResponse[] = await Promise.all<any>(
      Object.values(allDestEvents).map(async (destInputArray: RouterData[]) => {
        try {
          const routerWorkflowResponse: RouterResponse[] = await destHandler.processRouterDest(
            destInputArray
          );
          if (destHandler.processMetadataForRouter) {
            routerWorkflowResponse.forEach(output => {
              output.metadata = destHandler.processMetadataForRouter(output);
            });
          }
          return routerWorkflowResponse;
        } catch (error) {
          const errObj = generateErrorObject(
            error,
            destinationType,
            TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM
          );
          return {
            batchedRequest: undefined,
            // metadata: destInputArray.map( input => { returninput.metadata as Metadata})
            batched: false,
            statusCode: errObj.status,
            error:
              errObj.message || "Error occurred while processing the payload.",
            statTags: {
              ...errObj.statTags,
              errorAt: TRANSFORMER_METRIC.ERROR_AT.RT
            }
          } as RouterResponse;
        }
      })
    );
    return response;
  }

  public batchWorkflow(
    events: RouterData[],
    destinationType: string,
    destHandler: any
  ) {
    if (!destHandler.batch) {
      throw new Error(`${destinationType} does not implement batch`);
    }
    const allDestEvents: Object = groupBy(
      events,
      (ev: RouterData) => ev.destination?.ID
    );
    const response = Object.entries(allDestEvents).map(
      (destEvents: RouterData[]) => {
        try {
          const destBatchedRequests:
            | RouterResponse
            | RouterResponse[] = destHandler.batch(destEvents);
          return destBatchedRequests;
        } catch (error) {
          const errorObj = generateErrorObject(
            error,
            destinationType,
            TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM
          );
          return {
            metadata: destEvents.map(d => d.metadata),
            batched: false,
            statusCode: 500, // for batch we should consider code error hence keeping retryable
            error:
              errorObj.message || "Error occurred while processing payload.",
            statTags: errorObj.statTags
          } as RouterResponse;
        }
      }
    );
    return response;
  }

  public async proxyWorkflow(
    destinationRequest: TransformationDefaultResponse,
    metadata: Metadata,
    destinationType: string,
    networkHandler: any
  ) {
    try {
      const rawProxyResponse = await networkHandler.proxy(destinationRequest);
      const processedProxyResponse = networkHandler.processAxiosResponse(
        rawProxyResponse
      );

      const response: ProxyResponse = networkHandler.responseHandler(
        { ...processedProxyResponse, rudderJobMetadata: metadata },
        destinationType
      );
    } catch (err) {
      const response: ProxyResponse = generateErrorObject(
        err,
        destinationType,
        TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM
      );
      response.statTags = {
        errorAt: TRANSFORMER_METRIC.ERROR_AT.PROXY,
        ...response.statTags
      };
    }
  }
}
