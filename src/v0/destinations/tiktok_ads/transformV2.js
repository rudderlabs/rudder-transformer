/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
const set = require('set-value');
const {
  ConfigurationError,
  InstrumentationError,
  groupByInBatches,
  isDefinedAndNotNull,
  get,
} = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../constants');
const {
  constructPayload,
  defaultRequestConfig,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  defaultBatchRequestConfig,
  getSuccessRespEvents,
  isDefinedAndNotNullAndNotEmpty,
  getDestinationExternalID,
  getHashFromArrayWithDuplicate,
  handleRtTfSingleEventError,
  validateEventName,
  sortBatchesByMinJobId,
  isAppleFamily,
} = require('../../util');
const { getContents, hashUserField, getEventSource } = require('./util');
const config = require('./config');

const {
  trackMappingV2,
  trackEndpointV2,
  eventNameMapping,
  PARTNER_NAME,
  eventsWithRecommendedParams,
} = config;
const { JSON_MIME_TYPE } = require('../../util/constant');

/**
 * Generated track payload for an event using TikTokTrackV2.json config mapping,
 * hashing user properties and
 * defining contents from products
 * @param {*} message
 * @param {*} Config
 * @param {*} event
 * @returns track payload
 */
const getTrackResponsePayload = (message, destConfig, event, setDefaultForContentType = true) => {
  const payload = constructPayload(message, trackMappingV2);

  // if contents is not an array converting it into array
  if (payload.properties?.contents && !Array.isArray(payload.properties.contents)) {
    payload.properties.contents = [payload.properties.contents];
  }

  // if contents is not present but we have properties.products present which has fields with superset of contents fields
  if (!payload.properties?.contents && message.properties?.products) {
    // retreiving data from products only when contents is not present
    // properties object may be empty due which next line may give some error
    payload.properties = payload.properties || {};
    payload.properties.contents = getContents(message, false);
  }

  // if contents is present then we need to add contents_ids and num_items to the payload
  if (payload.properties?.contents?.length > 0) {
    const contentIds = payload.properties.contents
      .map((content) => content.content_id)
      .filter(Boolean);

    if (contentIds.length > 0) {
      payload.properties.contents_ids = contentIds;
      payload.properties.num_items = contentIds.length;
    }
  }

  // getting externalId and hashing it and storing it in
  const externalId = getDestinationExternalID(message, 'tiktokExternalId');
  if (isDefinedAndNotNullAndNotEmpty(externalId)) {
    set(payload, 'user.external_id', externalId);
  }
  if (destConfig.hashUserProperties && isDefinedAndNotNullAndNotEmpty(payload.user)) {
    payload.user = hashUserField(payload.user);
  }

  // remove idfa/idfv/gaid from user object depending on the android/ios
  const os = get(message, 'context.os.name');

  if (isDefinedAndNotNull(os) && payload.user) {
    if (isAppleFamily(os)) {
      delete payload.user.gaid;
    } else if (os.toLowerCase() === 'android') {
      delete payload.user.idfa;
      delete payload.user.idfv;
    }
  }

  // setting content-type default value in case of all standard event except `page-view`
  if (!payload.properties?.content_type && setDefaultForContentType) {
    // properties object may be empty due which next line may give some error
    payload.properties = payload.properties || {};
    payload.properties.content_type = 'product';
  }
  payload.event = event;
  // add partner name and return payload
  return removeUndefinedAndNullValues(payload);
};

