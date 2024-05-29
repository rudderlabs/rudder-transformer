/* eslint-disable no-param-reassign */
import { ProxyV0Request } from '../../types';
import { requestLog, responseLog } from './metadata';
import { Metadata, ProxyMetdata, TransformationKindInfo } from './types';

export default class MetaBinder {
  // TODO: Update implementation for `implementation` so that it can be taken from input args
  public static bindTransformMetaToDeliveryV0(
    event: ProxyV0Request,
    kindInfo: TransformationKindInfo,
  ) {
    // @ts-expect-error this assignment is necessary
    event.metadata.requestLog = requestLog(event.metadata, kindInfo);
    // @ts-expect-error this assignment is necessary
    event.metadata.responseLog = responseLog(event.metadata, kindInfo);
  }

  public static bindTransformMetaToDeliveryV1(
    metadatas: ProxyMetdata[],
    kindInfo: TransformationKindInfo,
  ) {
    // @ts-expect-error this assignment is necessary
    metadatas.requestLog = requestLog(metadatas, kindInfo);
    // @ts-expect-error this assignment is necessary
    metadatas.responseLog = responseLog(metadatas, kindInfo);
  }

  public static bindTransformMetaToTransformation(
    events: { metadata: Metadata }[],
    kindInfo: TransformationKindInfo,
  ) {
    events.forEach((ev) => {
      // @ts-expect-error this assignment is necessary
      ev.metadata.requestLog = requestLog(ev.metadata, kindInfo);
      // @ts-expect-error this assignment is necessary
      ev.metadata.responseLog = responseLog(ev.metadata, kindInfo);
    });
  }
}
