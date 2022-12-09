import { Context } from "koa";
import { ProcessorRequest, RouterData } from "../../types/types";
import { DynamicConfigInjectionService } from "../../util/dynamicConfigInjector";

export default class PreTransformationServiceDestination {
  public static preProcess(
    events: ProcessorRequest[] | RouterData[],
    ctx: Context
  ) {
    const reqParams = ctx.request.query;
    events = events.map((event: ProcessorRequest | RouterData) => {
      event.request = { query: reqParams };
      return event;
    });
    events = DynamicConfigInjectionService.processDynamicConfig(events);
    return events;
  }
}
