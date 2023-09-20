import { Context } from 'koa';
import { ProcessorTransformationRequest, RouterTransformationRequestData } from '../../types/index';
import { DynamicConfigParser } from '../../util/dynamicConfigParser';
import { oncehubTransformer } from '../../util/oncehub-custom-transformer';

export default class PreTransformationDestinationService {
  public static preProcess(
    events: ProcessorTransformationRequest[] | RouterTransformationRequestData[],
    ctx: Context,
  ) {
    const reqParams = ctx.request.query;
    const destination = ctx.params.destination;
    events = events.map(
      (event: ProcessorTransformationRequest | RouterTransformationRequestData) => {
        // look for traits under every object in file v0\util\data\GenericFieldMapping.json like
        // "traits": ["traits", "context.traits"]
        let parsedEvent = oncehubTransformer(destination,event);
        parsedEvent.request = { query: reqParams };
        return parsedEvent;
      },
    );
    return events;
  }
}
