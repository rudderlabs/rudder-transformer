import {
  MetaTransferObject,
  SourceHydrationResponse,
  SourceInputV2,
  SourceTransformationResponse,
} from '../types/index';

export interface SourceService {
  getTags(): MetaTransferObject;

  sourceTransformRoutine(
    sourceEvents: NonNullable<SourceInputV2>[],
    sourceType: string,
    requestMetadata: NonNullable<unknown>,
  ): Promise<SourceTransformationResponse[]>;

  sourceHydrateRoutine(
    input: Record<string, unknown>,
    sourceType: string,
  ): Promise<SourceHydrationResponse>;
}
