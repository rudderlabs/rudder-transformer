// one for lists
const { set } = require("lodash");
const { getDestinationExternalID } = require("../../util");

/**
 * @param {*} message
 * @param {*} Config
 * @returns the listIds from the payload based on priority and availability
 */
const getLists = (message, Config) => {
  let listIds = getDestinationExternalID(message, "engageListId");
  if (!listIds) {
    listIds = [];
    const objectlist = Config?.listIds;
    if (objectlist) {
      objectlist.forEach(v => {
        listIds = listIds.concat(Object.values(v));
      });
    }
  }
  return listIds;
};

/**
 * @param {*} message
 * @returns the Engage User ID based on priority and availability
 */
const getUID = message => {
  let engageId = getDestinationExternalID(message, "engageId");
  if (!engageId) {
    const { context, traits, anonymousId, userId } = message;
    if (
      userId ||
      traits?.userId ||
      traits?.id ||
      context?.traits?.userId ||
      context?.traits?.id ||
      anonymousId
    )
      engageId =
        userId ||
        traits.userId ||
        traits.id ||
        context.traits.userId ||
        context.traits.id ||
        anonymousId;
  }
  return engageId;
};

/**
 * @param {*} message
 * @returns Page Event name with category
 */
const getEvent = message => {
  const { name, category } = message;
  const pageCat = category ? "".concat(category, " ") : "";
  const pageName = name ? "".concat(name, " ") : "";
  const generatedName = `${pageCat}${pageName}`;
  const validName =
    generatedName.length > 20 ? generatedName.substring(0, 19) : generatedName;
  const eventName = `Viewed ${validName} Page`;
  return eventName;
};

/**
 * Flatens the input payload
 * @param {*} payload
 * @returns the flattened payload at all levels
 */
const flattenPayload = payload => {
  const flattenedPayload = {};
  if (payload) {
    Object.keys(payload).forEach(v => {
      if (typeof payload[v] === "object" && !Array.isArray(payload[v])) {
        const temp = flattenPayload(payload[v]);
        Object.keys(temp).forEach(i => {
          flattenedPayload[i] = temp[i];
        });
      } else {
        flattenedPayload[v] = payload[v];
      }
    });
  }
  return flattenedPayload;
};

/**
 * @param {*} attributes
 * @param {*} specificGenericFields
 * @returns flattens the attribut object and
 * constructs payload for the ones going as into meta object
 */
const refinePayload = (attributes, specificGenericFields) => {
  const flattenedPayload = flattenPayload(attributes);
  const payload = {};
  Object.keys(flattenedPayload).forEach(v => {
    if (!specificGenericFields.includes(v)) {
      set(payload, `${v}`, flattenedPayload[v]);
    }
  });
  return payload;
};
module.exports = { refinePayload, getUID, getEvent, getLists };
