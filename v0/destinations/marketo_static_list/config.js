const ACTIVITY_METRIC = "marketo_activity";
const FETCH_TOKEN_METRIC = "marketo_fetch_token";
const MAX_LEAD_IDS_SIZE = 300;
const DESTINATION = "marketo";

const formatConfig = destination => {
  return {
    ID: destination.ID,
    ...destination.Config
  };
};

module.exports = {
  ACTIVITY_METRIC,
  FETCH_TOKEN_METRIC,
  DESTINATION,
  formatConfig,
  MAX_LEAD_IDS_SIZE
};
