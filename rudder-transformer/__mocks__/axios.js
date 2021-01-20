////////////////////////////////////////////////////////////////////////////////
// TODO: Need to figure out a way to mock failed requests based on post body
////////////////////////////////////////////////////////////////////////////////
const axios = jest.genMockFromModule("axios");

const urlDirectoryMap = {
  "api.hubapi.com": "hs",
  "zendesk.com": "zendesk",
  "salesforce.com": "salesforce",
  "mktorest.com": "marketo"
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

function get(url) {
  const data = getData(url);
  return new Promise((resolve, reject) => {
    if (data) {
      resolve({ data });
    } else {
      resolve({ error: "Request failed" });
    }
  });
}

function post(url) {
  const data = getData(url);
  return new Promise((resolve, reject) => {
    if (data) {
      resolve({ data });
    } else {
      resolve({ error: "Request failed" });
    }
  });
}
axios.get = get;
axios.post = post;
module.exports = axios;
