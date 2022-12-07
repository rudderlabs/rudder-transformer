const fs = require("fs");
const path = require("path");

const urlDirectoryMap = {
  "api.clickup.com": "clickup"
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

const clickUpGetRequestHandler = url => {
  const mockData = getData(url);
  if (mockData) {
    return { data: mockData, status: 200 };
  }

  return Promise.resolve({ error: "Request failed", status: 404 });
};

module.exports = {
  clickUpGetRequestHandler
};
