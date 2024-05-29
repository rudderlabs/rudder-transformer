/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import logger from '../../logger';
import {
  AllMetadata,
  Metadata,
  ProxyMetdata,
  RequestInfo,
  ResponseInfo,
  TransformationKindInfo,
} from './types';

const pickMetaInfo = (m: Metadata | ProxyMetdata, tfKind: TransformationKindInfo) => {
  const { sourceId, destinationId, workspaceId, jobId } = m;
  const { module, feature, implementation } = tfKind;
  return {
    sourceId,
    destinationId,
    jobId,
    // destinationType,
    workspaceId,
    module,
    feature,
    implementation,
  };
};
export function requestLog(this: AllMetadata, kindInfo: TransformationKindInfo) {
  return function internalReqLog(identifierMsg: string, args: RequestInfo) {
    // do something before if necessary
    if (Array.isArray(this)) {
      this.forEach((m) => {
        logger.debug(identifierMsg, {
          ...pickMetaInfo(m, kindInfo),
          ...args,
        });
      });
      return;
    }
    logger.debug(identifierMsg, {
      ...pickMetaInfo(this, kindInfo),
      ...args,
    });
  };
}

export function responseLog(this: AllMetadata, kindInfo: TransformationKindInfo) {
  return function internalResLog(identifierMsg: string, args: ResponseInfo) {
    // do something before if necessary
    if (Array.isArray(this)) {
      this.forEach((m) => {
        logger.debug(identifierMsg, {
          ...pickMetaInfo(m, kindInfo),
          ...args,
        });
      });
      return;
    }
    logger.debug(identifierMsg, {
      ...pickMetaInfo(this, kindInfo),
      ...args,
    });
  };
}