const trackResponseBuilder = async (message, { Config }) => {
  const { eventsToStandard, sendCustomEvents, accessToken, pixelCode } = Config;
  validateEventName(message.event);
  let event = message.event?.toLowerCase().trim();
  if (!event) {
    throw new InstrumentationError('Event name is required');
  }

  const standardEventsMap = getHashFromArrayWithDuplicate(eventsToStandard);

  if (!sendCustomEvents && eventNameMapping[event] === undefined && !standardEventsMap[event]) {
    throw new InstrumentationError(
      `Event name (${event}) is not valid, must be mapped to one of standard events`,
    );
  }
  const response = defaultRequestConfig();
  response.headers = {
    'Access-Token': accessToken,
    'Content-Type': JSON_MIME_TYPE,
  };
  // tiktok doc for request: https://business-api.tiktok.com/portal/docs?id=1771100865818625
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = trackEndpointV2;
  const responseList = [];
  if (standardEventsMap[event]) {
    Object.keys(standardEventsMap).forEach((key) => {
      if (key === event) {
        standardEventsMap[event].forEach((eventName) => {
          responseList.push(
            getTrackResponsePayload(
              message,
              Config,
              eventName,
              eventsWithRecommendedParams.includes(eventName),
            ),
          );
        });
      }
    });
  } else if (!eventNameMapping[event]) {
    /* 
    Custom Event Case -> if there exists no event mapping we will build payload with custom event recieved
    For custom event we do not want to lower case the event or trim it we just want to send those as it is
    Doc https://ads.tiktok.com/help/article/standard-events-parameters?lang=en
    */
    event = message.event;
    responseList.push(
      getTrackResponsePayload(message, Config, event, eventsWithRecommendedParams.includes(event)),
    );
  } else {
    // incoming event name is already a standard event name
    event = eventNameMapping[event];
    responseList.push(
      getTrackResponsePayload(message, Config, event, eventsWithRecommendedParams.includes(event)),
    );
  }
  // set event source and event_source_id
  response.body.JSON = {
    event_source: getEventSource(message),
    event_source_id: pixelCode,
    partner_name: PARTNER_NAME,
    test_event_code: message.properties?.testEventCode,
  };
  response.body.JSON.data = responseList;
  return response;
};

const process = async (event) => {
  const { message, destination } = event;

  if (!destination.Config.accessToken) {
    throw new ConfigurationError('Access Token not found. Aborting');
  }

  if (!destination.Config.pixelCode) {
    throw new ConfigurationError('Pixel Code not found. Aborting');
  }

  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  const messageType = message.type.toLowerCase();

  let response;
  if (messageType === EventType.TRACK) {
    response = await trackResponseBuilder(message, destination);
  } else {
    throw new InstrumentationError(`Event type ${messageType} is not supported`);
  }
  return response;
};

