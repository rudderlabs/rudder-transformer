/**
 * This class is used for handling Auth related errors
 */
const { default: axios } = require("axios");

const DISABLE_DEST = "DISABLE_DESTINATION";
const REFRESH_TOKEN = "REFRESH_TOKEN";

module.exports = {
  constants: { DISABLE_DEST, REFRESH_TOKEN },
};
