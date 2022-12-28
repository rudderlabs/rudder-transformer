import { SourceTransformResponse } from "../types/index";

export default interface IntegrationSourceService {
  sourceTransformRoutine(
    sourceEvents: Object[],
    sourceType: string,
    version: string,
    requestMetadata: Object
  ): Promise<SourceTransformResponse[]>;
}
