/* eslint-disable array-callback-return */
const _ = require("lodash");
const stats = require("../../../util/stats");
const genericCodes = require("./data/GenericResponseRules.json");

const TRANSFORMER_STATS_STORE = "transformer_errors";

const collectStats = (error, event) => {
  console.log("in collect stats");
  let statusCode;
  const { DestinationDefinition } = event.destination;
  const destConfig = DestinationDefinition.Config;
  const errKey = error.message;
  const genericTransformerRules = genericCodes.transformerRules;
  statusCode = genericTransformerRules[errKey];
  if (!statusCode && destConfig) {
    const { transformerRules } = destConfig.alertRules;
    statusCode = transformerRules[errKey];
    if (!statusCode) {
      // We should always throw absolute errors otherwise we will have to check if the error-key is present as a substring in the error
      const errorStrArray = Object.keys(transformerRules);
      errorStrArray.map(errStr => {
        if (_.includes(errKey, errStr)) {
          statusCode = transformerRules[errStr];
        }
      });
    }
  }

  if (!statusCode) {
    statusCode = 400;
  }

  stats.increment(TRANSFORMER_STATS_STORE, 1, {
    code: "400",
    destination: DestinationDefinition.Name
  });
};

module.exports = {
  collectStats
};
