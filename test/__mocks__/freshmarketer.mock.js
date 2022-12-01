const fs = require("fs");
const path = require("path");

const urlDirectoryMap = {
  "myfreshworks.com/crm/sales/api": "freshmarketer"
};

const getData = url => {
  let directory = "freshmarketer";
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
};

const freshmarketerPostRequestHandler = (url, payload) => {
  const mockData = getData(url);
  if (mockData) {
    return {
      data: mockData,
      status: 200
    };
  }
  return new Promise((resolve, reject) => {
    resolve({ error: "Request failed", status: 404 });
  });
};

const freshmarketerGetRequestHandler = url => {
  const mockData = getData(url);
  if (mockData) {
    //resolve with status 200
    return Promise.resolve({ data: mockData, status: 200 });
  }
  return new Promise((resolve, reject) => {
    resolve({ error: "Request failed", status: 404 });
  });
};

module.exports = {
  freshmarketerPostRequestHandler,
  freshmarketerGetRequestHandler
};
