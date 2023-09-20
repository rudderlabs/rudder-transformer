import { MetaTransferObject, SourceTransformationResponse } from '../types/index';

export default interface SourceService {
  getTags(): MetaTransferObject;

  sourceTransformRoutine(
    sourceEvents: Object[],
    sourceType: string,
    version: string,
    requestMetadata: Object,
  ): Promise<SourceTransformationResponse[]>;
}
