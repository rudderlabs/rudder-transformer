const { process } = require("./transform");
const { GAConfigCategory } = require("./config");

const mappingConfig = {};

const initialize = () => {
  console.log("Initializing");
};

const transform = request => process(request);

module.exports = {
  initialize,
  transform,
  mappingConfig
};
