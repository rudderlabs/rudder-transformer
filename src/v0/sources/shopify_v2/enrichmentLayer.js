const path = require('path');
const fs = require('fs');
const { RUDDER_ECOM_MAP, PROPERTIES_MAPPING_EXCLUSION_FIELDS } = require('./config');
const logger = require('../../../logger');

const enrichPayload = {
  /**
   * This event sets the extra properties for an ecomm event that are not mapped in ecom mapping jsons
   * @param {*} message
   * @param {*} event
   * @param {*} shopifyTopic
   * @returns
   */
  setExtraNonEcomProperties(message, event, shopifyTopic) {
    const updatedMessage = message;
    try {
      const mappingFields = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, 'data', `${RUDDER_ECOM_MAP[shopifyTopic].name}.json`),
        ),
      );
      const fieldsToBeIgnored = [
        ...PROPERTIES_MAPPING_EXCLUSION_FIELDS,
        ...mappingFields.map((item) => item.sourceKeys),
      ];

      Object.keys(event).forEach((key) => {
        if (!fieldsToBeIgnored.includes(key)) {
          updatedMessage.properties[`${key}`] = event[key];
        }
      });
    } catch (e) {
      logger.debug(
        `${shopifyTopic} is either not an ecom event or does not have mapping json-> ${e}`,
      );
      return updatedMessage;
    }
    return updatedMessage;
  },
};
module.exports = { enrichPayload };
