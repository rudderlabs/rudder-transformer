import {
  SourceInput,
  SourceInputConversionResult,
  SourceInputV2,
  SourceRequestV2,
} from '../../../types';
import { VersionConversionStrategy } from './abstractions';

export class StrategyV1ToV2 extends VersionConversionStrategy<SourceInput, SourceInputV2> {
  convert(sourceEvents: SourceInput[]): SourceInputConversionResult<SourceInputV2>[] {
    // Currently this is not being used
    // Hold off on testing this until atleast one v2 source has been implemented
    return sourceEvents.map((sourceEvent) => {
      try {
        const sourceRequest: SourceRequestV2 = {
          method: '',
          url: '',
          proto: '',
          headers: {},
          query_parameters: {},
          body: JSON.stringify(sourceEvent.event),
        };
        const sourceInputV2: SourceInputV2 = {
          request: sourceRequest,
          source: sourceEvent.source,
        };
        return {
          output: sourceInputV2,
        };
      } catch (err) {
        const conversionError =
          err instanceof Error ? err : new Error('error converting v1 to v2 spec');
        return { output: {} as SourceInputV2, conversionError };
      }
    });
  }
}
