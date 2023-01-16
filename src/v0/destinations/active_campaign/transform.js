/* eslint-disable  array-callback-return */
/* eslint-disable  no-empty */
const get = require('get-value');
const { EventType } = require('../../../constants');
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require('./config');
const {
  defaultRequestConfig,
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  simpleProcessRouterDest,
} = require('../../util');
const { errorHandler } = require('./util');
const { httpGET, httpPOST } = require('../../../adapters/network');
const {
  InstrumentationError,
  TransformationError,
  NetworkError,
} = require('../../util/errorTypes');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const tags = require('../../util/tags');

// The Final data is both application/url-encoded FORM and POST JSON depending on type of event
// Creating a switch case for final request building
const responseBuilderSimple = (payload, category, destination) => {
  if (payload) {
    const response = defaultRequestConfig();
    switch (category.name) {
      case 'ACIdentify':
      case 'ACPage':
        response.endpoint = `${destination.Config.apiUrl}${category.endPoint}`;
        response.method = defaultPostRequestConfig.requestMethod;
        response.headers = {
          'Content-Type': 'application/json',
          'Api-Token': destination.Config.apiKey,
        };
        response.body.JSON = payload;
        break;
      case 'ACScreen':
      case 'ACTrack':
        response.endpoint = `${category.endPoint}`;
        response.method = defaultPostRequestConfig.requestMethod;
        response.headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Api-Token': destination.Config.apiKey,
        };
        response.body.FORM = payload;
        break;
      default:
        throw new InstrumentationError('Message format type not supported');
    }
    return response;
  }
  // fail-safety for developer error
  throw new TransformationError('Payload could not be constructed');
};

const syncContact = async (contactPayload, category, destination) => {
  const endpoint = `${destination.Config.apiUrl}${category.endPoint}`;
  const requestData = {
    contact: contactPayload,
  };
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Api-Token': destination.Config.apiKey,
    },
  };
  const res = await httpPOST(endpoint, requestData, requestOptions);
  if (res.success === false) {
    errorHandler(res.response, 'Failed to create new contact');
  }
  const createdContact = get(res, 'response.data.contact'); // null safe
  if (!createdContact) {
    throw new NetworkError(
      'Unable to Create Contact',
      res.response?.status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(res.response?.status),
      },
      res.response,
    );
  }
  return createdContact.id;
};

const customTagProcessor = async (message, category, destination, contactId) => {
  const tagsToBeCreated = [];
  const tagIds = [];
  let res;
  let endpoint;
  let requestOptions;
  let requestData;
  // Here we extract the tags which are to be mapped to the created contact from the message
  const msgTags = get(message.context.traits, 'tags') || get(message.traits, 'tags');

  // If no tags are sent in message return the contact from the method
  if (!msgTags && !Array.isArray(msgTags)) {
    return;
  }

  // Step - 1
  // Fetch already created tags from dest, so that we avoid duplicate tag creation request
  // Ref - https://developers.activecampaign.com/reference/retrieve-all-tags
  endpoint = `${destination.Config.apiUrl}${`${category.tagEndPoint}?limit=100`}`;
  requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Api-Token': destination.Config.apiKey,
    },
  };
  res = await httpGET(endpoint, requestOptions);
  if (res.success === false) {
    errorHandler(res.response, 'Failed to fetch already created tags');
  }

  const storedTags = {};
  if (res.response.status === 200) {
    // For easily checking if the tag which is sent is already present
    // creating K-V Map [tag_name] -> tag_id

    res.response.data.tags.map((t) => {
      storedTags[t.tag] = t.id;
    });

    // utilized limit and offset query parameters to fetch more than the default limit which is 20.
    // We are retrieving 100 tags which is the maximum limit, in each iteration, until all tags are retrieved.
    // Ref - https://developers.activecampaign.com/reference/pagination
    const promises = [];
    if (parseInt(get(res, 'response.data.meta.total'), 10) > 100) {
      const limit = Math.floor(parseInt(get(res, 'response.data.meta.total'), 10) / 100);
      for (let i = 0; i < limit; i += 1) {
        endpoint = `${destination.Config.apiUrl}${category.tagEndPoint}?limit=100&offset=${
          100 * (i + 1)
        }`;
        requestOptions = {
          headers: {
            'Content-Type': 'application/json',
            'Api-Token': destination.Config.apiKey,
          },
        };
        const resp = httpGET(endpoint, requestOptions);
        promises.push(resp);
      }
      const results = await Promise.all(promises);
      results.forEach((resp) => {
        if (resp.success === true && resp.response.status === 200) {
          resp.response.data.tags.map((t) => {
            storedTags[t.tag] = t.id;
          });
        }
      });
    }

    // Step - 2
    // Check if tags already present then we push it to tagIds
    // the ones which are not stored we push it to tagsToBeCreated
    msgTags.map((tag) => {
      if (!storedTags[tag]) tagsToBeCreated.push(tag);
      else tagIds.push(storedTags[tag]);
    });
  }

  // Step - 3
  // Create tags if required - from tagsToBeCreated
  // Ref - https://developers.activecampaign.com/reference/create-a-new-tag
  if (tagsToBeCreated.length > 0) {
    await Promise.all(
      tagsToBeCreated.map(async (tag) => {
        endpoint = `${destination.Config.apiUrl}${category.tagEndPoint}`;
        requestData = {
          tag: {
            tag,
            tagType: 'contact',
            description: '',
          },
        };
        requestOptions = {
          headers: {
            'Content-Type': 'application/json',
            'Api-Token': destination.Config.apiKey,
          },
        };
        res = await httpPOST(endpoint, requestData, requestOptions);
        if (res.success === false) {
          errorHandler(res.response, 'Failed to create new tag');
          // For each tags successfully created the response id is pushed to tagIds
        }
        if (res.response.status === 201) tagIds.push(res.response.data.tag.id);
      }),
    );
  }

  // Step - 4
  // Merge Created contact with created tags, tagIds array is used
  // Ref - https://developers.activecampaign.com/reference/create-contact-tag
  const responsesArr = await Promise.all(
    tagIds.map(async (tagId) => {
      endpoint = `${destination.Config.apiUrl}${category.mergeTagWithContactUrl}`;
      requestData = {
        contactTag: {
          contact: contactId,
          tag: tagId,
        },
      };
      requestOptions = {
        headers: {
          'Content-Type': 'application/json',
          'Api-Token': destination.Config.apiKey,
        },
      };
      res = httpPOST(endpoint, requestData, requestOptions);
      return res;
    }),
  );
  responsesArr.forEach((respItem) => {
    if (respItem.success === false)
      errorHandler(respItem.response, 'Failed to merge created contact with created tags');
  });
};

