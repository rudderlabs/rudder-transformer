import { SourceInputConversionResult } from '../../../types';
import { VersionConversionStrategy } from './abstractions';

export class StrategyDefault extends VersionConversionStrategy<
  NonNullable<unknown>,
  NonNullable<unknown>
> {
  convert(
    sourceEvents: NonNullable<unknown>[],
  ): SourceInputConversionResult<NonNullable<unknown>>[] {
    return sourceEvents.map((sourceEvent) => ({
      output: sourceEvent,
    }));
  }
}
