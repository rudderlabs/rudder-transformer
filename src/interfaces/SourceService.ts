import { MetaTransferObject, SourceTransformationResponse } from '../types/index';

export default interface SourceService {
  getTags(): MetaTransferObject;

  sourceTransformRoutine(
    sourceEvents: object[],
    sourceType: string,
    version: string,
    requestMetadata: object,
  ): Promise<SourceTransformationResponse[]>;
}
