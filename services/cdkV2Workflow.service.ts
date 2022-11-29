import groupBy from "lodash/groupBy";
import { processCdkV2Workflow } from "../cdk/v2/handler";
import {
  Metadata,
  ObjectType,
  ProcessorRequest,
  ProcessorResponse,
  RouterData,
  RouterResponse,
  TransformationDefaultResponse
} from "../types/types";
import { generateErrorObject } from "../v0/util";
import { TRANSFORMER_METRIC } from "../v0/util/constant";
import IWorkFlow from "./IWorkFlow";
export default class CDKV2Service implements IWorkFlow {
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
            | TransformationDefaultResponse[] = await processCdkV2Workflow(
            destinationType,
            event,
            TRANSFORMER_METRIC.ERROR_AT.PROC
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
          const routerWorkflowResponse: RouterResponse[] = await processCdkV2Workflow(
            destinationType,
            destInputArray,
            TRANSFORMER_METRIC.ERROR_AT.RT
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
    _events: RouterData[],
    _destinationType: string,
    _destHandler: any
  ) {
    throw new Error("CDKV2 Does not Implement Batch Transform WorkFlow");
  }

  public proxyWorkflow(
    _event: TransformationDefaultResponse,
    _metadata: Metadata,
    _destinationType: string,
    _networkHandler: any
  ) {
    throw new Error("CDV2 Does not Implement Proxy Workflow");
  }
}
