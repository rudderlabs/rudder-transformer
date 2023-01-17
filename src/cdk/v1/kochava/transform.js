const { Utils } = require('rudder-transformer-cdk');

const eventNameMapping = {
  'product added': 'Add to Cart',
  'product added to wishlist': 'Add to Wishlist',
  'checkout started': 'Checkout Start',
  'order completed': 'Purchase',
  'product reviewed': 'Rating',
  'products searched': 'Search',
};

function processExtraPayloadParams(event, mappedPayload) {
  const { message } = event;
  let eventName = message.event;
  const eventData = message.properties || {};
  switch (message.type.toLowerCase()) {
    case 'screen':
      eventName = 'screen view';
      if (message.properties && message.properties.name) {
        eventName += ` ${message.properties.name}`;
      }
      break;
    case 'track':
      if (eventName) {
        const evName = eventName.toLowerCase();
        if (eventNameMapping[evName] !== undefined) {
          eventName = eventNameMapping[evName];
        }
      }
      break;
    default:
      break;
  }

  const extraParams = {
    // This kind of formatting multiple fields into a single one
    // is currently not supported in cdk
    app_tracking_transparency: {
      att: message.context?.device?.attTrackingStatus === 3 || false,
    },
    device_ver:
      message.context?.device?.model && message.context?.os?.version
        ? `${message.context?.device?.model}-${message.context?.os?.name}-${message.context?.os?.version}`
        : '',
    device_ids: {
      idfa:
        message.context?.os?.name && Utils.isAppleFamily(message.context?.os?.name)
          ? message.context?.device?.advertisingId || ''
          : '',
      idfv:
        message.context?.os?.name && Utils.isAppleFamily(message.context?.os?.name)
          ? message.context?.device?.id || message.anonymousId || ''
          : '',
      adid:
        message.context?.os?.name && message.context.os.name.toLowerCase() === 'android'
          ? message.context?.device?.advertisingId || ''
          : '',
      android_id:
        message.context?.os?.name && message.context.os.name.toLowerCase() === 'android'
          ? message.context?.device?.id || message.anonymousId || ''
          : '',
    },
    event_name: eventName,
    device_ua: message.context?.userAgent || '',
    currency: eventData?.currency || 'USD',
  };
  mappedPayload.data = { ...mappedPayload.data, ...extraParams };
  // Note: "defaultValue" cannot be empty string hence had to manually set it here since kochava requires it
  if (Utils.getValueFromMessage(message, 'context.os.version') === '') {
    mappedPayload.data.os_version = '';
  }
  return mappedPayload;
}

module.exports = {
  processExtraPayloadParams,
};
