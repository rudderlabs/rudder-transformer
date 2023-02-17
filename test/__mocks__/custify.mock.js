const fs = require("fs");
const path = require("path");

const urlDirectoryMap = {
  "api.custify.com": "custify"
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

const custifyPostRequestHandler = url => {
  const mockData = getData(url);
  if (mockData) {
    // resolve with status 200
    return { data: mockData, status: 201 };
  }
  return new Promise((resolve, reject) => {
    resolve({ error: "Request failed", status: 500 });
  });
};

module.exports = custifyPostRequestHandler;
