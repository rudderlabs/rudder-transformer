/* eslint-disable  array-callback-return */
/* eslint-disable  no-empty */
const get = require("get-value");
const { EventType } = require("../../../constants");
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");
const {
  defaultRequestConfig,
  getFieldValueFromMessage,
  constructPayload,
  defaultPostRequestConfig,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError
} = require("../../util");
const { errorHandler } = require("./util");
const { httpGET, httpPOST } = require("../../../adapters/network");

// The Final data is both application/url-encoded FORM and POST JSON depending on type of event
// Creating a switch case for final request building
const responseBuilderSimple = (payload, category, destination) => {
  if (payload) {
    const responseBody = { ...payload, apiKey: destination.Config.apiKey };
    const response = defaultRequestConfig();
    switch (category.name) {
      case "ACIdentify":
      case "ACPage":
        response.endpoint = `${destination.Config.apiUrl}${
          category.endPoint ? category.endPoint : ""
        }`;
        response.method = defaultPostRequestConfig.requestMethod;
        response.headers = {
          "Content-Type": "application/json",
          "Api-Token": destination.Config.apiKey
        };
        response.body.JSON = responseBody;
        break;
      case "ACScreen":
      case "ACTrack":
        response.endpoint = `${category.endPoint}`;
        response.method = defaultPostRequestConfig.requestMethod;
        response.headers = {
          "Content-Type": "application/x-www-form-urlencoded",
          "Api-Token": destination.Config.apiKey
        };
        response.body.FORM = responseBody;
        break;
      default:
        throw new CustomError("Message format type not supported", 400);
    }

    return response;
  }
  // fail-safety for developer error
  throw new CustomError("Payload could not be constructed", 400);
};

const customTagProcessor = async (message, category, destination) => {
  const tagsToBeCreated = [];
  const tagIds = [];
  // Step - 1
  // In order to bind custom tags and field values to a contact we first create the contact
  //------------------------------------------------------------------
  // Ref - https://developers.activecampaign.com/reference#create-or-update-contact-new
  // Utilizing the response we further bind more data [tag , field] to it
  let res;
  const contactPayload = constructPayload(
    message,
    MAPPING_CONFIG[category.name]
  );
  contactPayload.firstName = getFieldValueFromMessage(message, "firstName");
  contactPayload.lastName = getFieldValueFromMessage(message, "lastName");
  let endpoint = `${destination.Config.apiUrl}${category.endPoint}`;
  let requestData = {
    contact: contactPayload
  };
  let requestOptions = {
    headers: {
      "Content-Type": "application/json",
      "Api-Token": destination.Config.apiKey
    }
  };
  res = await httpPOST(endpoint, requestData, requestOptions);
  if (res.success === false) {
    errorHandler(res.response, "Failed to create new contact");
  }
  const createdContact = get(res, "response.data.contact"); // null safe
  if (!createdContact) {
    throw CustomError("Unable to Create Contact", 400);
  }

  // Here we extract the tags which are to be mapped to the created contact from the message
  const tags = get(message.context.traits, "tags")
    ? get(message.context.traits, "tags")
    : get(message.traits, "tags");

  // If no tags are sent in message return the contact from the method
  if (!tags && !Array.isArray(tags)) {
    return createdContact;
  }

  // Step - 2
  // Fetch already created tags from dest, so that we avoid duplicate tag creation request
  // Ref - https://developers.activecampaign.com/reference#retrieve-all-tags

  endpoint = `${
    destination.Config.apiUrl
  }${`${category.tagEndPoint}?limit=100`}`;
  requestOptions = {
    headers: {
      "Content-Type": "application/json",
      "Api-Token": destination.Config.apiKey
    }
  };
  res = await httpGET(endpoint, requestOptions);
  if (res.success === false) {
    errorHandler(res.response, "Failed to fetch already created tags");
  }

  const storedTags = {};
  if (res.response.status === 200) {
    // For easily checking if the tag which is sent is already present
    // creating K-V Map [tag_name] -> tag_id

    res.response.data.tags.map(t => {
      storedTags[t.tag] = t.id;
    });

    // utilized limit and offset query parameters to fetch more than the default limit which is 20.
    // We are retrieving 100 tags which is the maximum limit, in each iteration, until all tags are retrieved.
    // Ref - https://developers.activecampaign.com/reference#pagination
    const promises = [];
    if (parseInt(get(res, "response.data.meta.total"), 10) > 100) {
      const limit = Math.floor(
        parseInt(get(res, "response.data.meta.total"), 10) / 100
      );
      for (let i = 0; i < limit; i += 1) {
        endpoint = `${destination.Config.apiUrl}${
          category.tagEndPoint
        }?limit=100&offset=${100 * (i + 1)}`;
        requestOptions = {
          headers: {
            "Content-Type": "application/json",
            "Api-Token": destination.Config.apiKey
          }
        };
        const resp = httpGET(endpoint, requestOptions);
        promises.push(resp);
      }
      const results = await Promise.all(promises);
      results.forEach(resp => {
        if (resp.success === true && resp.response.status === 200) {
          resp.response.data.tags.map(t => {
            storedTags[t.tag] = t.id;
          });
        }
      });
    }

    // Step - 3
    // Check if tags already present then we push it to tagIds
    // the ones which are not stored we push it to tagsToBeCreated

    tags.map(tag => {
      if (!storedTags[tag]) tagsToBeCreated.push(tag);
      else tagIds.push(storedTags[tag]);
    });
  }

  // Step - 4
  // Create tags if required - from tagsToBeCreated
  // Ref - https://developers.activecampaign.com/reference#create-a-new-tag
  if (tagsToBeCreated.length > 0) {
    await Promise.all(
      tagsToBeCreated.map(async tag => {
        endpoint = `${destination.Config.apiUrl}${category.tagEndPoint}`;
        requestData = {
          tag: {
            tag,
            tagType: "contact",
            description: ""
          }
        };
        requestOptions = {
          headers: {
            "Content-Type": "application/json",
            "Api-Token": destination.Config.apiKey
          }
        };
        res = await httpPOST(endpoint, requestData, requestOptions);
        if (res.success === false) {
          errorHandler(res.response, "Failed to fetch already created tags");
          // For each tags successfully created the response id is pushed to tagIds
        }
        if (res.response.status === 201) tagIds.push(res.response.data.tag.id);
      })
    );
  }

  // Step - 4
  // Merge Created contact with created tags, tagIds array is used
  // Ref - https://developers.activecampaign.com/reference#create-contact-tag
  const responsesArr = await Promise.all(
    tagIds.map(async tagId => {
      endpoint = `${destination.Config.apiUrl}${category.mergeTagWithContactUrl}`;
      requestData = {
        contactTag: {
          contact: createdContact.id,
          tag: tagId
        }
      };
      requestOptions = {
        headers: {
          "Content-Type": "application/json",
          "Api-Token": destination.Config.apiKey
        }
      };
      res = httpPOST(endpoint, requestData, requestOptions);
      return res;
    })
  );
  responsesArr.forEach(respItem => {
    if (respItem.success === false)
      errorHandler(
        respItem.response,
        "Failed to merge created contact with created tags"
      );
  });

  return createdContact;
};

