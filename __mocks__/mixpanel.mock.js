const fs = require("fs");
const path = require("path");

const urlDirectoryMap = {
  "https://api-eu.mixpanel.com/engage/": "mixpanel",
  "https://api.mixpanel.com/engage/": "mixpanel"
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

const mixpanelPostRequestHandler = (url, payload) => {
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

module.exports = { mixpanelPostRequestHandler };
