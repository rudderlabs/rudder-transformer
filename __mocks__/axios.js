////////////////////////////////////////////////////////////////////////////////
// TODO: Need to figure out a way to mock failed requests based on post body
////////////////////////////////////////////////////////////////////////////////
const axios = jest.genMockFromModule("axios");
const acPostRequestHandler = require("./active_campaign.mock");
const klaviyoPostRequestHandler = require("./klaviyo.mock");
const kustomerGetRequestHandler = require("./kustomer.mock");
const {
  pipedriveGetRequestHandler,
  pipedrivePostRequestHandler,
  pipedrivePutRequestHandler
} = require("./pipedrive.mock");

const urlDirectoryMap = {
  "api.hubapi.com": "hs",
  "zendesk.com": "zendesk",
  "salesforce.com": "salesforce",
  "mktorest.com": "marketo",
  "active.campaigns.rudder.com": "active_campaigns"
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
  if (url.includes("https://api.kustomerapp.com")) {
    return new Promise((resolve, reject) => {
      resolve(kustomerGetRequestHandler(url));
    });
  }

  if (url.includes("https://api.pipedrive.com")) {
    return new Promise((resolve, reject) => {
      resolve(pipedriveGetRequestHandler(url, options));
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

function post(url, payload, options) {
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
  if (url.includes("https://api.pipedrive.com")) {
    return new Promise((resolve, reject) => {
      resolve(pipedrivePostRequestHandler(url, payload, options));
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
  if (url.includes("https://api.pipedrive.com")) {
    return new Promise((resolve, reject) => {
      resolve(pipedrivePutRequestHandler(url, payload, options));
    });
  }
}

axios.get = get;
axios.post = post;
axios.put = put;
module.exports = axios;