const customFieldProcessor = async (
  message,
  category,
  destination,
  createdContact
) => {
  const responseStaging = [];
  // Step - 1
  // Extract the custom field info from the message
  const fieldInfo = get(message.context.traits, "fieldInfo")
    ? get(message.context.traits, "fieldInfo")
    : get(message.traits, "fieldInfo");

  // If no field info is passed return from method
  if (!fieldInfo) {
    return;
  }
  const fieldKeys = Object.keys(fieldInfo);
  // Step - 2
  // Get the existing field data from dest and store it in responseStaging
  // Ref - https://developers.activecampaign.com/reference#retrieve-fields-1
  let endpoint = `${
    destination.Config.apiUrl
  }${`${category.fieldEndPoint}?limit=100`}`;
  const requestOptions = {
    headers: {
      "Api-Token": destination.Config.apiKey
    }
  };
  let res = await httpGET(endpoint, requestOptions);
  responseStaging.push(
    res.response.status === 200 ? res.response.data.fields : []
  );
  if (res.success === false) {
    errorHandler(res.response, "Failed to get existing field data");
  }

  const promises = [];
  const limit = Math.floor(
    parseInt(get(res, "response.data.meta.total"), 10) / 100
  );
  if (parseInt(get(res, "response.data.meta.total"), 10) > 100) {
    for (let i = 0; i < limit; i += 1) {
      endpoint = `${destination.Config.apiUrl}${
        category.fieldEndPoint
      }?limit=100&offset=${100 * (i + 1)}`;
      const requestOpt = {
        headers: {
          "Api-Token": destination.Config.apiKey
        }
      };
      const resp = httpGET(endpoint, requestOpt);
      promises.push(resp);
    }
    const results = await Promise.all(promises);
    results.forEach(resp => {
      if (resp.success === true && resp.response.status === 200) {
        responseStaging.push(resp.response.data.fields);
      }
    });
  }

  // From the responseStaging we store the stored field information in K-V struct iin fieldMap
  // In order for easy comparison and retrieval.
  const fieldMap = {};

  responseStaging.forEach(respStag => {
    respStag.map(field => {
      fieldMap[field.title] = field.id;
    });
  });

  const storedFields = Object.keys(fieldMap);
  const filteredFieldKeys = [];
  fieldKeys.map(fieldKey => {
    // If the field is not present in fieldMap log an error else push it to storedFieldKeys
    if (storedFields.includes(fieldKey)) {
      filteredFieldKeys.push(fieldKey);
    }
  });

  // fieldmap has all the field info in K/V  pair => [title] = id
  // Using the keys we get the value fromMap and fieldinfo

  // Step - 3
  // For each key we create a mapping request for mapping each field to the created contact
  // Ref - https://developers.activecampaign.com/reference#create-fieldvalue

  const responsesArr = await Promise.all(
    filteredFieldKeys.map(async key => {
      let fPayload;
      if (Array.isArray(fieldInfo[key])) {
        fPayload = "||";
        fieldInfo[key].map(fv => {
          fPayload = `${fPayload}${fv}||`;
        });
      } else {
        fPayload = fieldInfo[key];
      }
      endpoint = `${destination.Config.apiUrl}${category.mergeFieldValueWithContactUrl}`;
      const requestData = {
        fieldValue: {
          contact: createdContact.id,
          field: fieldMap[key],
          value: fPayload
        }
      };
      const requestOpts = {
        headers: {
          "Content-Type": "application/json",
          "Api-Token": destination.Config.apiKey
        }
      };
      res = httpPOST(endpoint, requestData, requestOpts);
      return res;
    })
  );
  responsesArr.forEach(respItem => {
    if (respItem.success === false) {
      errorHandler(respItem.response, "Failed to create mapping request");
    }
  });
};

