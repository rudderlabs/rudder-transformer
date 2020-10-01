const fs = require("fs");
const path = require("path");

const getPath = file => path.resolve(__dirname, file);

const baseMapping = JSON.parse(
  fs.readFileSync(getPath("./data/FbAppBasicMapping.json"))
);

const eventNameMapping = JSON.parse(
  fs.readFileSync(getPath("./data/FbAppEventNameMapping.json"))
);

const eventPropsMapping = JSON.parse(
  fs.readFileSync(getPath("./data/FbAppEventPropsMapping.json"))
);

const eventPropsToPathMapping = JSON.parse(
  fs.readFileSync(getPath("./data/FbAppEventPropPathMapping.json"))
);

const eventPropToTypeMapping = JSON.parse(
  fs.readFileSync(getPath("FbAppEventPropToTypeMapping.json"))
);

module.exports = {
  baseMapping,
  eventNameMapping,
  eventPropsMapping,
  eventPropsToPathMapping,
  eventPropToTypeMapping
};
