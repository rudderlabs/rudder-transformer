const { getMappingConfig } = require("../../util");

const ENDPOINT = "https://engine.monetate.net/api/engine/v1/decide/";

const mappingConfig = getMappingConfig(
  {
    Track: {
      name: "MONETATETrack"
    },
    Page: {
      name: "MONETATEPage"
    },
    Screen: {
      name : "MONETATEScreen"
    }
  },
  __dirname
);

exports.ENDPOINT = ENDPOINT;
exports.mappingConfig = mappingConfig;
