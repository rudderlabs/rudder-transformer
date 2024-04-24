import { MetaTransferObject, SourceTransformationResponse } from '../types/index';
import { FixMe } from '../util/types';

export interface SourceService {
  getTags(): MetaTransferObject;

  sourceTransformRoutine(
    sourceEvents: NonNullable<unknown>[],
    sourceType: string,
    version: string,
    requestMetadata: NonNullable<unknown>,
    logger: FixMe,
  ): Promise<SourceTransformationResponse[]>;
}
