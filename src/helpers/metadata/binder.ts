/* eslint-disable no-param-reassign */
import { ProxyV0Request } from '../../types';
import { TransformationMetadata } from './metadata';
import { Metadata, ProxyMetdata, TransformationKindInfo } from './types';

export default class MetaBinder {
  // TODO: Update implementation for `implementation` so that it can be taken from input args
  public static bindTransformMetaToDeliveryV0(
    event: ProxyV0Request,
    kindInfo: TransformationKindInfo,
  ) {
    const tfMetadata = new TransformationMetadata(event.metadata, kindInfo);
    event.metadata.requestLog = tfMetadata.requestLog;
    event.metadata.responseLog = tfMetadata.responseLog;
  }

  public static bindTransformMetaToDeliveryV1(
    metadatas: ProxyMetdata[],
    kindInfo: TransformationKindInfo,
  ) {
    metadatas.forEach((metadata) => {
      const tfMetadata = new TransformationMetadata(metadata, kindInfo);
      metadata.requestLog = tfMetadata.requestLog;
      metadata.responseLog = tfMetadata.responseLog;
    });
  }

  public static bindTransformMetaToTransformation(
    events: { metadata: Metadata }[],
    kindInfo: TransformationKindInfo,
  ) {
    events.forEach((ev) => {
      const tfMetadata = new TransformationMetadata(ev.metadata, kindInfo);
      ev.metadata.requestLog = tfMetadata.requestLog;
      ev.metadata.responseLog = tfMetadata.responseLog;
    });
  }
}
