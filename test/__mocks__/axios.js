/// /////////////////////////////////////////////////////////////////////////////
// TODO: Need to figure out a way to mock failed requests based on post body
/// /////////////////////////////////////////////////////////////////////////////
const axios = jest.genMockFromModule("axios");
const acPostRequestHandler = require("./active_campaign.mock");

const trengoGetRequestHandler = require("./trengo.mock");
const yahooDspPostRequestHandler = require("./yahoo_dsp.mock");
const cannyPostRequestHandler = require("./canny.mock");
const { userGetRequestHandler, userPutRequestHandler } = require("./user.mock");
const { mixpanelPostRequestHandler } = require("./mixpanel.mock");
const { sendgridGetRequestHandler } = require("./sendgrid.mock");
const { courierGetRequestHandler } = require("./courier.mock");
const { brazePostRequestHandler } = require("./braze.mock");

const urlDirectoryMap = {
  "zendesk.com": "zendesk",
  "salesforce.com": "salesforce",
  "mktorest.com": "marketo",
  "active.campaigns.rudder.com": "active_campaigns",
  "ruddertest2.mautic.net": "mautic",
  "api.sendgrid.com": "sendgrid",
  "api.criteo.com": "criteo_audience",
  "api.courier.com": "courier",
};

const fs = require("fs");
const path = require("path");

function getData(url) {
  let directory = "";
  Object.keys(urlDirectoryMap).forEach(key => {
    if (url.includes(key)) {
      directory = urlDirectoryMap[key];
    }
  });
  if (directory) {
    const dataFile = fs.readFileSync(
      path.resolve(__dirname, `./data/${directory}/response.json`)
    );
    const data = JSON.parse(dataFile);
    return data[url];
  }
  return {};
}

function get(url, options) {
  const mockData = getData(url);
  if (url.includes("https://app.trengo.com")) {
    return new Promise((resolve, reject) => {
      resolve(trengoGetRequestHandler(url));
    });
  }
  if (url.includes("https://commander.user.com")) {
    return new Promise((resolve, reject) => {
      resolve(userGetRequestHandler(url));
    });
  }
  if (url.includes("https://api.sendgrid.com/v3/marketing/field_definitions")) {
    return Promise.resolve(sendgridGetRequestHandler(url));
  }
  if (url.includes("https://api.courier.com")) {
    return Promise.resolve(courierGetRequestHandler(url, mockData));
  }
  if(url.includes("https://cdn.optimizely.com")){
    return Promise.resolve(optimizelyFullStackGetRequestHandler(url, mockData));
  }

  return new Promise((resolve, reject) => {
    if (mockData) {
      resolve({ data: mockData, status: 200 });
    } else {
      resolve({ error: "Request failed" });
    }
  });
}

function post(url, payload) {
  const mockData = getData(url);
  if (url.includes("https://active.campaigns.rudder.com")) {
    return new Promise((resolve, reject) => {
      resolve(acPostRequestHandler(url, payload));
    });
  }
  if(url.includes("braze.com")) {
    return new Promise((resolve, reject) => {
      resolve(brazePostRequestHandler(url, payload));
    });
  }
  if (url.includes("https://api.aptrinsic.com")) {
    return new Promise(resolve => {
      resolve({ status: 201 });
    });
  }
  if (url.includes("https://id.b2b.yahooinc.com")) {
    return new Promise((resolve, reject) => {
      resolve(yahooDspPostRequestHandler(url, payload));
    });
  }
  if (url.includes("https://canny.io/api/v1/users/retrieve")) {
    return new Promise((resolve, reject) => {
      resolve(cannyPostRequestHandler(url));
    });
  }
  if (
    url.includes("https://api.mixpanel.com/engage/") ||
    url.includes("https://api-eu.mixpanel.com/engage/")
  ) {
    return new Promise(resolve => {
      resolve(mixpanelPostRequestHandler(url, payload));
    });
  }
  if(url.includes("braze.com")) {
    return new Promise((resolve, reject) => {
      resolve(brazePostRequestHandler(url, payload));
    });
  }
  return new Promise((resolve, reject) => {
    if (mockData) {
      resolve({ data: mockData, status: 200 });
    } else {
      resolve({ error: "Request failed" });
    }
  });
}

function put(url, payload, options) {
  const mockData = getData(url);
  if (url.includes("https://commander.user.com")) {
    return new Promise((resolve, reject) => {
      resolve(userPutRequestHandler(url));
    });
  }
  if (url.includes("https://api.aptrinsic.com")) {
    return new Promise(resolve => {
      resolve({ status: 204 });
    });
  }
  return new Promise((resolve, reject) => {
    if (mockData) {
      resolve({ data: mockData, status: 200 });
    } else {
      resolve({ error: "Request failed" });
    }
  });
}

axios.get = get;
axios.post = post;
axios.put = put;
module.exports = axios;
