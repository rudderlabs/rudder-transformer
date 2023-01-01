import { MetaTransferObject, SourceTransformResponse } from "../types/index";

export default interface SourceService {
  getTags(): MetaTransferObject;

  sourceTransformRoutine(
    sourceEvents: Object[],
    sourceType: string,
    version: string,
    requestMetadata: Object
  ): Promise<SourceTransformResponse[]>;
}
