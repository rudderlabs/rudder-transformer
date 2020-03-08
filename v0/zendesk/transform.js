const get = require("get-value");
const set = require("set-value");
const axios = require("axios");

const { EventType } = require("../../constants");
const { ConfigCategory, mappingConfig, defaultFields } = require("./config");
const {
  removeUndefinedValues,
  defaultPostRequestConfig,
  defaultRequestConfig
} = require("../util");

var endPoint;

async function processIdentify(message, destinationConfig, headers) {
  let category = ConfigCategory.IDENTIFY;
  // create user fields if required
  await checkAndCreateUserFields(message.context.traits, category, headers);
  
  let payload = getIdentifyPayload(message, category, destinationConfig);
  let url = endPoint + category.createOrUpdateUserEndpoint;
  return responseBuilder(message, headers, payload, url);
}

async function createUserFields(url, config, new_fields) {
  let field_data;
  
  new_fields.forEach(async (field) => {
    // create payload for each new user field
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
      if(response.status !== 201) {
        console.log("Failed to create User Field : ", field);
      }
    }
    catch(error) {
      if ( error.response && error.response.status !== 422) {
        console.log("Cannot create User field ", field, error);
      }
    }
    }
  );
  
}

async function checkAndCreateUserFields(traits, category, headers) {
  let new_fields = [];
  
  let url  = endPoint + category.userFieldsEndpoint;
  let config = {'headers': headers};
  
  try {
    let response = await axios.get(url, config);
    if ( response.data && response.data.user_fields)
    {
      // get existing user_fields and concatenate them with default fields
      let existing_keys = response.data.user_fields.map(field => field.key);
      existing_keys = existing_keys.concat(defaultFields);
      
      // check for new fields
      const trait_keys = Object.keys(traits);
      new_fields = trait_keys.filter((key => !(existing_keys.includes(key))));

      if(new_fields.length > 0)
        await createUserFields(url, config, new_fields);
    }
  }
  catch(error) {
    error.response ? console.log("Error :", error.response.data) : console.log("Error :",error);
  }
}

function getIdentifyPayload(message, category, destinationConfig) {
  mappingJson = mappingConfig[category.name];
  const payload = {};

  const sourceKeys = Object.keys(mappingJson);
  sourceKeys.forEach(sourceKey => {
    set(payload, mappingJson[sourceKey], get(message, sourceKey));
  });
  
  // send fields not in sourceKeys as user fields
  const trait_keys = Object.keys(message.context.traits);
  const user_fields = trait_keys.filter(trait => !(sourceKeys.includes("context.traits."+trait)));
  user_fields.forEach(field => {
    set(payload, "user.user_fields."+field, get(message, "context.traits."+field));
  });

  payload.user = removeUndefinedValues(payload.user);

  if (destinationConfig.createUsersAsVerified) {
    set(payload, "user.verified", true);
  }
  
  return payload;
}



async function processGroup(message, destinationConfig, headers) {
  let category = ConfigCategory.GROUP;
  let payload;
  let url;

  if (destinationConfig.sendGroupCallsWithoutUserId) {
    payload = await createOrganization(message, category, headers, destinationConfig);
    url  = endPoint + category.createEndpoint;
  }
  else {
    let orgId = await createOrganization(message, category, headers, destinationConfig);
    if (!orgId) {
      console.log(`Couldn't create user membership for user having external id ${message.userId} as Organization ${message.traits.name} wasn't created`);
      // what to return in case of error?
    }
    payload = await getUserMembershipPayload(message, headers, orgId);
    url = endPoint + category.userMembershipEndpoint;
  }

  return responseBuilder(message, headers, payload, url);
}

async function getUserMembershipPayload(message, headers, orgId) {
  let zendeskUserId = await getUserId(message.userId, headers);
  
  let payload = {
    organization_membership: {
      user_id: zendeskUserId,
      organization_id: orgId
    }
  };

  return payload;
}

async function getUserId(externalId,  headers) {
  let url  = endPoint + `users/search.json?external_id=${externalId}`;
  let config = {'headers': headers};
  
  try {
    let resp = await axios.get(url, config);

    if( !resp || !resp.data || resp.data.count === 0) {
      console.log("User not found");
      return undefined;
    }

    let zendeskUserId = resp.data.users[0].id;
    return zendeskUserId;
  }
  catch(error) {
    console.log(`Cannot get userId for externalId : ${externalId}`, error.response);
  }
}

async function createOrganization(message, category, headers, destinationConfig) {
  mappingJson = mappingConfig[category.name];
  const payload = {};

  const sourceKeys = Object.keys(mappingJson);
  sourceKeys.forEach(sourceKey => {
    set(payload, mappingJson[sourceKey], get(message, sourceKey));
  });

  payload.organization = removeUndefinedValues(payload.organization);
  
  if ( destinationConfig.sendGroupCallsWithoutUserId ) {
    return payload;
  }

  let url  = endPoint + category.createEndpoint;
  let config = {'headers': headers};
  
  try {
    let resp = await axios.post(url, payload, config);

    if ( !resp.data || !resp.data.organization ){
      console.log(`Couldn't create Organization: ${message.traits.name}`);
      return undefined;
    }

    let orgId = resp.data.organization.id;
    return orgId;
  }
  catch(error) {
    console.log(`Couldn't create Organization: ${message.traits.name}`);
  }
}

async function processTrack(message, destinationConfig, headers){
  let userId = message.userId;
  if(!userId){
    throw new Error("user id is not present");
  }
  let url = endPoint + "users/search.json?external_id=" + userId;
  let config = {'headers': headers};
  let userResponse = await axios.get(url, config);
  if(!userResponse || !userResponse.data || userResponse.data.count == 0){
    throw new Error("user not found");
  }
  let zendeskUserId = userResponse.data.users[0].id;
  let userEmail = userResponse.data.users[0].email;

  let eventObject = {};
  eventObject.description = message.event;
  eventObject.type = message.event;
  eventObject.source = "Rudder";
  eventObject.properties = message.properties;

  let profileObject = {};
  profileObject.type = message.event;
  profileObject.source = "Rudder";
  profileObject.identifiers = [{ type: "email", value: userEmail }];

  let eventPayload = {event: eventObject, profile: profileObject};
  url = endPoint + "users/" + zendeskUserId + "/events";

  const response = responseBuilder(message, headers, eventPayload, url);
  return response;
}


function responseBuilder(message, headers, payload, endPoint) {
  const response = defaultRequestConfig();

  response.endpoint = endPoint;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = headers;
  response.userId = message.userId ? message.userId : message.anonymousId;
  response.body.JSON = payload;

  return response;
}


async function processSingleMessage(event) {
  let message = event.message;
  let destinationConfig = event.destination.Config;
  const messageType = message.type.toLowerCase();
  let unencodedBase64Str = destinationConfig.email+":"+destinationConfig.password;
  let headers = {
    Authorization: 'Basic ' + Buffer.from(unencodedBase64Str).toString("base64"),
    'Content-Type': 'application/json'
  };

  switch (messageType) {
    case EventType.IDENTIFY:
      return processIdentify(message, destinationConfig, headers);
    case EventType.GROUP:
      return processGroup(message, destinationConfig, headers);
    case EventType.TRACK:
      return processTrack(message, destinationConfig, headers);
    default:
      throw new Error("Message type not supported");
  }
}

async function process(event) {
  endPoint = `https://${event.destination.Config.domain}.zendesk.com/api/v2/`;
  let resp = await processSingleMessage(event);
  return resp;
}

exports.process = process;