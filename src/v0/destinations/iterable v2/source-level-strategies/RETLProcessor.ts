/* eslint-disable no-console */
import { addExternalIdToTraits, getDestinationExternalIDInfoForRetl } from '../../../util';
import { ConfigCategory } from '../config';
import { TrackProcessor } from '../event-type-level-strategies/track/TrackProcessorV1';
import { IdentifyProcessor } from '../event-type-level-strategies/identify/IdentifyProcessorV1';
import { EventTypeProcessorContext } from '../event-type-level-strategies/InputTypeProcessorContext';
import { InputClassificationStrategy } from '../type';

export class RETLProcessor implements InputClassificationStrategy {
  processInput(event: any): void {
    let category;
    const {
      message,
      // destination
    } = event;
    console.log('Processing rETL input:', message);

    addExternalIdToTraits(message);
    if (getDestinationExternalIDInfoForRetl(message, 'ITERABLE').objectType !== 'users') {
      category = ConfigCategory.CATALOG;
      console.log(category);
    }
    const inputTypeProcessor =
      message.type === 'identify' ? new IdentifyProcessor(message) : new TrackProcessor(message);

    const inputTypeProcessorContext = new EventTypeProcessorContext(inputTypeProcessor);
    inputTypeProcessorContext.getMessageBody(message);
    // inputTypeProcessorContext.getEndpoint();
    // inputTypeProcessorContext.getHeaders(destination);
  }
}
