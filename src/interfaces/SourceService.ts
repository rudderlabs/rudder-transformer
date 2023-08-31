import { MetaTransferObject, SourceTransformationResponse } from '../types/index';

export interface SourceService {
  getTags(): MetaTransferObject;

  sourceTransformRoutine(
    sourceEvents: Object[],
    sourceType: string,
    version: string,
    requestMetadata: Object,
  ): Promise<SourceTransformationResponse[]>;
}
