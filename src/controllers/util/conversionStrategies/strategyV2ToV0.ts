import { TransformationError } from '@rudderstack/integrations-lib';
import { SourceInputConversionResult, SourceInputV2 } from '../../../types';
import { VersionConversionStrategy } from './abstractions';
import { ErrorMessages } from '../../../constants';

export class StrategyV2ToV0 extends VersionConversionStrategy<SourceInputV2, NonNullable<unknown>> {
  convert(sourceEvents: SourceInputV2[]): SourceInputConversionResult<NonNullable<unknown>>[] {
    return sourceEvents.map((sourceEvent) => this.convertSingleEvent(sourceEvent));
  }

  private convertSingleEvent(
    sourceEvent: SourceInputV2,
  ): SourceInputConversionResult<NonNullable<unknown>> {
    try {
      const v0Event = this.parseRequestBody(sourceEvent.request.body);
      return { output: v0Event };
    } catch (err) {
      const conversionError =
        err instanceof TransformationError ? err : new Error('error converting v2 to v0 spec');

      return { conversionError };
    }
  }

  private parseRequestBody(body: string): NonNullable<unknown> {
    try {
      return JSON.parse(body);
    } catch (err) {
      throw new TransformationError(ErrorMessages.JSONParseError);
    }
  }
}
