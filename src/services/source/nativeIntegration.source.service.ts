import IntegrationSourceService from "../../interfaces/IntegrationSourceService";
import { RudderMessage, SourceTransformResponse } from "../../types/index";
import TaggingService from "../tagging.service";
import PostTransformationServiceSource from "./postTransformation.source";
import { ServiceSelector } from "../../util/serviceSelector";

export default class NativeIntegrationSourceService
  implements IntegrationSourceService {
  public async sourceTransformRoutine(
    sourceEvents: Object[],
    sourceType: string,
    version: string,
    _requestMetadata: Object
  ): Promise<SourceTransformResponse[]> {
    const sourceHandler = ServiceSelector.getSourceHandler(sourceType, version);
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
          const metaTO = TaggingService.getNativeSourceTransformTags();
          return PostTransformationServiceSource.handleFailureEventsSource(
            error,
            metaTO
          );
        }
      })
    );
    return respList;
  }
}
