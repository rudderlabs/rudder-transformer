import { Context } from 'koa';
import { ProcessorTransformationRequest, RouterTransformationRequestData } from '../../types/index';
import { DynamicConfigParser } from '../../util/dynamicConfigParser';

export default class PreTransformationDestinationService {
  public static preProcess(
    events: ProcessorTransformationRequest[] | RouterTransformationRequestData[],
    ctx: Context,
  ) {
    const reqParams = ctx.request.query;
    events = events.map((event: ProcessorTransformationRequest | RouterTransformationRequestData) => {
      event.request = { query: reqParams };
      return event;
    }); 
    return events;
  }
}
