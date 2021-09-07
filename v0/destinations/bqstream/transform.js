/* eslint-disable no-console */
const {
  defaultRequestConfig,
  defaultPostRequestConfig
} = require("../../util");

const responseWrapper = response => {
  const resp = defaultRequestConfig();
  resp.endpoint = response.endPoint;
  resp.method = defaultPostRequestConfig.requestMethod;
  resp.headers = { ...response.headers, "Content-Type": "application/json" };
  resp.body.JSON = response.payload;
  return resp;
};

function process(event) {
  const { message } = event;
  const { properties } = message;
  const {
    destination: {
      Config: { datasetId, tableId }
    }
  } = event;

  const payload = {
    rows: [
      {
        json: { ...properties }
      }
    ]
  };
  return responseWrapper({
    payload,
    method: "POST",
    // TODO: ProjectID(rudder-sai) can be referred in a more customised way!
    endPoint: `https://bigquery.googleapis.com/bigquery/v2/projects/rudder-sai/datasets/${datasetId}/tables/${tableId}/insertAll`
    // endPoint: `https://bigquery.googleapis.com/bigquery/v2/projects/rudderstack-dev/datasets/${datasetId}/tables/${tableId}/insertAll`
  });
}

async function processAuth(AccountCache, event, response) {
  // OAuth for BQStream destination
  const { workspaceId } = event.metadata;
  const { accountId } = event.destination.Config;
  const oAuthToken = await AccountCache.getTokenFromCache(
    workspaceId,
    accountId
  );
  response.headers.Authorization = `Bearer ${oAuthToken}`;
  return response;
}

module.exports = { process, processAuth };
