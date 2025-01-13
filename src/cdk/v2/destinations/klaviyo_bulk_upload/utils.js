/* eslint-disable no-param-reassign */
const { removeUndefinedValues } = require('../../../../v0/util');

const locationAttributes = [
  'address1',
  'address2',
  'city',
  'country',
  'latitude',
  'longitude',
  'region',
  'zip',
  'ip',
];

const standardTraits = [
  'email',
  'phone_number',
  'external_id',
  'anonymous_id',
  '_kx',
  'first_name',
  'last_name',
  'organization',
  'title',
  'image',
];

function setStandardAndCustomTraits(traits) {
  const standardAttributes = {};
  const customAttributes = {};
  return Object.keys(traits).reduce(
    (result, key) => {
      if (!locationAttributes.includes(key) && standardTraits.includes(key)) {
        result.standardAttributes[key] = traits[key];
      } else if (!locationAttributes.includes(key)) {
        result.customAttributes[key] = traits[key];
      }
      return result;
    },
    { standardAttributes, customAttributes },
  );
}

function generateLocationObject({
  traits: { address1, address2, city, country, latitude, longitude, region, zip, ip },
}) {
  const locationObject = {
    address1,
    address2,
    city,
    country,
    latitude,
    longitude,
    region,
    zip,
    ip,
  };

  return removeUndefinedValues(locationObject);
}

function transformSingleMessage(data, metadata) {
  const { context, traits } = data;
  const location = generateLocationObject(data);
  const { jobId } = metadata;
  const { standardAttributes, customAttributes } = setStandardAndCustomTraits(traits);
  const transformedSinglePayload = {
    type: 'profile',
    attributes: {
      ...standardAttributes,
      location,
      properties: customAttributes,
      anonymous_id: context.externalId[0].id,
      jobIdentifier: `${context.externalId[0].id}:${jobId}`,
    },
  };
  if (context.externalId[0].identifierType === 'id') {
    transformedSinglePayload.id = context.externalId[0].id || traits.id;
    transformedSinglePayload.attributes.anonymous_id = context.externalId[0].id;
  } else if (context.externalId[0].identifierType === 'email') {
    transformedSinglePayload.attributes.email = context.externalId[0].id;
  }
  if (Object.keys(transformedSinglePayload.attributes.location).length === 0) {
    delete transformedSinglePayload.attributes.location;
  }
  if (Object.keys(transformedSinglePayload.attributes.properties).length === 0) {
    delete transformedSinglePayload.attributes.properties;
  }
  return removeUndefinedValues(transformedSinglePayload);
}

function wrapCombinePayloads(transformedInputs, destinationObj) {
  if (destinationObj.Config.listId) {
    return {
      payload: {
        data: {
          type: 'profile-bulk-import-job',
          attributes: {
            profiles: {
              data: transformedInputs,
            },
          },
          relationships: {
            lists: {
              data: [
                {
                  type: 'list',
                  id: destinationObj.Config.listId,
                },
              ],
            },
          },
        },
      },
      destination: destinationObj,
    };
  }
  return {
    payload: {
      data: {
        type: 'profile-bulk-import-job',
        attributes: {
          profiles: {
            data: transformedInputs,
          },
        },
      },
    },
    destination: destinationObj,
  };
}

function combinePayloads(inputs) {
  const transformedInputs = inputs.map((input) => {
    const { message, metadata } = input;
    return transformSingleMessage(message, metadata);
  });
  const destinationObj = inputs[inputs.length - 1].destination;

  const { payload } = wrapCombinePayloads(transformedInputs, destinationObj);
  return { ...payload };
}

module.exports = { transformSingleMessage, combinePayloads };
