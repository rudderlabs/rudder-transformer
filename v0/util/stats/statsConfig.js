/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
const _ = require("lodash");
const { isDefined } = require("..");
const stats = require("../../../util/stats");
const GenericResponseRules = require("./data/GenericResponseRules.json");

const TRANSFORMER_STATS_STORE = "destination_error_pool";
const STAGE = "transformer";

const collectStats = (error, event, transformedAt) => {
  let statusCode;
  let destConfig;
  const errKey = error.message;
  const { DestinationDefinition } = event.destination;
  const genericTransformerRules = GenericResponseRules.transformerRules;
  if (DestinationDefinition && DestinationDefinition.Config) {
    destConfig = DestinationDefinition.Config;
  }
  statusCode = genericTransformerRules[errKey];
  if (
    !statusCode &&
    destConfig &&
    destConfig.alertRules &&
    isDefined(destConfig.alertRules.transformerRules) &&
    _.isObject(destConfig.alertRules.transformerRules)
  ) {
    const { transformerRules } = destConfig.alertRules;
    statusCode = transformerRules[errKey];
    if (!statusCode) {
      // We should always throw absolute errors otherwise we will have to check if the error-key is present as a substring in the error
      const errorStrArray = Object.keys(transformerRules);
      errorStrArray.some(errStr => {
        if (_.includes(errKey, errStr)) {
          statusCode = transformerRules[errStr];
          return true;
        }
      });
    }
  }
  if (!statusCode) {
    statusCode = 400;
  }
  stats.increment(TRANSFORMER_STATS_STORE, 1, {
    code: statusCode,
    destination: DestinationDefinition.Name,
    transformedAt,
    stage: STAGE
  });
};

module.exports = {
  collectStats
};