/**
 * it builds batch response for an event using defaultBatchRequestConfig() utility
 * @param {*} batch
 * @returns batchedRequest
 *
 * Example:
 * batch:
 *{
    event: {
      event_source_id: "dummyPixelCode",
      event_source: "web",
      partner_name: "RudderStack",
      data: [
        {
          event_id: "1616318632825_357",
          event_time: 1600372167,
          properties: {
            contents: [
              {
                price: 8,
                quantity: 2,
                content_type: "socks",
                content_id: "1077218",
              },
              {
                price: 30,
                quantity: 1,
                content_type: "dress",
                content_id: "1197218",
              },
            ],
            content_type: "product",
            currency: "USD",
            value: 46,
          },
          page: {
            url: "http://demo.mywebsite.com/purchase",
            referrer: "http://demo.mywebsite.com",
          },
          user: {
            locale: "en-US",
            email: "f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc",
            phone: "2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea",
            ip: "13.57.97.131",
            user_agent: "Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion",
            external_id: "id5",
          },
          event: "CompletePayment",
          partner_name: "RudderStack",
        },
        {
          event_id: "1616318632825_357",
          event_time: 1600372167,
          properties: {
            contents: [
              {
                price: 8,
                quantity: 2,
                content_type: "socks",
                content_id: "1077218",
              },
              {
                price: 30,
                quantity: 1,
                content_type: "dress",
                content_id: "1197218",
              },
            ],
            content_type: "product",
            currency: "USD",
            value: 46,
          },
          page: {
            url: "http://demo.mywebsite.com/purchase",
          },
          user: {
            locale: "en-US",
            email: "f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc",
            phone: "2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea",
            ip: "13.57.97.131",
            user_agent: "Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion",
            external_id: "id1",
          },
          event: "CompletePayment",
          partner_name: "RudderStack",
        }
      ],
  },
  metadata: [
    {
      jobId: 5,
    },
    {
      jobId: 1,
    }
  ],
  destination: {
    Config: {
      accessToken: "dummyAccessToken",
      pixelCode: "dummyPixelCode",
      hashUserProperties: false,
      version: "v2",
    },
  },
}
 * returns:
 *
 {
  version: "1",
  type: "REST",
  method: "POST",
  endpoint: "https://business-api.tiktok.com/open_api/v1.3/event/track/",
  headers: {
    "Access-Token": "dummyAccessToken",
    "Content-Type": "application/json",
  },
  params: {
  },
  body: {
    JSON: {
      event_source_id: "asdfg",
      event_source: "web",
      partner_name: "RudderStack",
      data: [
        {
          event_id: "1616318632825_357",
          event_time: 1600372167,
          properties: {
            contents: [
              {
                price: 8,
                quantity: 2,
                content_type: "socks",
                content_id: "1077218",
              },
              {
                price: 30,
                quantity: 1,
                content_type: "dress",
                content_id: "1197218",
              },
            ],
            content_type: "product",
            currency: "USD",
            value: 46,
          },
          page: {
            url: "http://demo.mywebsite.com/purchase",
            referrer: "http://demo.mywebsite.com",
          },
          user: {
            locale: "en-US",
            email: "f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc",
            phone: "2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea",
            ip: "13.57.97.131",
            user_agent: "Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion",
            external_id: "id5",
          },
          event: "CompletePayment",
        },
        {
          event_id: "1616318632825_357",
          event_time: 1600372167,
          properties: {
            contents: [
              {
                price: 8,
                quantity: 2,
                content_type: "socks",
                content_id: "1077218",
              },
              {
                price: 30,
                quantity: 1,
                content_type: "dress",
                content_id: "1197218",
              },
            ],
            content_type: "product",
            currency: "USD",
            value: 46,
          },
          page: {
            url: "http://demo.mywebsite.com/purchase",
          },
          user: {
            locale: "en-US",
            email: "f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc",
            phone: "2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea",
            ip: "13.57.97.131",
            user_agent: "Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion",
            external_id: "id1",
          },
          event: "CompletePayment",
        }
      ],
    },
    JSON_ARRAY: {
    },
    XML: {
    },
    FORM: {
    },
  },
  files: {
  },
}
 */
const buildBatchResponseForEvent = (batch) => {
  const { destination, event } = batch;
  const { accessToken } = destination.Config;
  const { batchedRequest } = defaultBatchRequestConfig();
  batchedRequest.body.JSON = event;
  batchedRequest.endpoint = trackEndpointV2;
  batchedRequest.headers = {
    'Access-Token': accessToken,
    'Content-Type': 'application/json',
  };
  return batchedRequest;
};

const separateTestEvents = (event, processedTestEvents, processedEvents) => {
  // only for already transformed payload
  // eslint-disable-next-line no-param-reassign
  event.message = Array.isArray(event.message) ? event.message : [event.message];

  // not performing batching for test events as it is not supported
  if (event.message[0].body.JSON.test_event_code) {
    const { metadata, destination, message } = event;
    processedTestEvents.push(getSuccessRespEvents(message, [metadata], destination));
  } else {
    processedEvents.push({ ...event });
  }
};

const buildResponseList = (events) =>
  getSuccessRespEvents(
    buildBatchResponseForEvent(events),
    events.metadata,
    events.destination,
    true,
  );

