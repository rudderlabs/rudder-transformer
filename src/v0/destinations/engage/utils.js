const { set } = require("lodash");
const { flattenMultilevelPayload } = require("../../util");

/**
 * This will return the listIds as array from externalId
 * @param {*} message input message
 * @param {*} type the value of type inside externalId that we will be looking for
 */
const getListsFromExternalId = (message, type) => {
  let externalIdArray = null;
  let destinationExternalId = [];
  if (message.context && message.context.externalId) {
    externalIdArray = message.context.externalId;
  }
  if (externalIdArray) {
    externalIdArray.forEach(extIdObj => {
      if (extIdObj.type === type) {
        destinationExternalId = destinationExternalId.concat(extIdObj.id);
      }
    });
  }
  return destinationExternalId;
};

/**
 * @param {*} message inout message
 * @param {*} Config Destination.Cofig provided in Dashboard
 * @returns the listIds from the payload based on priority and availability
 */
const getLists = (message, Config) => {
  let listIds = getListsFromExternalId(message, "engageListId");
  if (!listIds.length) {
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
 * @param {*} message input message
 * @returns Page Event name with category
 */
const generatePageName = message => {
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
 * @param {*} attributes payload that needs modification and transistion to payload
 * @param {*} specificGenericFields fields that should be overlooked when adding fields to payload
 * @returns payload
 */
const refinePayload = (attributes, specificGenericFields) => {
  const flattenedPayload = flattenMultilevelPayload(attributes);
  const payload = {};
  Object.keys(flattenedPayload).forEach(v => {
    if (!specificGenericFields.includes(v)) {
      set(payload, `${v}`, flattenedPayload[v]);
    }
  });
  return payload;
};
module.exports = { refinePayload, generatePageName, getLists };
