import IntegrationSourceService from "../../interfaces/SourceService";
import {
  ErrorDetailer,
  MetaTransferObject,
  RudderMessage,
  SourceTransformResponse
} from "../../types/index";
import PostTransformationServiceSource from "./postTransformation";
import FetchHandler from "../../helpers/fetchHandlers";
import tags from "../../v0/util/tags";

export default class NativeIntegrationSourceService
  implements IntegrationSourceService {
  public getTags(): MetaTransferObject {
    const metaTO = {
      errorDetails: {
        module: tags.MODULES.SOURCE,
        implementation: tags.IMPLEMENTATIONS.NATIVE,
        destinationId: "Non determinable",
        workspaceId: "Non determinable",
        context: "[Native Integration Service] Failure During Source Transform"
      } as ErrorDetailer
    } as MetaTransferObject;
    return metaTO;
  }
  public async sourceTransformRoutine(
    sourceEvents: Object[],
    sourceType: string,
    version: string,
    _requestMetadata: Object
  ): Promise<SourceTransformResponse[]> {
    const sourceHandler = FetchHandler.getSourceHandler(sourceType, version);
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
          const metaTO = this.getTags();
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
