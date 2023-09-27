import IntegrationSourceService from '../../interfaces/SourceService';
import {
  ErrorDetailer,
  MetaTransferObject,
  RudderMessage,
  SourceTransformationResponse,
  SourceInput,
} from '../../types/index';
import PostTransformationServiceSource from './postTransformation';
import FetchHandler from '../../helpers/fetchHandlers';
import tags from '../../v0/util/tags';
import stats from '../../util/stats';

export default class NativeIntegrationSourceService implements IntegrationSourceService {
  public getTags(): MetaTransferObject {
    const metaTO = {
      errorDetails: {
        module: tags.MODULES.SOURCE,
        implementation: tags.IMPLEMENTATIONS.NATIVE,
        destinationId: 'Non determinable',
        workspaceId: 'Non determinable',
      } as ErrorDetailer,
      errorContext: '[Native Integration Service] Failure During Source Transform',
    } as MetaTransferObject;
    return metaTO;
  }

  public async sourceTransformRoutine(
    sourceEvents: unknown[],
    sourceType: string,
    version: string,
    _requestMetadata: Object,
  ): Promise<SourceTransformationResponse[]> {
    // if shopify/v1 , webhook/v1 (error) => webhook/v0
    let sourceHandler: any;
    let sourceVersion = version;
    try {
      sourceHandler = FetchHandler.getSourceHandler(sourceType, version);
   } catch (error) {
       if (version === 'v1') {
        sourceEvents = (sourceEvents as SourceInput[]).map(sourceEvent => sourceEvent.event);
        sourceVersion = 'v0';
        sourceHandler = FetchHandler.getSourceHandler(sourceType, sourceVersion);
      } else {
        throw error;
      }
    }
    const respList: SourceTransformationResponse[] = await Promise.all<any>(
      sourceEvents.map(async (sourceEvent) => {
        try {
          let respEvents: RudderMessage | RudderMessage[] | SourceTransformationResponse;
          if (sourceVersion === "v1") {
            respEvents = await sourceHandler.process(sourceEvent as SourceInput);
          } else {
            respEvents = await sourceHandler.process(sourceEvent);
          }
          return PostTransformationServiceSource.handleSuccessEventsSource(respEvents);
        } catch (error: any) {
          const metaTO = this.getTags();
          stats.increment('source_transform_errors', {
            sourceType,
            version,
          });
          return PostTransformationServiceSource.handleFailureEventsSource(error, metaTO);
        }
      }),
    );
    return respList;
  }
}
