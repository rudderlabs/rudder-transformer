const { getHashFromArrayWithDuplicate, isDefinedAndNotNull, ConfigurationError,  TransformationError,
    InstrumentationError, } = require('@rudderstack/integrations-lib');
  const { EventType } = require('../../../constants');
  const {
   constructPayload,
    ErrorMessage,
    defaultRequestConfig,
    getValueFromMessage,
    simpleProcessRouterDest,
    validateEventName,
  } = require('../../util');
  
  const {
    MAPPING_CONFIG,
    CONFIG_CATEGORIES,
    BASE_URL,
    EVENT_NAME_MAPPING,
  } = require('./config');
  
  const verifyTrackPayload = (payload) => {
  switch (payload.event) {
    case 'search':
      if (!payload.properties.search_term) {
        throw new InstrumentationError('[Bluecore] property:: search_query is required for search event');
      }
      break;
    case 'purchase':
      if (!payload.properties.order_id) {
        throw new InstrumentationError('[Bluecore] property:: order_id is required for purchase event');
      }
      if (!payload.properties.total) {
        throw new InstrumentationError('[Bluecore] property:: total is required for purchase event');
      }
      break;
      default:
        break;
  }
  };
  
  const deduceTrackEventName = (trackEventName, Config) => {
    let eventName;
    const { eventsMapping } = Config;
    validateEventName(trackEventName);
    /*
    Step 1: If the event is not amongst the above list of ecommerce events, will look for
            the event mapping in the UI. In case it is similar, will map to that.
     */
    if (eventsMapping.length > 0) {
        const keyMap = getHashFromArrayWithDuplicate(eventsMapping, 'from', 'to', false);
        eventName = keyMap[trackEventName];
    }
    /*
    Step 2: To find if the particular event is amongst the list of standard
            Rudderstack ecommerce events, used specifically for Bluecore API
            mappings.
    */
    if (!eventName) {
        const eventMapInfo = EVENT_NAME_MAPPING.find((eventMap) => {
            if (eventMap.src.includes(trackEventName.toLowerCase())) {
                return eventMap;
            }
            return false;
        });
        if (!isDefinedAndNotNull(eventMapInfo)) {
            throw new ConfigurationError(`[Bluecore] Event name ${trackEventName} is not mapped`);
        } else {
          return [eventMapInfo.dest];
        }
    }
    return eventName;
  };
  const trackResponseBuilder = (message, category, { Config }, eventName) => {
    const event = getValueFromMessage(message, 'event');
    
    if (!event) {
      throw new InstrumentationError('[Bluecore] property:: event is required for track call');
    }
  
    const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
    payload.event = eventName;
    verifyTrackPayload(payload);
    payload.token = Config.bluecoreNamespace;
    if (!payload) {
      // fail-safety for developer error
      throw new TransformationError(ErrorMessage.FailedToConstructPayload);
    }
    return payload;
  };
  
  // const identifyResponseBuilder = async (message, category, { Config }) => {
  
  // }
  
  const responseBuilderSimple = (response) => {
    const resp = defaultRequestConfig();
    resp.endpoint = BASE_URL;
    resp.body.JSON = response;
    resp.headers = {
      'Content-Type': 'application/json',
    };
    return resp;
  }
  
  const process = async (event) => {
    const deducedEventNameArray = [];
    const toSendEvents = [];
    const respList = [];
    const { message, destination } = event;
    if (!message.type) {
      throw new InstrumentationError('Message Type is not present. Aborting message.');
    }
  
    if (!destination.Config.bluecoreNamespace) {
      throw new ConfigurationError('[BLUECORE] bluecore account namespace required for Authentication.');
    }
    const messageType = message.type.toLowerCase();
    const category = CONFIG_CATEGORIES[message.type.toUpperCase()];
    switch (messageType) {
      case EventType.TRACK:
        deducedEventNameArray.push(...deduceTrackEventName(message.event, destination.Config));
        deducedEventNameArray.forEach((eventName) => {
            const trackResponse = trackResponseBuilder(message, category, destination, eventName);
          toSendEvents.push(trackResponse);
        });
        break;
      case EventType.IDENTIFY:
        // response = await identifyResponseBuilder(message, category, destination);
        break;
      default:
        throw new InstrumentationError(`Message type ${messageType} not supported`);
    }
    toSendEvents.forEach((sendEvent) => {
      respList.push(responseBuilderSimple(sendEvent));
    });
    return respList;
  };
  
  const processRouterDest = async (inputs, reqMetadata) => {
    const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
    return respList;
  };
  
  module.exports = { process, processRouterDest };