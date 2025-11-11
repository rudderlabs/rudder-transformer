import {
  MetaTransferObject,
  SourceInputV2,
  SourceTransformationResponse,
  SourceHydrationRequest,
  SourceHydrationOutput,
} from '../types/index';

export interface SourceService {
  getTags(): MetaTransferObject;

  sourceTransformRoutine(
    sourceEvents: NonNullable<SourceInputV2>[],
    sourceType: string,
    requestMetadata: NonNullable<unknown>,
  ): Promise<SourceTransformationResponse[]>;

  sourceHydrateRoutine(
    input: SourceHydrationRequest,
    sourceType: string,
  ): Promise<SourceHydrationOutput>;
}
