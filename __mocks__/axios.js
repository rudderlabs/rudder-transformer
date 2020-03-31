const axios = jest.genMockFromModule("axios");

const urlDirectoryMap = {
  "api.hubapi.com": "hs",
  "zendesk.com": "zendesk"
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

const salesForceAuthData=   {
    access_token: '00D2v000002lXbX!ARcAQJBSGNA1Rq.MbUdtmlREscrN_nO3ckBz6kc4jRQGxqAzNkhT1XZIF0yPqyCQSnezWO3osMw1ewpjToO7q41E9.LvedWY',
    instance_url: 'https://ap15.salesforce.com',
    id: 'https://login.salesforce.com/id/00D2v000002lXbXEAU/0052v00000ga9WqAAI',
    token_type: 'Bearer',
    issued_at: '1582343657644',
    signature: 'XRgUHXVBSWhLHZVoVFZby/idWXdAPA5lMW/ZdLMzB8o='
  } ;

function get(url) {
  const mockData = getData(url);
  return new Promise((resolve, reject) => {
    resolve({ data: mockData });
  });
}

function post(url, payload, config) {
  const mockData = getData(url);
  return new Promise((resolve, reject) => {
    resolve({ data: mockData });
  });
}

function post(url){
  if(url.startsWith("https://login.salesforce.com/services/oauth2/token") ){
    return new Promise((resolve, reject) => {
      resolve({ data: salesForceAuthData });
    });
  }

  else{
    return new Promise((resolve, reject) => {
      resolve({ data: mockData });
    });
  }
}
axios.get = get;
axios.post = post;
module.exports = axios;
