import { Context } from "koa";
import { ProcessorTransformRequest, RouterTransformRequestData } from "../../types/index";
import { DynamicConfigParser } from "../../util/dynamicConfigParser";

export default class PreTransformationDestinationService {
  public static preProcess(
    events: ProcessorTransformRequest[] | RouterTransformRequestData[],
    ctx: Context
  ) {
    const reqParams = ctx.request.query;
    events = events.map((event: ProcessorTransformRequest | RouterTransformRequestData) => {
      event.request = { query: reqParams };
      return event;
    });
    events = DynamicConfigParser.processDynamicConfig(events);
    return events;
  }
}
