/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
const set = require('set-value');
const { ConfigurationError, InstrumentationError } = require('@rudderstack/integrations-lib');
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
  checkInvalidRtTfEvents,
  handleRtTfSingleEventError,
} = require('../../util');
const { getContents, hashUserField } = require('./util');
const config = require('./config');

const { trackMappingV2, trackEndpointV2, eventNameMapping, PARTNER_NAME } = config;
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
const getTrackResponsePayload = (message, destConfig, event) => {
  const payload = constructPayload(message, trackMappingV2);

  // if contents is not an array converting it into array
  if (payload.properties?.contents && !Array.isArray(payload.properties.contents)) {
    payload.properties.contents = [payload.properties.contents];
  }

  // if contents is not present but we have properties.products present which has fields with superset of contents fields
  if (payload.properties && !payload.properties.contents && message.properties.products) {
    // retreiving data from products only when contents is not present
    payload.properties.contents = getContents(message, false);
  }

  // getting externalId and hashing it and storing it in
  const externalId = getDestinationExternalID(message, 'tiktokExternalId');
  if (isDefinedAndNotNullAndNotEmpty(externalId)) {
    set(payload, 'user.external_id', externalId);
  }
  if (destConfig.hashUserProperties && isDefinedAndNotNullAndNotEmpty(payload.user)) {
    payload.user = hashUserField(payload.user);
  }
  payload.event = event;
  // add partner name and return payload
  return removeUndefinedAndNullValues(payload);
};

const trackResponseBuilder = async (message, { Config }) => {
  const { eventsToStandard, sendCustomEvents, accessToken, pixelCode } = Config;

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
          responseList.push(getTrackResponsePayload(message, Config, eventName));
        });
      }
    });
  } else {
    /* 
    For custom event we do not want to lower case the event or trim it we just want to send those as it is
    Doc https://ads.tiktok.com/help/article/standard-events-parameters?lang=en
    */
    event = eventNameMapping[event] || message.event;
    // if there exists no event mapping we will build payload with custom event recieved
    responseList.push(getTrackResponsePayload(message, Config, event));
  }
  // set event source and event_source_id
  response.body.JSON = {
    event_source: 'web',
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
 * @param {*} eventsChunk
 * @returns batchedRequest
 *
 * Example:
 * inputEvent:
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
const buildBatchResponseForEvent = (inputEvent) => {
  const { destination, event } = inputEvent;
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

const getEventChunks = (event, trackResponseList, eventsChunk) => {
  // only for already transformed payload
  // eslint-disable-next-line no-param-reassign
  event.message = Array.isArray(event.message) ? event.message : [event.message];

  // not performing batching for test events as it is not supported
  if (event.message[0].body.JSON.test_event_code) {
    const { metadata, destination, message } = event;
    trackResponseList.push(getSuccessRespEvents(message, [metadata], destination));
  } else {
    eventsChunk.push({ ...event });
  }
};

/**
 * This clubs eventsChunk request body and metadat based upon maxBatchSize
 * @param {*} eventsChunk
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
 * eventsChunk:[
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
const batchEvents = (eventsChunk) => {
  const events = [];
  let data = [];
  let metadata = [];
  const { destination } = eventsChunk[0];
  const { pixelCode } = destination.Config;
  eventsChunk.forEach((event) => {
    const eventData = event.message[0]?.body.JSON.data;
    // eslint-disable-next-line unicorn/consistent-destructuring
    if (Array.isArray(eventData) && eventData?.length > config.maxBatchSizeV2 - data.length) {
      // Partner name must be added above "data": [..];
      events.push({
        event: {
          event_source_id: pixelCode,
          event_source: 'web',
          partner_name: PARTNER_NAME,
          data: [...data],
        },
        metadata: [...metadata],
        destination,
      });
      data = [];
      metadata = [];
    }
    data.push(...eventData);
    metadata.push(event.metadata);
  });
  // Partner name must be added above "data": [..];
  events.push({
    event: {
      event_source_id: pixelCode,
      event_source: 'web',
      partner_name: PARTNER_NAME,
      data: [...data],
    },
    metadata: [...metadata],
    destination,
  });
  return events;
};
const processRouterDest = async (inputs, reqMetadata) => {
  const errorRespEvents = checkInvalidRtTfEvents(inputs);
  if (errorRespEvents.length > 0) {
    return errorRespEvents;
  }
  const trackResponseList = []; // list containing single track event in batched format
  const eventsChunk = []; // temporary variable to divide payload into chunks
  const errorRespList = [];
  await Promise.all(
    inputs.map(async (event) => {
      try {
        if (event.message.statusCode) {
          // already transformed event
          getEventChunks(event, trackResponseList, eventsChunk);
        } else {
          // if not transformed
          getEventChunks(
            {
              message: await process(event),
              metadata: event.metadata,
              destination: event.destination,
            },
            trackResponseList,
            eventsChunk,
          );
        }
      } catch (error) {
        const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
        errorRespList.push(errRespEvent);
      }
    }),
  );

  const batchedResponseList = [];
  if (eventsChunk.length > 0) {
    const batchedEvents = batchEvents(eventsChunk);
    batchedEvents.forEach((batch) => {
      const batchedRequest = buildBatchResponseForEvent(batch);
      batchedResponseList.push(
        getSuccessRespEvents(batchedRequest, batch.metadata, batch.destination, true),
      );
    });
  }
  return [...batchedResponseList.concat(trackResponseList), ...errorRespList];
};

module.exports = { process, processRouterDest };
