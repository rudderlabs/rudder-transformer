import { ObjectType, SourceTransformResponse } from "../types/types";

export default interface IntegrationServiceSource {
  sourceTransformRoutine(
    sourceEvents: ObjectType[],
    sourceType: string,
    sourceHandler: any,
    requestMetadata: ObjectType
  ): Promise<SourceTransformResponse[]>;
}