/**
 * This clubs proecessedEvents request body and metadat based upon maxBatchSize
 * @param {*} processedEvents
 * @param {*} maxBatchSize
 * @returns array of objects as
 * {
 *  event, // Batched Event
 *  metadata, // metadata of all the requests combined to form above event
 *  destination, // destination object
 * }
 *
 * Example:
 *
 * processedEvents:[
  {
    message: [
      {
        version: "1",
        type: "REST",
        method: "POST",
        endpoint: "https://business-api.tiktok.com/open_api/v1.3/event/track/",
        headers: {
          "Access-Token": "dummyAccessToken",
          "Content-Type": "application/json",
        },
        params: {
        },
        body: {
          JSON: {
            event_source: "web",
            event_source_id: "pixel_code",
            data: [
              {
                event_id: "1616318632825_357",
                event_time: 1600372167,
                properties: {
                  contents: [
                    {
                      price: 8,
                      quantity: 2,
                      content_type: "socks",
                      content_id: "1077218",
                    },
                    {
                      price: 30,
                      quantity: 1,
                      content_type: "dress",
                      content_id: "1197218",
                    },
                  ],
                  content_type: "product",
                  currency: "USD",
                  value: 46,
                },
                page: {
                  url: "http://demo.mywebsite.com/purchase",
                  referrer: "http://demo.mywebsite.com",
                },
                user: {
                  locale: "en-US",
                  email: "f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc",
                  phone: "2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea",
                  ip: "13.57.97.131",
                  user_agent: "Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion",
                  external_id: "id5",
                },
                event: "CompletePayment",
                partner_name: "RudderStack",
              },
            ],
          },
          JSON_ARRAY: {
          },
          XML: {
          },
          FORM: {
          },
        },
        files: {
        },
      },
    ],
    metadata: {
      jobId: 5,
    },
    destination: {
      Config: {
        accessToken: "dummyAccessToken",
        pixelCode: "pixel_code",
        hashUserProperties: false,
        version: "v2",
      },
    },
  },
  {
    message: [
      {
        version: "1",
        type: "REST",
        method: "POST",
        endpoint: "https://business-api.tiktok.com/open_api/v1.3/event/track/",
        headers: {
          "Access-Token": "dummyAccessToken",
          "Content-Type": "application/json",
        },
        params: {
        },
        body: {
          JSON: {
            event_source: "web",
            event_source_id: "pixel_code",
            data: [
              {
                event_id: "1616318632825_357",
                event_time: 1600372167,
                properties: {
                  contents: [
                    {
                      price: 8,
                      quantity: 2,
                      content_type: "socks",
                      content_id: "1077218",
                    },
                    {
                      price: 30,
                      quantity: 1,
                      content_type: "dress",
                      content_id: "1197218",
                    },
                  ],
                  content_type: "product",
                  currency: "USD",
                  value: 46,
                },
                page: {
                  url: "http://demo.mywebsite.com/purchase",
                },
                user: {
                  locale: "en-US",
                  email: "f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc",
                  phone: "2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea",
                  ip: "13.57.97.131",
                  user_agent: "Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion",
                  external_id: "id1",
                },
                event: "CompletePayment",
                partner_name: "RudderStack",
              },
            ],
          },
          JSON_ARRAY: {
          },
          XML: {
          },
          FORM: {
          },
        },
        files: {
        },
      },
    ],
    metadata: {
      jobId: 1,
    },
    destination: {
      Config: {
        accessToken: "dummyAccessToken",
        pixelCode: "pixel_code",
        hashUserProperties: false,
        version: "v2",
      },
    },
  }
]
 * maxBatchSize = 1000

Returns 
[
  {
    event: {
      event_source_id: "dummyPixelCode",
      event_source: "web",
      partner_name: "RudderStack",
      data: [
        {
          event_id: "1616318632825_357",
          event_time: 1600372167,
          properties: {
            contents: [
              {
                price: 8,
                quantity: 2,
                content_type: "socks",
                content_id: "1077218",
              },
              {
                price: 30,
                quantity: 1,
                content_type: "dress",
                content_id: "1197218",
              },
            ],
            content_type: "product",
            currency: "USD",
            value: 46,
          },
          page: {
            url: "http://demo.mywebsite.com/purchase",
            referrer: "http://demo.mywebsite.com",
          },
          user: {
            locale: "en-US",
            email: "f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc",
            phone: "2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea",
            ip: "13.57.97.131",
            user_agent: "Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion",
            external_id: "id5",
          },
          event: "CompletePayment",
          partner_name: "RudderStack",
        },
        {
          event_id: "1616318632825_357",
          event_time: 1600372167,
          properties: {
            contents: [
              {
                price: 8,
                quantity: 2,
                content_type: "socks",
                content_id: "1077218",
              },
              {
                price: 30,
                quantity: 1,
                content_type: "dress",
                content_id: "1197218",
              },
            ],
            content_type: "product",
            currency: "USD",
            value: 46,
          },
          page: {
            url: "http://demo.mywebsite.com/purchase",
          },
          user: {
            locale: "en-US",
            email: "f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc",
            phone: "2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea",
            ip: "13.57.97.131",
            user_agent: "Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion",
            external_id: "id1",
          },
          event: "CompletePayment",
          partner_name: "RudderStack",
        }
      ],
    },
    metadata: [
      {
        jobId: 5,
      },
      {
        jobId: 1,
      }
    ],
    destination: {
      Config: {
        accessToken: "dummyAccessToken",
        pixelCode: "dummyPixelCode",
        hashUserProperties: false,
        version: "v2",
      },
    },
  }
]
 */

