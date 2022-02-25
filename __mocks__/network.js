const fs = require("fs");
const path = require("path");
const { isHttpStatusSuccess } = require("../v0/util");

const urlDirectoryMap = {
  "api.hubapi.com": "hs",
  "zendesk.com": "zendesk",
  "salesforce.com": "salesforce",
  "mktorest.com": "marketo",
  "active.campaigns.rudder.com": "active_campaigns",
  "api.aptrinsic.com": "gainsight_px",
  "api.amplitude.com": "am",
  "braze.com": "braze",
  "bigquery.googleapis.com": "bqstream",
  "pi.pardot.com": "pardot",
  "googleads.googleapis.com": "google_adwords_remarketing_lists"
};

function getData(url) {
  let directory = "";
  Object.keys(urlDirectoryMap).forEach(key => {
    if (url.includes(key)) {
      directory = urlDirectoryMap[key];
    }
  });
  if (directory) {
    const dataFile = fs.readFileSync(
      path.resolve(__dirname, `./data/${directory}/proxy_response.json`)
    );
    const data = JSON.parse(dataFile);
    return data[url];
  }
  return {};
}

const mockedAxiosClient = arg => {
  const mockedResponse = getData(arg.url);
  return new Promise((resolve, reject) => {
    if (isHttpStatusSuccess(mockedResponse.status)) {
      resolve(mockedResponse);
    } else {
      reject(mockedResponse);
    }
  });
};

module.exports = {
  mockedAxiosClient
};
