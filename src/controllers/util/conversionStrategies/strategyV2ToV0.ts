import { SourceInputConversionResult, SourceInputV2 } from '../../../types';
import { VersionConversionStrategy } from './abstractions';

export class StrategyV2ToV0 extends VersionConversionStrategy<SourceInputV2, NonNullable<unknown>> {
  convert(sourceEvents: SourceInputV2[]): SourceInputConversionResult<NonNullable<unknown>>[] {
    return sourceEvents.map((sourceEvent) => {
      try {
        const v0Event = JSON.parse(sourceEvent.request.body);
        return { output: v0Event };
      } catch (err) {
        const conversionError =
          err instanceof Error ? err : new Error('error converting v2 to v0 spec');
        return { conversionError };
      }
    });
  }
}