const customListProcessor = async (
  message,
  category,
  destination,
  createdContact
) => {
  // Here we extract the list info from the message
  const listInfo = get(message.context.traits, "lists")
    ? get(message.context.traits, "lists")
    : get(message.traits, "lists");
  if (!listInfo) {
    return;
  }
  // The list info is pushed into a list object array
  const listArr = [];
  if (Array.isArray(listInfo)) {
    listInfo.map(list => {
      listArr.push(list);
    });
  } else {
    listArr.push(listInfo);
  }
  // For each list object we are mapping the createdcontact with the list along with the
  // status information
  // Ref: https://developers.activecampaign.com/reference#update-list-status-for-contact/
  const responsesArr = [];
  Promise.all(
    listArr.map(async li => {
      if (li.status === "subscribe" || li.status === "unsubscribe") {
        const endpoint = `${destination.Config.apiUrl}${category.mergeListWithContactUrl}`;
        const requestData = {
          contactList: {
            list: li.id,
            contact: createdContact.id,
            status: li.status === "subscribe" ? 1 : 2
          }
        };
        const requestOptions = {
          headers: {
            "Content-Type": "application/json",
            "Api-Token": destination.Config.apiKey
          }
        };
        const res = httpPOST(endpoint, requestData, requestOptions);
        responsesArr.push(res);
      }
    })
  );
  responsesArr.forEach(respItem => {
    if (respItem.success === false) {
      errorHandler(
        respItem.response,
        "Failed to map created contact with the list"
      );
    }
  });
};

// This the handler func for identify type of events here before we transform the event
// and return to rudder server we process the message by calling specific destination apis
// for handling tag information and custom field information.
const identifyRequestHandler = async (message, category, destination) => {
  const createdContact = await customTagProcessor(
    message,
    category,
    destination
  );
  await customFieldProcessor(message, category, destination, createdContact);
  await customListProcessor(message, category, destination, createdContact);

  const payload = {
    contact: constructPayload(message, MAPPING_CONFIG[category.name])
  };
  payload.contact.firstName = getFieldValueFromMessage(message, "firstName");
  payload.contact.lastName = getFieldValueFromMessage(message, "lastName");
  return responseBuilderSimple(payload, category, destination);
};
// This method handles any page request
// Creates the payload as per API spec and returns to rudder-server
// Ref - https://developers.activecampaign.com/reference#site-tracking
const pageRequestHandler = (message, category, destination) => {
  const payload = {
    siteTrackingDomain: constructPayload(message, MAPPING_CONFIG[category.name])
  };
  return responseBuilderSimple(payload, category, destination);
};

