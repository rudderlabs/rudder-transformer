import { Context } from "koa";
import { ProcessorRequest, RouterRequestData } from "../../types/index";
import { DynamicConfigInjectionService } from "../../util/dynamicConfigInjector";

export default class PreTransformationServiceDestination {
  public static preProcess(
    events: ProcessorRequest[] | RouterRequestData[],
    ctx: Context
  ) {
    const reqParams = ctx.request.query;
    events = events.map((event: ProcessorRequest | RouterRequestData) => {
      event.request = { query: reqParams };
      return event;
    });
    events = DynamicConfigInjectionService.processDynamicConfig(events);
    return events;
  }
}