const customFieldProcessor = async (message, category, destination) => {
  const responseStaging = [];
  // Step - 1
  // Extract the custom field info from the message
  const fieldInfo = get(message.context.traits, 'fieldInfo') || get(message.traits, 'fieldInfo');

  // If no field info is passed return from method with empty array
  if (!fieldInfo) {
    return [];
  }
  const fieldKeys = Object.keys(fieldInfo);
  // Step - 2
  // Get the existing field data from dest and store it in responseStaging
  // Ref - https://developers.activecampaign.com/reference/retrieve-fields
  let endpoint = `${destination.Config.apiUrl}${`${category.fieldEndPoint}?limit=100`}`;
  const requestOptions = {
    headers: {
      'Api-Token': destination.Config.apiKey,
    },
  };
  const res = await httpGET(endpoint, requestOptions);
  if (res.success === false) {
    errorHandler(res.response, 'Failed to get existing field data');
  }
  responseStaging.push(res.response.status === 200 ? res.response.data.fields : []);

  const promises = [];
  const limit = Math.floor(parseInt(get(res, 'response.data.meta.total'), 10) / 100);
  if (parseInt(get(res, 'response.data.meta.total'), 10) > 100) {
    for (let i = 0; i < limit; i += 1) {
      endpoint = `${destination.Config.apiUrl}${category.fieldEndPoint}?limit=100&offset=${
        100 * (i + 1)
      }`;
      const requestOpt = {
        headers: {
          'Api-Token': destination.Config.apiKey,
        },
      };
      const resp = httpGET(endpoint, requestOpt);
      promises.push(resp);
    }
    const results = await Promise.all(promises);
    results.forEach((resp) => {
      if (resp.success === true && resp.response.status === 200) {
        responseStaging.push(resp.response.data.fields);
      } else {
        errorHandler(resp.response, 'Failed to get existing field data');
      }
    });
  }

  // From the responseStaging we store the stored field information in K-V struct iin fieldMap
  // In order for easy comparison and retrieval.
  const fieldMap = {};

  responseStaging.forEach((respStag) => {
    respStag.map((field) => {
      fieldMap[field.title] = field.id;
    });
  });

  const storedFields = Object.keys(fieldMap);
  const filteredFieldKeys = [];
  fieldKeys.map((fieldKey) => {
    // If the field is present in fieldMap push it to filteredFieldKeys else ignore
    if (storedFields.includes(fieldKey)) {
      filteredFieldKeys.push(fieldKey);
    }
  });

  // fieldmap has all the field info in K/V  pair => [title] = id
  // Using the keys we get the value fromMap and fieldinfo

  // Step - 3
  // Creating a field array list conating field id and field value which will be merged to the contact
  // Ref: https://developers.activecampaign.com/reference/sync-a-contacts-data
  const fieldsArrValues = [];
  filteredFieldKeys.map((key) => {
    let fPayload;
    if (Array.isArray(fieldInfo[key])) {
      fPayload = '||';
      fieldInfo[key].map((fv) => {
        fPayload = `${fPayload}${fv}||`;
      });
    } else {
      fPayload = fieldInfo[key];
    }
    fieldsArrValues.push({
      field: fieldMap[key],
      value: fPayload,
    });
  });

  return fieldsArrValues;
};

