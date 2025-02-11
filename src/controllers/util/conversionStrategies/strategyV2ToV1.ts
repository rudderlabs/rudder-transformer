import { TransformationError } from '@rudderstack/integrations-lib';
import { SourceInput, SourceInputConversionResult, SourceInputV2 } from '../../../types';
import { VersionConversionStrategy } from './abstractions';

export class StrategyV2ToV1 extends VersionConversionStrategy<SourceInputV2, SourceInput> {
  convert(sourceEvents: SourceInputV2[]): SourceInputConversionResult<SourceInput>[] {
    return sourceEvents.map((sourceEvent) => this.convertSingleEvent(sourceEvent));
  }

  private convertSingleEvent(sourceEvent: SourceInputV2): SourceInputConversionResult<SourceInput> {
    try {
      const v1Event = {
        event: this.parseRequestBody(sourceEvent.request.body),
        source: sourceEvent.source,
      };
      return { output: v1Event };
    } catch (err) {
      const conversionError =
        err instanceof TransformationError ? err : new Error('error converting v2 to v1 spec');
      return { conversionError };
    }
  }

  private parseRequestBody(body: string): NonNullable<unknown> {
    try {
      return JSON.parse(body);
    } catch (err) {
      throw new TransformationError('Malformed JSON in request body');
    }
  }
}
