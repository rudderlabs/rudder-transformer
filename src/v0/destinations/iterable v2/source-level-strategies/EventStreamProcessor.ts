/* eslint-disable no-console */
import { TrackProcessor } from '../event-type-level-strategies/track/TrackProcessorV1';
import { IdentifyProcessor } from '../event-type-level-strategies/identify/IdentifyProcessorV1';
import { EventTypeProcessorContext } from '../event-type-level-strategies/InputTypeProcessorContext';
import { InputClassificationStrategy } from '../type';

export class EventStreamProcessor implements InputClassificationStrategy {
  processInput(message: any): void {
    console.log('Processing Event Stream input:', message);
    const inputTypeProcessor =
      message.type === 'identify' ? new IdentifyProcessor(message) : new TrackProcessor(message);

    const inputTypeProcessorContext = new EventTypeProcessorContext(inputTypeProcessor);
    // inputTypeProcessorContext.getEndpoint();
    inputTypeProcessorContext.getMessageBody(message);
  }
}
