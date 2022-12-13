const ErrorBuilder = require("./error");

class RegulationApiUtils {
  /**
   * Common validations that are part of `deleteUsers` api would be defined here
   *
   * @param {Array<{ userId:string, email:string, phone:string}>} userAttributes Array of objects with userId, emaail and phone
   */
  static executeCommonValidations(userAttributes) {
    if (!Array.isArray(userAttributes)) {
      throw new ErrorBuilder()
        .setMessage("userAttributes is not an array")
        .setStatus(400)
        .build();
    }
  }
}

module.exports = RegulationApiUtils;
