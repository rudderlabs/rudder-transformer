const { BatchUtils } = require('@rudderstack/workflow-engine');
const { get } = require('lodash');
const moment = require('moment-timezone');
const { MAX_BATCH_SIZE } = require('./config');
const {
  isAppleFamily,
  isObject,
  removeUndefinedAndNullValues,
  isEmptyObject,
} = require('../../util');

const getMergedPayload = (batch) => ({
  data: batch.flatMap((input) => input.message.body.JSON.data),
});

const getMergedMetadata = (batch) => batch.map((input) => input.metadata);

const buildBatchedResponse = (
  mergedPayload,
  endpoint,
  headers,
  params,
  method,
  metadata,
  destination,
) => ({
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
const processBatch = (eventsChunk) => {
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
const batchResponseBuilder = (webOrOfflineEventsChunk, mobileEventsChunk) => {
  const webOrOfflineEventsResp = processBatch(webOrOfflineEventsChunk);
  const mobileEventsResp = processBatch(mobileEventsChunk);
  return [...webOrOfflineEventsResp, ...mobileEventsResp];
};

const getExtInfo = (message) => {
  const getValue = (path) => {
    const value = get(message, path);
    return value != null ? String(value) : null;
  };

  const extInfoVersion = isAppleFamily(message.context?.device?.type) ? 'i2' : 'a2';

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
  return extInfo.map((value) => (value == null ? '' : value));
};

const productsToContentsMapping = (message) => {
  const products = get(message, 'properties.products');
  // Extract content mapping logic into a pure function
  const mapProductToContent = (product) =>
    removeUndefinedAndNullValues({
      id: product?.product_id || product?.sku || product?.id,
      item_price: product?.price,
      quantity: product?.quantity,
      delivery_category: product?.delivery_category,
    });

  // Handle case where products array is empty or doesn't exist
  if (!Array.isArray(products) || products.length === 0) {
    const properties = get(message, 'properties');
    const content = mapProductToContent(properties);
    return isEmptyObject(content) ? [] : [content];
  }

  // Process products array using forEach approach
  const result = [];
  products.forEach((product) => {
    if (isObject(product)) {
      const content = mapProductToContent(product);
      if (!isEmptyObject(content)) {
        result.push(content);
      }
    }
  });

  return result;
};

module.exports = {
  batchResponseBuilder,
  getExtInfo,
  productsToContentsMapping,
};
