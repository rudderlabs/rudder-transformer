import { Metadata } from '../../../../types';
import { ProcessedEvent, SFMCDestination, SFMCBatchResponse } from '../type';

export const createBatchResponse = (
  batchedRequest: any,
  metadata: Partial<Metadata>[],
  destination: SFMCDestination,
): SFMCBatchResponse => ({
  batchedRequest,
  metadata,
  destination,
  batched: true,
  statusCode: 200,
});

export const createUpsertObjects = (payload: ProcessedEvent[], dataExtensionKey: string) =>
  payload.flatMap((resp) => {
    const { keys, values } = resp.payload;
    const keysProperties = Object.entries(keys).map(([key, value]) => ({
      Name: key,
      Value: value,
    }));

    const valuesProperties = Object.entries(values ?? {}).map(([key, value]) => ({
      Name: key,
      Value: value,
    }));

    return {
      CustomerKey: dataExtensionKey,
      Properties: {
        Property: [...keysProperties, ...valuesProperties],
      },
      '@_xsi:type': 'DataExtensionObject',
    };
  });

export const createDeleteObjects = (payload: ProcessedEvent[], dataExtensionKey: string) =>
  payload.map((resp) => {
    const { keys } = resp.payload;
    const keysArray = Object.entries(keys).map(([key, value]) => ({
      Key: {
        Name: key,
        Value: value,
      },
    }));
    return {
      CustomerKey: dataExtensionKey,
      Keys: keysArray,
      '@_xsi:type': 'DataExtensionObject',
    };
  });
