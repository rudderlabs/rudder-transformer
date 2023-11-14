import IntegrationSourceService from '../../interfaces/SourceService';
import {
  ErrorDetailer,
  MetaTransferObject,
  RudderMessage,
  SourceTransformationResponse,
} from '../../types/index';
import { FixMe } from '../../util/types';
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
    sourceEvents: NonNullable<unknown>[],
    sourceType: string,
    version: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _requestMetadata: NonNullable<unknown>,
  ): Promise<SourceTransformationResponse[]> {
    const sourceHandler = FetchHandler.getSourceHandler(sourceType, version);
    const respList: SourceTransformationResponse[] = await Promise.all<FixMe>(
      sourceEvents.map(async (sourceEvent) => {
        try {
          const respEvents: RudderMessage | RudderMessage[] | SourceTransformationResponse =
            await sourceHandler.process(sourceEvent);
          return PostTransformationServiceSource.handleSuccessEventsSource(respEvents);
        } catch (error: FixMe) {
          const metaTO = this.getTags();
          stats.increment('source_transform_errors', {
            source: sourceType,
            version,
          });
          return PostTransformationServiceSource.handleFailureEventsSource(error, metaTO);
        }
      }),
    );
    return respList;
  }
}
