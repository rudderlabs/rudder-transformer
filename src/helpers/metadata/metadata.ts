import logger from '../../logger';
import { Metadata, ProxyMetdata, RequestInfo, ResponseInfo, TransformationKindInfo } from './types';

export class TransformationMetadata {
  private m: Metadata | ProxyMetdata;

  private tfKind: TransformationKindInfo;

  constructor(m: Metadata | ProxyMetdata, tfKind: TransformationKindInfo) {
    this.m = m;
    this.tfKind = tfKind;
  }

  private pickMetaInfo() {
    const { sourceId, destinationId, workspaceId } = this.m;
    const { module, feature, implementation } = this.tfKind;
    return {
      sourceId,
      destinationId,
      // destinationType,
      workspaceId,
      module,
      feature,
      implementation,
    };
  }

  requestLog(identifierMsg: string, args: RequestInfo) {
    // do something before if necessary
    logger.debug(identifierMsg, {
      ...this.pickMetaInfo(),
      ...args,
    });
  }

  responseLog(identifierMsg: string, args: ResponseInfo) {
    // do something before if necessary
    logger.debug(identifierMsg, {
      ...this.pickMetaInfo(),
      ...args,
    });
  }
}
