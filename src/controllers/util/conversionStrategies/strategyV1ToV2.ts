import {
  SourceInput,
  SourceInputConversionResult,
  SourceInputV2,
  SourceRequestV2,
} from '../../../types';
import { VersionConversionStrategy } from './abstractions';

export class StrategyV1ToV2 extends VersionConversionStrategy<SourceInput, SourceInputV2> {
  convert(sourceEvents: SourceInput[]): SourceInputConversionResult<SourceInputV2>[] {
    return sourceEvents.map((sourceEvent) => {
      try {
        const sourceEventParam = { ...sourceEvent };

        let queryParameters: Record<string, unknown> | undefined;
        if (sourceEventParam.event && sourceEventParam.event.query_parameters) {
          queryParameters = sourceEventParam.event.query_parameters;
          delete sourceEventParam.event.query_parameters;
        }

        const sourceRequest: SourceRequestV2 = {
          body: JSON.stringify(sourceEventParam.event),
        };
        if (queryParameters) {
          sourceRequest.query_parameters = queryParameters;
        }

        const sourceInputV2: SourceInputV2 = {
          request: sourceRequest,
          source: sourceEventParam.source,
        };
        return {
          output: sourceInputV2,
        };
      } catch (err) {
        const conversionError =
          err instanceof Error ? err : new Error('error converting v1 to v2 spec');
        return { conversionError };
      }
    });
  }
}
