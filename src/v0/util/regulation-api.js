const { PlatformError } = require('@rudderstack/integrations-lib');

const RegulationApiUtils = {
  /**
   * Common validations that are part of `deleteUsers` api would be defined here
   *
   * @param {Array<{ userId:string, email:string, phone:string}>} userAttributes Array of objects with userId, email and phone
   */
  executeCommonValidations(userAttributes) {
    if (!Array.isArray(userAttributes)) {
      throw new PlatformError('userAttributes is not an array');
    }
  },
};

module.exports = RegulationApiUtils;
