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
  "graph.facebook.com": "facebook_pixel",
  "api.wootric.com": "wootric",
  "api.mautic.com": "mautic",
  "adsapi.snapchat.com": "snapchat_custom_audience",
  "api.clevertap.com": "clevertap",
  "marketo_acct_id_success.mktorest.com": "marketo_static_list",
  "api.criteo.com": "criteo_audience",
  "business-api.tiktok.com": "tiktok_ads"
};
let counterMap = Object.values(urlDirectoryMap).reduce((agg, currKey) => ({ ...agg, [currKey]: 0 }), {})

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
    if (Array.isArray(data[url])) {
      const count = counterMap[directory];
      counterMap[directory] += 1;
      return data[url][count];
    }
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

const flushCounter = (type) => {
  if (type) {
    // update for specific destType
    counterMap[type] = 0
    return;
  }
  // Update all the counter keys
  counterMap = Object.values(urlDirectoryMap).reduce((agg, currKey) => ({ ...agg, [currKey]: 0 }), {})
};

module.exports = {
  mockedAxiosClient,
  flushCounter
};
