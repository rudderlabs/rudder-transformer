const { TransformationError } = require("../../util/errorTypes");
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
 * Fetches the platform type from the destination Config
 * @param {*} destination
 * @returns platform type used
 */
const fetchPlatform = destination => {
  const { Config } = destination;
  const { cloudMode } = Config;
  if (cloudMode === "web") {
    return "pl";
  }
  if (cloudMode === "server") {
    return "diapi";
  }
  throw new TransformationError("Payload contains invalid configuration");
};

module.exports = { generatePageName, fetchPlatform };
