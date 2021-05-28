const stats = require("../../../util/stats");

const TRANSFORMER_STATS_STORE = "transformer_errors";

const collectStats = (error, event) => {
  let statusCode;
  const { DestinationDefinition } = event.destination;
  const destConfig = DestinationDefinition.Config;
  const errKey = error.message;
  if (destConfig) {
    const { transformerRules } = destConfig.alertRules;
    statusCode = transformerRules[errKey];
  }

  if (!statusCode) {
    statusCode = 400;
  }

  stats.increment(TRANSFORMER_STATS_STORE, 1, {
    code: "400",
    destination: DestinationDefinition.Name
  });
};

module.exports = collectStats;
