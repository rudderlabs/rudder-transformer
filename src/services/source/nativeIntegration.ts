import { FetchHandler } from '../../helpers/fetchHandlers';
import { SourceService } from '../../interfaces/SourceService';
import {
  ErrorDetailer,
  MetaTransferObject,
  RudderMessage,
  SourceTransformationEvent,
  SourceTransformationResponse,
} from '../../types/index';
import stats from '../../util/stats';
import { FixMe } from '../../util/types';
import tags from '../../v0/util/tags';
import { SourcePostTransformationService } from './postTransformation';
import logger from '../../logger';

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
    sourceEvents: NonNullable<SourceTransformationEvent>[],
    sourceType: string,
    version: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _requestMetadata: NonNullable<unknown>,
  ): Promise<SourceTransformationResponse[]> {
    const sourceHandler = FetchHandler.getSourceHandler(sourceType, version);
    const metaTO = this.getTags();
    const respList: SourceTransformationResponse[] = await Promise.all<FixMe>(
      sourceEvents.map(async (sourceEvent) => {
        try {
          const newSourceEvent = sourceEvent;
          const { headers } = newSourceEvent;
          delete newSourceEvent.headers;
          const respEvents: RudderMessage | RudderMessage[] | SourceTransformationResponse =
            await sourceHandler.process(newSourceEvent);
          return SourcePostTransformationService.handleSuccessEventsSource(respEvents, { headers });
        } catch (error: FixMe) {
          stats.increment('source_transform_errors', {
            source: sourceType,
            version,
          });
          logger.debug(`Error during source Transform: ${error}`, {
            ...logger.getLogMetadata(metaTO.errorDetails),
          });
          return SourcePostTransformationService.handleFailureEventsSource(error, metaTO);
        }
      }),
    );
    return respList;
  }
}