const batchEvents = (processedEvents, eventSource) => {
  const responseLists = [];
  let data = [];
  let metadata = [];
  const { destination } = processedEvents[0];
  const { pixelCode } = destination.Config;
  processedEvents.forEach((event) => {
    const eventData = event.message[0]?.body.JSON.data;
    // eslint-disable-next-line no-unsafe-optional-chaining, unicorn/consistent-destructuring
    if (eventData?.length + data.length > config.maxBatchSizeV2) {
      // Partner name must be added above "data": [..];
      responseLists.push(
        buildResponseList({
          event: {
            event_source_id: pixelCode,
            event_source: eventSource,
            partner_name: PARTNER_NAME,
            data: [...data],
          },
          metadata: [...metadata],
          destination,
        }),
      );
      data = [];
      metadata = [];
    }
    data.push(...eventData);
    metadata.push(event.metadata);
  });
  // Partner name must be added above "data": [..];
  responseLists.push(
    buildResponseList({
      event: {
        event_source_id: pixelCode,
        event_source: eventSource,
        partner_name: PARTNER_NAME,
        data: [...data],
      },
      metadata: [...metadata],
      destination,
    }),
  );
  return responseLists;
};
const processRouterDest = async (inputs, reqMetadata) => {
  const processedEvents = []; // variable to store processed events
  const processedTestEvents = []; // list containing single track event in batched format which are test events
  const errorRespList = [];
  await Promise.all(
    inputs.map(async (event) => {
      try {
        if (event.message.statusCode) {
          // already transformed event
          separateTestEvents(event, processedTestEvents, processedEvents);
        } else {
          // if not transformed
          separateTestEvents(
            {
              message: await process(event),
              metadata: event.metadata,
              destination: event.destination,
            },
            processedTestEvents,
            processedEvents,
          );
        }
      } catch (error) {
        const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
        errorRespList.push(errRespEvent);
      }
    }),
  );

  const batchedResponseList = [];
  // Grouping events by event_source
  const pocessedEventsGroups = await groupByInBatches(
    processedEvents,
    (event) => event.message[0].body.JSON.event_source,
  );

  Object.keys(pocessedEventsGroups).forEach((eventSource) => {
    batchedResponseList.push(...batchEvents(pocessedEventsGroups[eventSource], eventSource));
  });
  // Sort the events based on job id
  // Event may get out of order due testEventCode properties this function ensure that events are in order
  return sortBatchesByMinJobId(batchedResponseList.concat(processedTestEvents, errorRespList));
};

module.exports = { process, processRouterDest, trackResponseBuilder };
