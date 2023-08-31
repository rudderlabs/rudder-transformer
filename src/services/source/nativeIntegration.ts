import { SourceService } from '../../interfaces/SourceService';
import {
  ErrorDetailer,
  MetaTransferObject,
  RudderMessage,
  SourceTransformationResponse,
} from '../../types/index';
import { PostTransformationSourceService } from './postTransformation';
import { FetchHandler } from '../../helpers/fetchHandlers';
import tags from '../../v0/util/tags';
import stats from '../../util/stats';

export class NativeIntegrationSourceService implements SourceService {
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
    sourceEvents: Object[],
    sourceType: string,
    version: string,
    _requestMetadata: Object,
  ): Promise<SourceTransformationResponse[]> {
    const sourceHandler = FetchHandler.getSourceHandler(sourceType, version);
    const respList: SourceTransformationResponse[] = await Promise.all<any>(
      sourceEvents.map(async (sourceEvent) => {
        try {
          const respEvents: RudderMessage | RudderMessage[] | SourceTransformationResponse =
            await sourceHandler.process(sourceEvent);
          return PostTransformationSourceService.handleSuccessEventsSource(respEvents);
        } catch (error: any) {
          const metaTO = this.getTags();
          stats.increment('source_transform_errors', {
            sourceType,
            version,
          });
          return PostTransformationSourceService.handleFailureEventsSource(error, metaTO);
        }
      }),
    );
    return respList;
  }
}
