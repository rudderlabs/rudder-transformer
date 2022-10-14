const fs = require("fs");
const path = require("path");

const urlDirectoryMap = {
  "api.wootric.com": "wootric"
};

const getData = url => {
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
};

const wootricGetRequestHandler = url => {
  const mockData = getData(url);
  if (mockData) {
    return { data: mockData, status: 200 };
  }
  return new Promise((resolve, reject) => {
    resolve({ error: "Request failed", status: 404 });
  });
};

const wootricPostRequestHandler = (url, payload) => {
  const mockData = getData(url);
  if (mockData) {
    return { data: mockData, status: 200 };
  }
  return new Promise((resolve, reject) => {
    reject({
      response: {
        data: {
          error: "Not found",
          status: 404
        }
      }
    });
  });
};

module.exports = {
  wootricGetRequestHandler,
  wootricPostRequestHandler
};