const screenRequestHandler = async (message, category, destination) => {
  // Need to check if the event with same name already exists if not need to create
  // Retrieve All events from destination
  // https://developers.activecampaign.com/reference#list-all-event-types
  let res;
  let endpoint = `${destination.Config.apiUrl}${category.getEventEndPoint}`;
  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      "Api-Token": destination.Config.apiKey
    }
  };
  res = await httpGET(endpoint, requestOptions);
  if (res.success === false) {
    errorHandler(res.response, "Failed to retrieve events");
  }

  if (res.response.status !== 200)
    throw new CustomError("Unable to create event", res.response.status || 400);

  const storedEventsArr = res.response.data.eventTrackingEvents;
  const storedEvents = [];
  storedEventsArr.map(ev => {
    storedEvents.push(ev.name);
  });
  // Check if the source event is already present if not we make a create request
  // Ref - https://developers.activecampaign.com/reference#create-a-new-event-name-only
  if (!storedEvents.includes(message.event)) {
    // Create the event
    endpoint = `${destination.Config.apiUrl}${category.getEventEndPoint}`;
    const requestData = {
      eventTrackingEvent: {
        name: message.event
      }
    };
    const requestOpt = {
      headers: {
        "Content-Type": "application/json",
        "Api-Token": destination.Config.apiKey
      }
    };
    res = await httpPOST(endpoint, requestData, requestOpt);
    if (res.success === false) {
      errorHandler(res.response, "Failed to create event");
    }

    if (res.response.status !== 201) {
      throw new CustomError(
        "Unable to create event",
        res.response.status || 400
      );
    }
  }
  // Previous operations successfull then
  // Mapping the Event payloads
  // Create the payload and send the ent to end point using rudder server
  // Ref - https://developers.activecampaign.com/reference#track-event
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  payload.actid = destination.Config.actid;
  payload.key = destination.Config.eventKey;
  payload.visit = encodeURIComponent(
    `{"email":"${get(message, "context.traits.email")}"}`
  );
  return responseBuilderSimple(payload, category, destination);
};

const trackRequestHandler = async (message, category, destination) => {
  // Need to check if the event with same name already exists if not need to create
  // Retrieve All events from destination
  // https://developers.activecampaign.com/reference#list-all-event-types
  let endpoint = `${destination.Config.apiUrl}${category.getEventEndPoint}`;
  const requestOptions = {
    headers: {
      "Api-Token": destination.Config.apiKey
    }
  };
  let res = await httpGET(endpoint, requestOptions);

  if (res.success === false) {
    errorHandler(res.response, "Failed to retrieve events");
  }

  if (res.response.status !== 200)
    throw new CustomError("Unable to create event", res.response.status || 400);

  const storedEventsArr = res.response.data.eventTrackingEvents;
  const storedEvents = [];
  storedEventsArr.map(ev => {
    storedEvents.push(ev.name);
  });
  // Check if the source event is already present if not we make a create request
  // Ref - https://developers.activecampaign.com/reference#create-a-new-event-name-only
  if (!storedEvents.includes(message.event)) {
    // Create the event
    endpoint = `${destination.Config.apiUrl}${category.getEventEndPoint}`;
    const requestData = {
      eventTrackingEvent: {
        name: message.event
      }
    };
    const requestOpt = {
      headers: {
        "Content-Type": "application/json",
        "Api-Token": destination.Config.apiKey
      }
    };
    res = await httpPOST(endpoint, requestData, requestOpt);
  }
  if (res.response.status !== 201) {
    throw new CustomError("Unable to create event", res.response.status || 400);
  }

  // Previous operations successfull then
  // Mapping the Event payloads
  // Create the payload and send the ent to end point using rudder server
  // Ref - https://developers.activecampaign.com/reference#track-event
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  payload.actid = destination.Config.actid;
  payload.key = destination.Config.eventKey;
  payload.visit = encodeURIComponent(
    `{"email":"${get(message, "context.traits.email")}"}`
  );
  return responseBuilderSimple(payload, category, destination);
};

// The main entry point where the message is processed based on what type of event
// each scenario is resolved by using specific handler function which does
// subsquent processing and transformations and the response is sent to rudder-server
const processEvent = async (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
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
      throw new CustomError("Message type not supported", 400);
  }
  return response;
};

const process = async event => {
  const result = await processEvent(event.message, event.destination);
  return result;
};

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const respList = await Promise.all(
    inputs.map(async input => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          return getSuccessRespEvents(
            input.message,
            [input.metadata],
            input.destination
          );
        }
        // if not transformed
        return getSuccessRespEvents(
          await process(input),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          error.response
            ? error.response.status
            : error.code
            ? error.code
            : 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };
