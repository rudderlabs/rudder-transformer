import { BatchUtils } from '@rudderstack/workflow-engine';
import { get } from 'lodash';
import moment from 'moment-timezone';
import { MAX_BATCH_SIZE } from './config';
import { isAppleFamily } from '../../util';
import { Metadata, RudderMessage } from '../../../types';
import {
  ProcessedEvent,
  SnapchatDestination,
  SnapchatV3Params,
  SnapchatPayloadV3,
  SnapchatV3BatchRequestOutput,
} from './types';

export const getMergedPayload = (batch: ProcessedEvent[]): SnapchatPayloadV3 => ({
  data: batch.flatMap((input) => {
    const json = input.message.body.JSON as SnapchatPayloadV3;
    return json.data;
  }),
});

export const getMergedMetadata = (batch: ProcessedEvent[]): Partial<Metadata>[] =>
  batch.map((input) => input.metadata);

export const buildBatchedResponse = (
  mergedPayload: SnapchatPayloadV3,
  endpoint: string,
  headers: Record<string, any>,
  params: SnapchatV3Params,
  method: string,
  metadata: Partial<Metadata>[],
  destination: SnapchatDestination,
): SnapchatV3BatchRequestOutput => ({
  batchedRequest: {
    body: {
      JSON: mergedPayload,
      JSON_ARRAY: {},
      XML: {},
      FORM: {},
    },
    version: '1',
    type: 'REST',
    method,
    endpoint,
    headers,
    params,
    files: {},
  },
  metadata,
  batched: true,
  statusCode: 200,
  destination,
});

export const processBatch = (eventsChunk: ProcessedEvent[]): SnapchatV3BatchRequestOutput[] => {
  if (!eventsChunk?.length) {
    return [];
  }
  const batches = BatchUtils.chunkArrayBySizeAndLength(eventsChunk, { maxItems: MAX_BATCH_SIZE });
  return batches.items.map((batch) => {
    const mergedPayload = getMergedPayload(batch);
    const mergedMetadata = getMergedMetadata(batch);
    const { endpoint, headers, params, method } = batch[0].message;
    return buildBatchedResponse(
      mergedPayload,
      endpoint,
      headers,
      params,
      method,
      mergedMetadata,
      batch[0].destination,
    );
  });
};

export const batchResponseBuilder = (
  webOrOfflineEventsChunk: ProcessedEvent[],
  mobileEventsChunk: ProcessedEvent[],
): SnapchatV3BatchRequestOutput[] => {
  const webOrOfflineEventsResp = processBatch(webOrOfflineEventsChunk);
  const mobileEventsResp = processBatch(mobileEventsChunk);
  return [...webOrOfflineEventsResp, ...mobileEventsResp];
};

export const getExtInfo = (message: RudderMessage): string[] | null => {
  const getValue = (path: string): string | null => {
    const value = get(message, path);
    return value != null ? String(value) : null;
  };

  const extInfoVersion = isAppleFamily(getValue('context.device.type')) ? 'i2' : 'a2';

  // App related information
  const appInfo = {
    packageName: getValue('context.app.namespace'),
    buildNumber: getValue('context.app.build'),
    versionName: getValue('context.app.version'),
  };

  // Device related information
  const deviceInfo = {
    model: getValue('context.device.model'),
    storage: getValue('properties.storage'),
    freeStorage: getValue('properties.free_storage'),
  };

  // OS related information
  const osInfo = {
    version: getValue('context.os.version'),
    cpuCores: getValue('properties.cpu_cores'),
  };

  // Screen related information
  const screenInfo = {
    width: getValue('context.screen.width'),
    height: getValue('context.screen.height'),
    density: getValue('context.screen.density'),
  };

  // User environment information
  const environmentInfo = {
    locale: getValue('context.locale'),
    timezone: getValue('context.timezone'),
    carrier: getValue('context.network.carrier'),
    timezoneAbbr: null as string | null,
  };
  if (environmentInfo.timezone) {
    environmentInfo.timezoneAbbr = moment().tz(environmentInfo.timezone)?.format('z');
  }

  const extInfo = [
    extInfoVersion,
    appInfo.packageName,
    appInfo.buildNumber,
    appInfo.versionName,
    osInfo.version,
    deviceInfo.model,
    environmentInfo.locale,
    environmentInfo.timezoneAbbr,
    environmentInfo.carrier,
    screenInfo.width,
    screenInfo.height,
    screenInfo.density,
    osInfo.cpuCores,
    deviceInfo.storage,
    deviceInfo.freeStorage,
    environmentInfo.timezone,
  ];

  if (extInfo.some((value) => value == null)) {
    return null;
  }

  // Convert all values to strings and filter out nulls
  return extInfo.map((value) => (value === null ? '' : String(value))) as string[];
};
