import { MetaTransferObject, SourceTransformationResponse } from '../types/index';

export default interface SourceService {
  getTags(): MetaTransferObject;

  sourceTransformRoutine(
    sourceEvents: NonNullable<unknown>[],
    sourceType: string,
    version: string,
    requestMetadata: NonNullable<unknown>,
  ): Promise<SourceTransformationResponse[]>;
}
