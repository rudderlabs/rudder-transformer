import { ConfigFactory, Executor } from "rudder-transformer-cdk";
import {
  Metadata,
  ProcessorRequest,
  ProcessorResponse,
  RouterData,
  RouterResponse,
  TransformationDefaultResponse
} from "../types/types";
import { generateErrorObject } from "../v0/util";
import { TRANSFORMER_METRIC } from "../v0/util/constant";
import IWorkFlow from "./IWorkFlow";

export default class CDKV1Service implements IWorkFlow {
  public async processorWorkflow(
    events: ProcessorRequest[],
    destinationType: string,
    destHandler: any
  ): Promise<ProcessorResponse[]> {
    const tfConfig = await ConfigFactory.getConfig(destinationType);
    const respList: ProcessorResponse[] = await Promise.all(
      events.map(async event => {
        try {
          let respEvents: any = await Executor.execute(event as any, tfConfig);
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

  public routerWorkflow(
    _events: RouterData[],
    _destinationType: string,
    _destHandler: string
  ): Promise<RouterResponse[]> {
    throw new Error("CDKV1 Does not Implement Router Transform WorkFlow");
  }

  public batchWorkflow(
    _events: RouterData[],
    _destinationType: string,
    _destHandler: any
  ) {
    throw new Error("CDKV1 Does not Implement Batch Transform WorkFlow");
  }

  public proxyWorkflow(
    _event: TransformationDefaultResponse,
    _metadata: Metadata,
    _destinationType: string,
    _networkHandler: any
  ) {
    throw new Error("CDV1 Does not Implement Proxy Workflow");
  }
}
