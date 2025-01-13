import { SourceInput, SourceInputConversionResult, SourceInputV2 } from '../../../types';
import { VersionConversionStrategy } from './abstractions';

export class StrategyV2ToV1 extends VersionConversionStrategy<SourceInputV2, SourceInput> {
  convert(sourceEvents: SourceInputV2[]): SourceInputConversionResult<SourceInput>[] {
    return sourceEvents.map((sourceEvent) => {
      try {
        const v1Event = { event: JSON.parse(sourceEvent.request.body), source: sourceEvent.source };
        return { output: v1Event };
      } catch (err) {
        const conversionError =
          err instanceof Error ? err : new Error('error converting v2 to v1 spec');
        return { conversionError };
      }
    });
  }
}
