import { JsonSchemaGenerator } from '@rudderstack/integrations-lib';
import { FetchHandler } from '../../helpers/fetchHandlers';
import { SourceService } from '../../interfaces/SourceService';
import {
  ErrorDetailer,
  ErrorDetailerOptions,
  MetaTransferObject,
  RudderMessage,
  SourceInputConversionResult,
  SourceTransformationEvent,
  SourceTransformationResponse,
} from '../../types/index';
import stats from '../../util/stats';
import { FixMe } from '../../util/types';
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
    sourceEvents: SourceInputConversionResult<NonNullable<SourceTransformationEvent>>[],
    sourceType: string,
    version: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _requestMetadata: NonNullable<unknown>,
  ): Promise<SourceTransformationResponse[]> {
    const sourceHandler = FetchHandler.getSourceHandler(sourceType, version);
    const metaTO = this.getTags({ srcType: sourceType });
    const respList: SourceTransformationResponse[] = await Promise.all<FixMe>(
      sourceEvents.map(async (sourceEvent) => {
        try {
          if (sourceEvent.conversionError) {
            stats.increment('source_transform_errors', {
              source: sourceType,
              version,
            });
            logger.debug(`Error during source Transform: ${sourceEvent.conversionError}`, {
              ...logger.getLogMetadata(metaTO.errorDetails),
            });
            return SourcePostTransformationService.handleFailureEventsSource(
              sourceEvent.conversionError,
              metaTO,
            );
          }

          if (sourceEvent.output) {
            const newSourceEvent = sourceEvent.output;

            const { headers } = newSourceEvent;
            if (headers) {
              delete newSourceEvent.headers;
            }

            const respEvents: RudderMessage | RudderMessage[] | SourceTransformationResponse =
              await sourceHandler.process(newSourceEvent);
            return SourcePostTransformationService.handleSuccessEventsSource(respEvents, {
              headers,
            });
          }
          return SourcePostTransformationService.handleFailureEventsSource(
            new Error('Error post version converstion, converstion output is undefined'),
            metaTO,
          );
        } catch (error: FixMe) {
          stats.increment('source_transform_errors', {
            source: sourceType,
            version,
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
      }),
    );
    return respList;
  }
}
