import { SourceInputConversionResult } from '../../../types';

export abstract class VersionConversionStrategy<I, O> {
  abstract convert(sourceEvents: I[]): SourceInputConversionResult<O>[];
}
