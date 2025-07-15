import { BatchUtils } from '@rudderstack/workflow-engine';
import { get } from 'lodash';
import moment from 'moment-timezone';
import { MAX_BATCH_SIZE } from './config';
import { isAppleFamily } from '../../util';
import { Metadata, RudderMessage } from '../../../types';
import {
  SnapchatV3ProcessedEvent,
  SnapchatDestination,
  SnapchatV3Params,
  SnapchatV3Payload,
  SnapchatV3BatchRequestOutput,
  SnapchatV3Headers,
} from './types';

/**
 * Merges multiple payloads into a single Snapchat V3 payload
 * @param batch - Array of processed events to merge
 * @returns A single payload with combined data from all events
 */
export const getMergedPayload = (batch: SnapchatV3ProcessedEvent[]): SnapchatV3Payload => ({
  data: batch.flatMap((input: SnapchatV3ProcessedEvent) => {
    const json = input.message.body.JSON;
    return json?.data || [];
  }),
});

/**
 * Extracts metadata from a batch of processed events
 * @param batch - Array of processed events
 * @returns Array of metadata objects from each event
 */
export const getMergedMetadata = (batch: SnapchatV3ProcessedEvent[]): Partial<Metadata>[] =>
  batch.map((input) => input.metadata);

/**
 * Builds a batched response for Snapchat V3 API
 * @param mergedPayload - The combined payload from multiple events
 * @param endpoint - The API endpoint to send the request to
 * @param headers - HTTP headers for the request
 * @param params - URL parameters for the request
 * @param method - HTTP method (POST, GET, etc.)
 * @param metadata - Array of metadata objects from each event
 * @param destination - Destination configuration
 * @returns A formatted batch request object ready to be sent to Snapchat
 */
export const buildBatchedResponse = (
  mergedPayload: SnapchatV3Payload,
  endpoint: string,
  headers: SnapchatV3Headers,
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

export const processBatch = (
  eventsChunk: SnapchatV3ProcessedEvent[],
): SnapchatV3BatchRequestOutput[] => {
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

/**
 * Builds batched responses for both web/offline and mobile events
 * @param webOrOfflineEventsChunk - Array of web or offline events
 * @param mobileEventsChunk - Array of mobile app events
 * @returns Array of batched request objects for different event types
 */
export const batchResponseBuilder = (
  webOrOfflineEventsChunk: SnapchatV3ProcessedEvent[],
  mobileEventsChunk: SnapchatV3ProcessedEvent[],
): SnapchatV3BatchRequestOutput[] => {
  const webOrOfflineEventsResp = processBatch(webOrOfflineEventsChunk);
  const mobileEventsResp = processBatch(mobileEventsChunk);
  return [...webOrOfflineEventsResp, ...mobileEventsResp];
};

/**
 * Extracts extended information from the message for mobile app events
 * @param message - The message containing the event data
 * @returns Extended information string or undefined if not available
 */
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
    try {
      environmentInfo.timezoneAbbr = moment.tz.zone(environmentInfo.timezone)
        ? moment().tz(environmentInfo.timezone).format('z')
        : null;
    } catch {
      environmentInfo.timezoneAbbr = null;
    }
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

  return extInfo.map((value) => (value == null ? '' : value));
};
