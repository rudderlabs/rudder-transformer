import {
  JsonSchemaGenerator,
  mapInBatches,
  TransformationError,
} from '@rudderstack/integrations-lib';
import { FetchHandler } from '../../helpers/fetchHandlers';
import { SourceService } from '../../interfaces/SourceService';
import {
  ErrorDetailer,
  ErrorDetailerOptions,
  MetaTransferObject,
  RudderMessage,
  SourceInputV2,
  SourceTransformationResponse,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  FixMe,
} from '../../types';
import stats from '../../util/stats';
import tags from '../../v0/util/tags';
import { SourcePostTransformationService } from './postTransformation';
import logger from '../../logger';
import { getBodyFromV2SpecPayload } from '../../v0/util';

export class NativeIntegrationSourceService implements SourceService {
  public getTags(extraErrorDetails: ErrorDetailerOptions = {}): MetaTransferObject {
    const metaTO = {
      errorDetails: {
        module: tags.MODULES.SOURCE,
        implementation: tags.IMPLEMENTATIONS.NATIVE,
        destinationId: 'Non determinable',
        workspaceId: 'Non determinable',
        ...extraErrorDetails,
      } as ErrorDetailer,
      errorContext: '[Native Integration Service] Failure During Source Transform',
    } as MetaTransferObject;
    return metaTO;
  }

  public async sourceTransformRoutine(
    sourceEvents: NonNullable<SourceInputV2>[],
    sourceType: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _requestMetadata: NonNullable<unknown>,
  ): Promise<SourceTransformationResponse[]> {
    if (!Array.isArray(sourceEvents)) {
      throw new TransformationError('Invalid source events');
    }
    const sourceHandler = FetchHandler.getSourceHandler(sourceType);
    const metaTO = this.getTags({ srcType: sourceType });
    const respList: SourceTransformationResponse[] = await mapInBatches(
      sourceEvents,
      async (sourceEvent) => {
        try {
          const respEvents: RudderMessage | RudderMessage[] | SourceTransformationResponse =
            await sourceHandler.process(sourceEvent);
          return SourcePostTransformationService.handleSuccessEventsSource(respEvents, {});
        } catch (error: FixMe) {
          stats.increment('source_transform_errors', {
            source: sourceType,
          });
          logger.debug(`Error during source Transform: ${error}`, {
            ...logger.getLogMetadata(metaTO.errorDetails),
          });
          // log the payload schema here
          const duplicateSourceEvent: any = sourceEvent;
          try {
            duplicateSourceEvent.output.request.body = getBodyFromV2SpecPayload(
              duplicateSourceEvent?.output,
            );
          } catch (e) {
            /* empty */
          }
          logger.error(
            `Sample Payload Schema for source ${sourceType} : ${JSON.stringify(JsonSchemaGenerator.generate(duplicateSourceEvent))}`,
          );

          return SourcePostTransformationService.handleFailureEventsSource(error, metaTO);
        }
      },
      { sequentialProcessing: false }, // concurrent processing
    );
    return respList;
  }
}
