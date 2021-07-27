////////////////////////////////////////////////////////////////////////////////
// TODO: Need to figure out a way to mock failed requests based on post body
////////////////////////////////////////////////////////////////////////////////
const axios = jest.genMockFromModule("axios");
const acPostRequestHandler = require("./active_campaign.mock");
const klaviyoPostRequestHandler = require("./klaviyo.mock");
const kustomerGetRequestHandler = require("./kustomer.mock");
const trengoGetRequestHandler = require("./trengo.mock");
const gainsightRequestHandler = require("./gainsight.mock");
const mailchimpGetRequestHandler = require("./mailchimp.mock");
const { gainsightPXGetRequestHandler } = require("./gainsight_px.mock");
const { hsGetRequestHandler } = require("./hs.mock");
const { delightedGetRequestHandler } = require("./delighted.mock");

const urlDirectoryMap = {
  "api.hubapi.com": "hs",
  "zendesk.com": "zendesk",
  "salesforce.com": "salesforce",
  "mktorest.com": "marketo",
  "active.campaigns.rudder.com": "active_campaigns",
  "api.aptrinsic.com": "gainsight_px"
};

const fs = require("fs");
const path = require("path");

const getParamEncodedUrl = (url, options) => {
  const { params } = options;
  const paramString = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join("&");
  return `${url}?${paramString}`;
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
      path.resolve(__dirname, `./data/${directory}/response.json`)
    );
    const data = JSON.parse(dataFile);
    return data[url];
  }
  return {};
}

function get(url, options) {
  const mockData = getData(url);
  if (url.includes("https://api.kustomerapp.com")) {
    return new Promise((resolve, reject) => {
      resolve(kustomerGetRequestHandler(url));
    });
  }
  if (url.includes("https://app.trengo.com")) {
    return new Promise((resolve, reject) => {
      resolve(trengoGetRequestHandler(url));
    });
  }
  if (url.includes("api.mailchimp.com")) {
    return new Promise((resolve, reject) => {
      resolve(mailchimpGetRequestHandler(url));
    });
  }
  if (url.includes("https://api.aptrinsic.com")) {
    return gainsightPXGetRequestHandler(url, mockData);
  }
  if (url.includes("https://api.hubapi.com")) {
    return hsGetRequestHandler(url, mockData);
  }
  if (url.includes("https://api.delighted.com/v1/people.json")) {
    return delightedGetRequestHandler(options);
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
  if (url.includes("https://a.klaviyo.com")) {
    return new Promise((resolve, reject) => {
      resolve(klaviyoPostRequestHandler(url, payload));
    });
  }
  if (url.includes("https://demo-domain.gainsightcloud.com")) {
    return new Promise(resolve => {
      resolve(gainsightRequestHandler(url, payload));
    });
  }
  if (url.includes("https://api.aptrinsic.com")) {
    return new Promise(resolve => {
      resolve({ status: 201 });
    });
  }
  return new Promise((resolve, reject) => {
    if (mockData) {
      resolve({ data: mockData });
    } else {
      resolve({ error: "Request failed" });
    }
  });
}

function put(url, payload, options) {
  const mockData = getData(url);
  if (url.includes("https://demo-domain.gainsightcloud.com")) {
    return new Promise(resolve => {
      resolve(
        gainsightRequestHandler(getParamEncodedUrl(url, options), payload)
      );
    });
  }
  if (url.includes("https://api.aptrinsic.com")) {
    return new Promise(resolve => {
      resolve({ status: 204 });
    });
  }
  return new Promise((resolve, reject) => {
    if (mockData) {
      resolve({ data: mockData });
    } else {
      resolve({ error: "Request failed" });
    }
  });
}

axios.get = get;
axios.post = post;
axios.put = put;
module.exports = axios;