const customListProcessor = async (message, category, destination, contactId) => {
  // Here we extract the list info from the message
  const listInfo = get(message.context.traits, 'lists')
    ? get(message.context.traits, 'lists')
    : get(message.traits, 'lists');
  if (!listInfo) {
    return;
  }
  // The list info is pushed into a list object array
  const listArr = [];
  if (Array.isArray(listInfo)) {
    listInfo.map((list) => {
      listArr.push(list);
    });
  } else {
    listArr.push(listInfo);
  }
  // For each list object we are mapping the createdcontact with the list along with the
  // status information
  // Ref: https://developers.activecampaign.com/reference/update-list-status-for-contact/
  const promises = [];
  listArr.map(async (li) => {
    if (li.status === 'subscribe' || li.status === 'unsubscribe') {
      const endpoint = `${destination.Config.apiUrl}${category.mergeListWithContactUrl}`;
      const requestData = {
        contactList: {
          list: li.id,
          contact: contactId,
          status: li.status === 'subscribe' ? '1' : '2',
        },
      };
      const requestOptions = {
        headers: {
          'Content-Type': 'application/json',
          'Api-Token': destination.Config.apiKey,
        },
      };
      const res = httpPOST(endpoint, requestData, requestOptions);
      promises.push(res);
    }
  });
  const responses = await Promise.all(promises);
  responses.forEach((respItem) => {
    if (respItem.success === false) {
      errorHandler(respItem.response, 'Failed to map created contact with the list');
    }
  });
};

// This the handler func for identify type of events here before we transform the event
// and return to rudder server we process the message by calling specific destination apis
// for handling tag information and custom field information.
const identifyRequestHandler = async (message, category, destination) => {
  // create skeleton contact payload
  let contactPayload = constructPayload(message, MAPPING_CONFIG[category.name]);
  contactPayload = removeUndefinedAndNullValues(contactPayload);
  // sync to Active Campaign
  const contactId = await syncContact(contactPayload, category, destination);
  // create, and merge tags
  await customTagProcessor(message, category, destination, contactId);
  // add the contact to lists if applicabale
  await customListProcessor(message, category, destination, contactId);
  // extract fieldValues to merge with contact
  const fieldValues = await customFieldProcessor(message, category, destination);
  contactPayload.fieldValues = fieldValues;
  contactPayload = removeUndefinedAndNullValues(contactPayload);
  const payload = {
    contact: contactPayload,
  };
  // sync the enriched payload
  return responseBuilderSimple(payload, category, destination);
};
// This method handles any page request
// Creates the payload as per API spec and returns to rudder-server
// Ref - https://developers.activecampaign.com/reference/site-tracking
const pageRequestHandler = (message, category, destination) => {
  const payload = {
    siteTrackingDomain: constructPayload(message, MAPPING_CONFIG[category.name]),
  };
  return responseBuilderSimple(payload, category, destination);
};

