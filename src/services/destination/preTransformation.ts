import { Context } from 'koa';
import { ProcessorTransformationRequest, RouterTransformationRequestData } from '../../types/index';

export default class PreTransformationDestinationService {
  public static preProcess(
    events: ProcessorTransformationRequest[] | RouterTransformationRequestData[],
    ctx: Context,
  ) {
    const reqParams = ctx.request.query;
    const eventsProcessed = events.map(
      (event: ProcessorTransformationRequest | RouterTransformationRequestData) => {
        // eslint-disable-next-line no-param-reassign
        event.request = { query: reqParams };
        return event;
      },
    );
    return eventsProcessed;
  }
}
