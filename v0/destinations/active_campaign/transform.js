const { EventType } = require("../../../constants");
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");
const get = require("get-value");
const set = require("set-value");
const LOG = require("../../../logger");
const {
  defaultRequestConfig,
  getFieldValueFromMessage,
  constructPayload,
  defaultPostRequestConfig
} = require("../../util");
const { default: Axios } = require("axios");

const responseBuilderSimple = (message, payload, category, destination) => {
  if (payload) {
    const responseBody = { ...payload, apiKey: destination.Config.apiKey };
    const response = defaultRequestConfig();
    response.endpoint = `${destination.Config.apiUrl}${
      category.endPoint ? category.endPoint : ""
    }`;
    response.method = defaultPostRequestConfig.requestMethod;
    response.headers = {
      "Content-Type": "application/json",
      "Api-Token": destination.Config.apiKey
    };
    response.body.JSON = responseBody;
    return response;
  }
  // fail-safety for developer error
  throw new Error("Payload could not be constructed");
};

const identifyRequestHandler = async (message, category, destination) => {
  const createdContact = await customTagProcessor(
    message,
    category,
    destination
  );
  await customFieldProcessor(message, category, destination, createdContact);
  let payload = {
    contact: constructPayload(message, MAPPING_CONFIG[category.name])
  };
  return responseBuilderSimple(message, payload, category, destination);
};

const pageRequestHandler = (message, category, destination) => {
  payload = {
    siteTrackingDomain: constructPayload(message, MAPPING_CONFIG[category.name])
  };
  set(
    payload.siteTrackingDomain,
    "name",
    get(payload.siteTrackingDomain, "name")
      .replace("https://", "")
      .replace("http://", "")
  );
  return responseBuilderSimple(message, payload, category, destination);
};

const customTagProcessor = async (message, category, destination) => {
  const tagsToBeCreated = [];
  const tagIds = [];
  //Step - 1 Create the contact from the message
  let res;
  try {
    res = await Axios({
      method: "post",
      url: `${destination.Config.apiUrl}${
        category.endPoint ? category.endPoint : ""
      }`,
      headers: {
        "Content-Type": "application/json",
        "Api-Token": destination.Config.apiKey
      },
      data: {
        contact: constructPayload(message, MAPPING_CONFIG[category.name])
      }
    });
  } catch (err) {
    throw Error("Failed to Create new Contact");
  }
  const created_contact = res.data.contact;

  const tags = get(message.context.traits, "tags")
    ? get(message.context.traits, "tags")
    : get(message.context.traits.traits, "tags");

  //Fetch already created tags from dest
  try {
    res = await Axios({
      method: "get",
      url: `${destination.Config.apiUrl}${
        category.tagEndPoint ? category.tagEndPoint : ""
      }`,
      headers: {
        "Content-Type": "application/json",
        "Api-Token": destination.Config.apiKey
      }
    });
  } catch (err) {
    throw Error("Failed to Create new Contact");
  }
  //Creating a Stored tag map [tag_name] => tag_id for easy compare
  let storedTags = {};
  res.data.tags.map(t => {
    storedTags[t.tag] = t.id;
  });

  //Step - 2 Check if tags already present then skip create, merge directly using id
  tags.map(tag => {
    if (!storedTags[tag]) tagsToBeCreated.push(tag);
    else tagIds.push(storedTags[tag]);
  });

  // Step - 3 Create tags if required
  if (tagsToBeCreated.length > 0) {
    await Promise.all(
      tagsToBeCreated.map(async tag => {
        try {
          res = await Axios({
            method: "post",
            url: `${destination.Config.apiUrl}${
              category.tagEndPoint ? category.tagEndPoint : ""
            }`,
            headers: {
              "Content-Type": "application/json",
              "Api-Token": destination.Config.apiKey
            },
            data: {
              tag: {
                tag: tag,
                tagType: "contact",
                description: ""
              }
            }
          });
        } catch (err) {
          LOG.error(`Create tag failed error:${err}`);
        }
        //For each tags successfully created the response id is pushed to tagIds
        if (res.status == 201) tagIds.push(res.data.tag.id);
      })
    );
  }

  //Step - 4 Merge Created contact with created tags, tagIds array is used
  await Promise.all(
    tagIds.map(async tagId => {
      try {
        res = await Axios({
          method: "post",
          url: `${destination.Config.apiUrl}${
            category.mergeTagWithContactUrl
              ? category.mergeTagWithContactUrl
              : ""
          }`,
          headers: {
            "Content-Type": "application/json",
            "Api-Token": destination.Config.apiKey
          },
          data: {
            contactTag: {
              contact: created_contact.id,
              tag: tagId
            }
          }
        });
      } catch (err) {
        LOG.error(`Merge contact with tags failed error:${err}`);
      }
    })
  );

  return created_contact;
};

const customFieldProcessor = async (
  message,
  category,
  destination,
  createdContact
) => {
  let responseStaging;
  let res;
  // Extract the custom field info from the message
  const fieldInfo = get(message.context.traits, "fieldInfo")
    ? get(message.context.traits, "fieldInfo")
    : get(message.context.traits.traits, "fieldInfo");

  const fieldKeys = Object.keys(fieldInfo);
  // Get the existing field data from dest and store it in responseStaging
  try {
    res = await Axios({
      method: "get",
      url: `${destination.Config.apiUrl}${
        category.fieldEndPoint ? category.fieldEndPoint : ""
      }`,
      headers: {
        "Api-Token": destination.Config.apiKey
      }
    });
    responseStaging = res.status == 200 ? res.data.fields : [];
  } catch (err) {
    LOG.error(`Error while fetching existing fields from dest`);
  }

  let fieldMap = {};
  responseStaging.map(field => {
    fieldMap[field.title] = field.id;
  });

  const storedFields = Object.keys(fieldMap);
  fieldKeys.map(fieldKey => {
    //If the field is not present in fieldMap log an error
    if (!storedFields.includes(fieldKey))
      LOG.error(`Field ${fieldKey} does not exist in destination, skipping ..`);
  });

  //fieldmap has all the field info in K/V  pair => [title] = id
  //Using the fieldKeys from the map for sending mapping request

  await Promise.all(
    fieldKeys.map(async key => {
      try {
        let resp = await Axios({
          method: "post",
          url: `${destination.Config.apiUrl}${
            category.mergeFieldValueWithContactUrl
              ? category.mergeFieldValueWithContactUrl
              : ""
          }`,
          headers: {
            "Content-Type": "application/json",
            "Api-Token": destination.Config.apiKey
          },
          data: {
            fieldValue: {
              contact: createdContact.id,
              field: fieldMap[key],
              value: fieldInfo[key]
            }
          }
        });
      } catch (err) {
        LOG.error(`Error While Creating field ${field}`);
      }
    })
  );
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const messageType = message.type.toLowerCase();
  let response;
  let category;
  switch (messageType) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.IDENTIFY;
      response = identifyRequestHandler(message, category, destination);
      break;
    case EventType.PAGE:
      category = CONFIG_CATEGORIES.PAGE;
      response = pageRequestHandler(message, category, destination);
      break;
    case EventType.SCREEN:
      category = CONFIG_CATEGORIES.SCREEN;
      break;
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      break;
    default:
      throw Error("Message type not supported");
  }
  return response;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;