const screenRequestHandler = async (message, category, destination) => {
  // Need to check if the event with same name already exists if not need to create
  // Retrieve All events from destination
  // https://developers.activecampaign.com/reference/list-all-event-types
  let res;
  let endpoint = `${destination.Config.apiUrl}${category.getEventEndPoint}`;
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Api-Token': destination.Config.apiKey,
    },
  };
  res = await httpGET(endpoint, requestOptions);
  if (res.success === false) {
    errorHandler(res.response, 'Failed to retrieve events');
  }

  if (res?.response?.status !== 200) {
    throw new NetworkError(
      'Unable to create event',
      res.response?.status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(res.response?.status),
      },
      res.response,
    );
  }

  const storedEventsArr = res.response.data.eventTrackingEvents;
  const storedEvents = [];
  storedEventsArr.map((ev) => {
    storedEvents.push(ev.name);
  });
  // Check if the source event is already present if not we make a create request
  // Ref - https://developers.activecampaign.com/reference/create-a-new-event-name-only
  if (!storedEvents.includes(message.event)) {
    // Create the event
    endpoint = `${destination.Config.apiUrl}${category.getEventEndPoint}`;
    const requestData = {
      eventTrackingEvent: {
        name: message.event,
      },
    };
    const requestOpt = {
      headers: {
        'Content-Type': 'application/json',
        'Api-Token': destination.Config.apiKey,
      },
    };
    res = await httpPOST(endpoint, requestData, requestOpt);
    if (res.success === false) {
      errorHandler(res.response, 'Failed to create event');
    }

    if (res.response.status !== 201) {
      throw new NetworkError(
        'Unable to create event',
        res.response.status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(res.response.status),
        },
        res?.response,
      );
    }
  }
  // Previous operations successfull then
  // Mapping the Event payloads
  // Create the payload and send the ent to end point using rudder server
  // Ref - https://developers.activecampaign.com/reference/track-event
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  payload.actid = destination.Config.actid;
  payload.key = destination.Config.eventKey;
  if (get(message, 'properties.eventData')) {
    payload.eventdata = get(message, 'properties.eventData');
  }
  payload.visit = `{"email":"${get(message, 'context.traits.email')}"}`;
  return responseBuilderSimple(payload, category, destination);
};

const trackRequestHandler = async (message, category, destination) => {
  // Need to check if the event with same name already exists if not need to create
  // Retrieve All events from destination
  // https://developers.activecampaign.com/reference/list-all-event-types
  let endpoint = `${destination.Config.apiUrl}${category.getEventEndPoint}`;
  const requestOptions = {
    headers: {
      'Api-Token': destination.Config.apiKey,
    },
  };
  let res = await httpGET(endpoint, requestOptions);

  if (res.success === false) {
    errorHandler(res.response, 'Failed to retrieve events');
  }

  if (res.response.status !== 200) {
    throw new NetworkError(
      'Unable to fetch events. Aborting',
      res.response.status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(res.response.status),
      },
      res?.response,
    );
  }

  const storedEventsArr = res.response.data.eventTrackingEvents;
  const storedEvents = [];
  storedEventsArr.map((ev) => {
    storedEvents.push(ev.name);
  });
  // Check if the source event is already present if not we make a create request
  // Ref - https://developers.activecampaign.com/reference/create-a-new-event-name-only
  if (!storedEvents.includes(message.event)) {
    // Create the event
    endpoint = `${destination.Config.apiUrl}${category.getEventEndPoint}`;
    const requestData = {
      eventTrackingEvent: {
        name: message.event,
      },
    };
    const requestOpt = {
      headers: {
        'Content-Type': 'application/json',
        'Api-Token': destination.Config.apiKey,
      },
    };
    res = await httpPOST(endpoint, requestData, requestOpt);
    if (res.response?.status !== 201) {
      throw new NetworkError(
        'Unable to create event. Aborting',
        res.response.status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(res.response.status),
        },
        res.response,
      );
    }
  }

  // Previous operations successfull then
  // Mapping the Event payloads
  // Create the payload and send the ent to end point using rudder server
  // Ref - https://developers.activecampaign.com/reference/track-event
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  payload.actid = destination.Config.actid;
  payload.key = destination.Config.eventKey;
  if (get(message, 'properties.eventData')) {
    payload.eventdata = get(message, 'properties.eventData');
  }
  payload.visit = `{"email":"${get(message, 'context.traits.email')}"}`;

  return responseBuilderSimple(payload, category, destination);
};

// The main entry point where the message is processed based on what type of event
// each scenario is resolved by using specific handler function which does
// subsquent processing and transformations and the response is sent to rudder-server
const processEvent = async (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }
  const messageType = message.type.toLowerCase();
  let response;
  let category;
  switch (messageType) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.IDENTIFY;
      response = await identifyRequestHandler(message, category, destination);
      break;
    case EventType.PAGE:
      category = CONFIG_CATEGORIES.PAGE;
      response = pageRequestHandler(message, category, destination);
      break;
    case EventType.SCREEN:
      category = CONFIG_CATEGORIES.SCREEN;
      response = await screenRequestHandler(message, category, destination);
      break;
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      response = await trackRequestHandler(message, category, destination);
      break;
    default:
      throw new InstrumentationError('Message type not supported');
  }
  return response;
};

const process = async (event) => {
  const result = await processEvent(event.message, event.destination);
  return result;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
