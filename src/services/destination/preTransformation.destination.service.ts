import { Context } from "koa";
import { ProcessorRequest, RouterRequestData } from "../../types/index";
import { DynamicConfigParser } from "../../util/dynamicConfigParser";

export default class PreTransformationDestinationService {
  public static preProcess(
    events: ProcessorRequest[] | RouterRequestData[],
    ctx: Context
  ) {
    const reqParams = ctx.request.query;
    events = events.map((event: ProcessorRequest | RouterRequestData) => {
      event.request = { query: reqParams };
      return event;
    });
    events = DynamicConfigParser.processDynamicConfig(events);
    return events;
  }
}
