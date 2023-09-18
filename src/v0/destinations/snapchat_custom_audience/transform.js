const sha256 = require('sha256');
const {
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  simpleProcessRouterDest,
  isDefinedAndNotNullAndNotEmpty,
  getAccessToken,
} = require('../../util');
const { ConfigurationError } = require('../../util/errorTypes');
const { BASE_URL, schemaType } = require('./config');
const { validatePayload, validateFields } = require('./utils');
const { JSON_MIME_TYPE } = require('../../util/constant');

const generateResponse = (groupedData, schema, segmentId, metadata, type) => {
  const payload = { users: [] };
  const userPayload = { schema: [schema], data: groupedData };
  payload.users.push(userPayload);
  const response = defaultRequestConfig();
  if (type === 'remove') {
    response.method = 'DELETE';
    payload.users[0].id = `${segmentId}`;
  }

  response.endpoint = `${BASE_URL}/segments/${segmentId}/users`;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  const accessToken = getAccessToken(metadata, 'access_token');
  response.headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': JSON_MIME_TYPE,
  };

  return response;
};

const getProperty = (schema, element) => {
  let property;
  switch (schema) {
    case 'email':
      property = element?.email || element?.EMAIL || element?.Email;
      return property;
    case 'phone':
      property =
        element?.phone ||
        element?.Phone ||
        element?.PHONE ||
        element?.mobile ||
        element?.Mobile ||
        element?.MOBILE;
      return property;
    case 'mobileAdId':
      property =
        element?.mobileId ||
        element?.MOBILEID ||
        element?.mobileAdId ||
        element?.MOBILEADID ||
        element?.mobile_id ||
        element?.MOBILE_ID;
      return property;
    default:
      throw new ConfigurationError('Invalid schema');
  }
};

const getHashedProperty = (schema, hashedProperty) => {
  // Normalizing and hashing ref: https://marketingapi.snapchat.com/docs/#normalizing-hashing
  switch (schema) {
    case 'email':
      return sha256(hashedProperty.toLowerCase().trim());
    case 'phone':
      return sha256(hashedProperty.toLowerCase().trim().replace(/^0+/, '').replace(/\D/g, ''));
    case 'mobileAdId':
      return sha256(hashedProperty.toLowerCase());
    default:
      throw new ConfigurationError('Invalid schema');
  }
};

const getData = (userArray, schema, disableHashing) => {
  const data = [[]];
  let index = 0;
  let hashedProperty;
  userArray.forEach((element) => {
    hashedProperty = getProperty(schema, element);
    if (!isDefinedAndNotNullAndNotEmpty(hashedProperty)) {
      return;
    }
    if (!disableHashing) {
      hashedProperty = getHashedProperty(schema, hashedProperty);
    }

    // ref : https://marketingapi.snapchat.com/docs/#update-an-audience-segment:~:text=via%20a%20LIST-,Identifiers%20should%20be%20grouped%20in%20batches%20of%20a%20maximum%20of%20100%2C000%20identifiers/request.,-Attributes
    if (data[index].length >= 100000) {
      data.push([]);
      index += 1;
    }

    data[index].push([hashedProperty]);
  });
  validateFields(schema, data);
  return data;
};

const responseBuilder = (metadata, message, { Config }, type) => {
  const { schema, segmentId, disableHashing } = Config;

  const userArray = message.properties.listData[type];

  const data = getData(userArray, schema, disableHashing);

  const finalResponse = [];
  data.forEach((groupedData) => {
    finalResponse.push(
      generateResponse(groupedData, schemaType[schema], segmentId, metadata, type),
    );
  });
  return finalResponse;
};

const processEvent = (metadata, message, destination) => {
  const response = [];
  validatePayload(message);

  let payload;
  if (message.properties.listData.add) {
    payload = responseBuilder(metadata, message, destination, 'add');
    response.push(...payload);
  }
  if (message.properties.listData.remove) {
    payload = responseBuilder(metadata, message, destination, 'remove');
    response.push(...payload);
  }

  return response;
};

const process = (event) => processEvent(event.metadata, event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
