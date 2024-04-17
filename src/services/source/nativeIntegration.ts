import { FetchHandler } from '../../helpers/fetchHandlers';
import { SourceService } from '../../interfaces/SourceService';
import {
  ErrorDetailer,
  MetaTransferObject,
  RudderMessage,
  SourceTransformationResponse,
} from '../../types/index';
import stats from '../../util/stats';
import { FixMe } from '../../util/types';
import tags from '../../v0/util/tags';
import { MiscService } from '../misc';
import { SourcePostTransformationService } from './postTransformation';

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
    sourceEvents: NonNullable<unknown>[],
    sourceType: string,
    version: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _requestMetadata: NonNullable<unknown>,
    logger: FixMe,
  ): Promise<SourceTransformationResponse[]> {
    const sourceHandler = FetchHandler.getSourceHandler(sourceType, version);
    const metaTO = this.getTags();
    const loggerWithCtx = logger.child({ ...MiscService.getLoggableData(metaTO.errorDetails) });
    const respList: SourceTransformationResponse[] = await Promise.all<FixMe>(
      sourceEvents.map(async (sourceEvent) => {
        try {
          const respEvents: RudderMessage | RudderMessage[] | SourceTransformationResponse =
            await sourceHandler.process(sourceEvent, loggerWithCtx);
          return SourcePostTransformationService.handleSuccessEventsSource(respEvents);
        } catch (error: FixMe) {
          stats.increment('source_transform_errors', {
            source: sourceType,
            version,
          });
          logger.debug('Error during source Transform', error);
          return SourcePostTransformationService.handleFailureEventsSource(error, metaTO);
        }
      }),
    );
    return respList;
  }
}
