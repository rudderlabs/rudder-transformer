import { SourceTransformResponse } from "../types/index";

export default interface IntegrationSourceService {
  sourceTransformRoutine(
    sourceEvents: Object[],
    sourceType: string,
    sourceHandler: any,
    requestMetadata: Object
  ): Promise<SourceTransformResponse[]>;
}
