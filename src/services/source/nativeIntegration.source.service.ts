import IntegrationSourceService from "../../interfaces/IntegrationSourceService";
import {
  ErrorDetailer,
  RudderMessage,
  SourceTransformResponse
} from "../../types/index";
import { TRANSFORMER_METRIC } from "../../v0/util/constant";
import PostTransformationServiceSource from "./postTransformation.source";

export default class NativeIntegrationSourceService
  implements IntegrationSourceService {
  public async sourceTransformRoutine(
    sourceEvents: Object[],
    sourceType: string,
    sourceHandler: any,
    requestMetadata: Object
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
