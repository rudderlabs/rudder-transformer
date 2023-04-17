const fs = require("fs");
const path = require("path");
const { isHttpStatusSuccess } = require("../../src/v0/util");

const urlDirectoryMap = {
  "api.hubapi.com": "hs",
  "zendesk.com": "zendesk",
  "salesforce.com": "salesforce",
  "mktorest.com": "marketo",
  "active.campaigns.rudder.com": "active_campaigns",
  "api.aptrinsic.com": "gainsight_px",
  "api.amplitude.com": "am",
  "rudderstack.my.salesforce.com": "salesforce",
  "braze.com": "braze",
  "bigquery.googleapis.com": "bqstream",
  "pi.pardot.com": "pardot",
  "googleads.googleapis.com": "google_adwords_remarketing_lists",
  "graph.facebook.com/v16.0/1234567891234567": "facebook_pixel",
  "graph.facebook.com/v16.0/RudderFbApp": "fb",
  "api.wootric.com": "wootric",
  "api.mautic.com": "mautic",
  "adsapi.snapchat.com": "snapchat_custom_audience",
  "api.clevertap.com": "clevertap",
  "marketo_acct_id_success.mktorest.com": "marketo_static_list",
  "api.criteo.com": "criteo_audience",
  "business-api.tiktok.com": "tiktok_ads"
};

function getData(arg) {
  const { url } = arg;
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
    if (data[url]) {
      const axiosResponseKey = arg.headers?.['test-dest-response-key'];
      return data[url]?.[axiosResponseKey] || data[url];
    }
    return data[url];
  }
  return {};
}

const mockedAxiosClient = arg => {
  const mockedResponse = getData(arg);
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
