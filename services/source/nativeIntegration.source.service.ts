import IntegrationServiceSource from "../../interfaces/IntegrationServiceSource";
import {
  ErrorDetailer,
  ObjectType,
  RudderMessage,
  SourceTransformResponse
} from "../../types/types";
import { TRANSFORMER_METRIC } from "../../v0/util/constant";
import PostTransformationServiceSource from "./postTransformation.source";

export default class NativeIntegrationServiceSource
  implements IntegrationServiceSource {
  public async sourceTransformRoutine(
    sourceEvents: ObjectType[],
    sourceType: string,
    sourceHandler: any,
    requestMetadata: ObjectType
  ): Promise<SourceTransformResponse[]> {
    const respList: SourceTransformResponse[] = await Promise.all<any>(
      sourceEvents.map(async sourceEvent => {
        try {
          const respEvents:
            | RudderMessage
            | RudderMessage[]
            | SourceTransformResponse = await sourceHandler.process(
            sourceEvent
          );

          return PostTransformationServiceSource.handleSuccessEventsSource(
            respEvents
          );
        } catch (error) {
          const errorDTO = {
            stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
            integrationType: sourceType,
            serverRequestMetadata: requestMetadata,
            inputPayload: sourceEvent,
            errorContext:
              "[Native Integration Service] Failure During Source Transform"
          } as ErrorDetailer;
          return PostTransformationServiceSource.handleFailureEventsSource(
            error,
            errorDTO
          );
        }
      })
    );
    return respList;
  }
}
