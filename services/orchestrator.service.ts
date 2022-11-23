import cloneDeep from "lodash/cloneDeep";
import logger from "../logger";
import stats from "../util/stats";
import { ProcessorRequest } from "../types/procRequestT";
import { generateErrorObject, getMetadata, isCdkDestination } from "../v0/util";
import { CDKV2Service } from "./cdkV2transformation.service";
import { TRANSFORMER_METRIC } from "../v0/util/constant";
import { isCdkV2Destination } from "../cdk/v2/utils";
import { CDKV1Service } from "./cdkV1Transformation.service";
import { VanillaDestinationService } from "./vanillaTransformation.service";
import { DynamicConfigInjectionService } from "./dynamicConfigInjection.service";
import { ProcessorResponse } from "../types/procResponseT";
import { MiscService } from "./misc.service";

export class OrchestratorService {
  private static postProcessResponse(
    respEvents: any,
    inputEvent: any,
    destHandler: any
  ) {
    let localRespEvents = cloneDeep(respEvents);
    if (!Array.isArray(localRespEvents)) {
      localRespEvents = [localRespEvents];
    }

    return localRespEvents.map((ev: any) => {
      let { userId } = ev;
      // Set the user ID to an empty string for
      // all the falsy values (including 0 and false)
      // Otherwise, server panics while un-marshalling the response
      // while expecting only strings.
      if (!userId) {
        userId = "";
      }

      // TODO: Remove remove this if not used
      if (ev.statusCode !== 400 && userId) {
        userId = `${userId}`;
      }

      const resp: ProcessorResponse = {
        output: { ...ev, userId },
        metadata: destHandler?.processMetadata
          ? destHandler.processMetadata({
              metadata: inputEvent.metadata,
              inputEvent: inputEvent,
              outputEvent: ev
            })
          : inputEvent.metadata,
        statusCode: 200,
        error: "",
        statTags: undefined
      };
      return resp;
    });
  }

  public static async processDestinationWorkflow(
    events: ProcessorRequest[],
    reqParams: any,
    destination: string,
    version: string
  ) {
    if (events.length === 0) {
      // ctx.body = "Event is missing or in inappropriate format";
      // ctx.status = 400;
      // notify bugsnag here
      // throw applicabale error here
    }
    logger.debug(`[DT] Input events: ${JSON.stringify(events)}`);

    const metaTags =
      events && events.length && events[0].metadata
        ? getMetadata(events[0].metadata)
        : {};
    stats.increment("dest_transform_input_events", events.length, {
      destination,
      version,
      ...metaTags
    });

    const executeStartTime = new Date();
    let destHandler = null;
    const respList = await Promise.all(
      events.map(async event => {
        try {
          let parsedEvent: any;
          parsedEvent = event;
          parsedEvent.request = { query: reqParams };
          parsedEvent = DynamicConfigInjectionService.processDynamicConfigAtProc(
            parsedEvent
          );
          let respEvents: any;
          if (isCdkV2Destination(parsedEvent)) {
            respEvents = await CDKV2Service.processCdkV2Workflow(
              destination,
              parsedEvent,
              TRANSFORMER_METRIC.ERROR_AT.PROC
            );
          } else if (isCdkDestination(parsedEvent)) {
            respEvents = await CDKV1Service.processCdkV1Workflow(
              destination,
              parsedEvent
            );
          } else {
            respEvents = await VanillaDestinationService.processVanillaDestination(
              destination,
              parsedEvent,
              TRANSFORMER_METRIC.ERROR_AT.PROC
            );
          }
          return this.postProcessResponse(respEvents, parsedEvent, destHandler);
        } catch (error) {
          logger.error(error);
          const errObj = generateErrorObject(
            error,
            destination,
            TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM
          );
          const resp: ProcessorResponse = {
            metadata: event.metadata,
            statusCode: errObj.status,
            error:
              errObj.message || "Error occurred while processing the payload.",
            statTags: {
              errorAt: TRANSFORMER_METRIC.ERROR_AT.PROC,
              ...errObj.statTags
            },
            output: undefined
          };
          MiscService.bugSnagNotify(resp, error, event, destination);
          return resp;
        }
      })
    );
    stats.timing("cdk_events_latency", executeStartTime, {
      destination,
      ...metaTags
    });
    logger.debug(`[DT] Output events: ${JSON.stringify(respList)}`);
    stats.increment("dest_transform_output_events", respList.length, {
      destination,
      version,
      ...metaTags
    });
    return respList.flat();
  }

}
