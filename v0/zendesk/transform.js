const get = require("get-value");
const set = require("set-value");
const axios = require("axios");

const { EventType } = require("../../constants");
const { ConfigCategory, mappingConfig, ENDPOINT, defaultUserFields } = require("./config");
const {
  removeUndefinedValues,
  defaultPostRequestConfig,
  defaultRequestConfig
} = require("../util");

function responseBuilderSimple(message, category, destination) {
  mappingJson = mappingConfig[category.name];
  const rawPayload = {};

  const sourceKeys = Object.keys(mappingJson);
  sourceKeys.forEach(sourceKey => {
    set(rawPayload, mappingJson[sourceKey], get(message, sourceKey));
  });

  // console.log(rawPayload);
  return rawPayload;
}

async function createUserFields(new_fields, headers) {
  let url = 'https://test1239568.zendesk.com/api/v2/user_fields.json';
  let config = {'headers': headers};
  let field_data;
  new_fields.forEach(async (field) => {
    field_data = {
      "user_field": {
        "title": field,
        "active": true,
        "key": field,
        "description": field
      }
    };
    try {
      let response = await axios.post(url, field_data, config);
      console.log(response.status);
    }
    catch(error) {
      console.log(error.response.data.details.key[0].error);
      if (error.response.status !== 422 && error.response.data.details.key.error !== "DuplicateValue") {
        console.log(error);
      }
    }
    }
  );
  
}


async function createNewUserFields(traits, headers) {
  let new_fields = [];
  
  let url  = 'https://test1239568.zendesk.com/api/v2/user_fields.json';
  let config = {'headers': headers};
  
  try {
    let response = await axios.get(url, config);
    let existing_keys = response.data.user_fields.map(field => field.key);
    existing_keys = existing_keys.concat(defaultUserFields);

    const trait_keys = Object.keys(traits);
    new_fields = trait_keys.filter((key => !(existing_keys.includes(key))));
    console.log(new_fields);
    if(new_fields.length > 0)
      createUserFields(new_fields, headers);
  }
  catch(error) {
    error.response ? console.log("Error :", error.response.data) : console.log("Error :",error);
  }
}

function processSingleMessage(message, destination) {
  const messageType = message.type.toLowerCase();
  let category;
  let headers = {
    Authorization: 'Basic c2FuZ2h2aS5kaGF3YWwxMDE0MzNAZ21haWwuY29tOkV5IWlAMnRuNlloU0RweA==',
    'Content-Type': 'application/json'
  };

  switch (messageType) {
    case EventType.IDENTIFY:
      category = ConfigCategory.IDENTIFY;
      createNewUserFields(message.context.traits, headers);
      break;
    default:
      throw new Error("Message type not supported");
  }
  
  return responseBuilderSimple(message, category, destination);
}

function process(event) {
  let resp = processSingleMessage(event.message, event.destination);
  return resp;
}

exports.process = process;