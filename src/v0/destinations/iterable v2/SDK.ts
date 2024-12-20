import { InputProcessorContext } from '../processors/InputProcessor';
import { EventStreamProcessor } from '../processors/strategies/EventStreamProcessor';
import { RETLProcessor } from '../processors/strategies/RETLProcessor';
import { APIClientFactory } from '../api/APIClientFactory';
import { InputTypeHandler } from '../handlers/InputTypeHandler';
import { IdentifyHandler } from '../handlers/strategies/IdentifyHandler';
import { TrackHandler } from '../handlers/strategies/TrackHandler';

export class SDK {
  constructor(private config: SDKConfig) {}

  processInput(data: any): void {
    console.log(`Processing input with SDK configuration: ${JSON.stringify(this.config)}`);

    // Step 1: Input Classification
    const processor =
      data.type === 'event_stream'
        ? new InputProcessorContext(new EventStreamProcessor())
        : new InputProcessorContext(new RETLProcessor());

    processor.execute(data);

    // Step 2: Input Type Handling
    const typeHandler = new InputTypeHandler(
      data.inputType === 'identify' ? new IdentifyHandler() : new TrackHandler(),
    );
    typeHandler.execute(data);

    // Step 3: API Version Handling
    const apiClient = APIClientFactory.createClient(data.version || this.config.defaultVersion);
    apiClient.sendRequest(data.payload);
  }
}
