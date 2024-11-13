import { SourceInput, SourceInputConversionResult } from '../../../types';
import { VersionConversionStrategy } from './abstractions';

export class StrategyV0ToV1 extends VersionConversionStrategy<NonNullable<unknown>, SourceInput> {
  convert(sourceEvents: NonNullable<unknown>[]): SourceInputConversionResult<SourceInput>[] {
    // This should be deprecated along with v0-webhook-rudder-server deprecation
    return sourceEvents.map((sourceEvent) => ({
      output: { event: sourceEvent, source: undefined } as SourceInput,
    }));
  }
}
