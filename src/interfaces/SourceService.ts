import {
  MetaTransferObject,
  SourceInputV2,
  SourceTransformationResponse,
  RequestMetadata,
} from '../types/index';

export interface SourceService {
  getTags(): MetaTransferObject;

  sourceTransformRoutine(
    sourceEvents: NonNullable<SourceInputV2>[],
    sourceType: string,
    requestMetadata: RequestMetadata,
  ): Promise<SourceTransformationResponse[]>;
}
