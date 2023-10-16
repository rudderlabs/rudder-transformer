import fs = require('fs');
import path = require('path');
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

  private getSourceVersionsMap(): object {
    const versionSourceMap: object = {};
    const versions = ["v0", "v1"]
    versions.forEach(version => {
      const directoryPath = path.resolve(`src/${version}/sources`);
      const files = fs.readdirSync(directoryPath, { withFileTypes: true });
      versionSourceMap[version] = files.filter(file => file.isDirectory())
        .map(folder => folder.name)
    });
    return versionSourceMap;
  }

  public async sourceTransformRoutine(
    sourceEvents: unknown[],
    sourceType: string,
    version: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _requestMetadata: object,
  ): Promise<SourceTransformationResponse[]> {
    // if shopify/v1 , webhook/v1 (error) => webhook/v0
    let sourceHandler: any;
    let sourceVersion = version;
    // version and sourceEvents structure handling
    const sourceVersionsMap: object = this.getSourceVersionsMap();
    if (!sourceVersionsMap[version].includes(sourceType)) {
      if (version === "v1") {
        sourceVersion = "v0"
        // eslint-disable-next-line no-param-reassign
        sourceEvents = (sourceEvents as SourceInput[]).map(sourceEvent => sourceEvent.event);
      } else {
        sourceVersion = "v1"
        // eslint-disable-next-line no-param-reassign
        sourceEvents = sourceEvents.map(sourceEvent => ({ event: sourceEvent, source: undefined }));
      }
    }
    /* 
    * Here `version` is the version to which server has sent the event to and 
    * `sourceVersion` is the updated version that trasformer internally would be using for a source
    */
    try {
      sourceHandler = FetchHandler.getSourceHandler(sourceType, sourceVersion);
    } catch (error) {
      throw error;
    }
    const respList: SourceTransformationResponse[] = await Promise.all<any>(
      sourceEvents.map(async (sourceEvent) => {
        try {
          let respEvents: RudderMessage | RudderMessage[] | SourceTransformationResponse;
          if (sourceVersion === "v1") {
            if (version === "v0") {
              respEvents = await sourceHandler.process({ event: { sourceEvent }, source: undefined });
            } else {
              respEvents = await sourceHandler.process(sourceEvent as SourceInput);
            }
          } else if (version === "v1") {
            respEvents = await sourceHandler.process((sourceEvent as SourceInput).event);
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
