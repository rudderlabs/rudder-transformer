import {
  MetaTransferObject,
  SourceInputConversionResult,
  SourceTransformationResponse,
} from '../types/index';

export interface SourceService {
  getTags(): MetaTransferObject;

  sourceTransformRoutine(
    sourceEvents: SourceInputConversionResult<NonNullable<unknown>>[],
    sourceType: string,
    version: string,
    requestMetadata: NonNullable<unknown>,
  ): Promise<SourceTransformationResponse[]>;
}
