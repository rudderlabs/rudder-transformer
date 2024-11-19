import { SourceInput, SourceInputConversionResult } from '../../../types';
import { VersionConversionStrategy } from './abstractions';

export class StrategyV1ToV0 extends VersionConversionStrategy<SourceInput, NonNullable<unknown>> {
  convert(sourceEvents: SourceInput[]): SourceInputConversionResult<NonNullable<unknown>>[] {
    return sourceEvents.map((sourceEvent) => ({
      output: sourceEvent.event as NonNullable<unknown>,
    }));
  }
}
