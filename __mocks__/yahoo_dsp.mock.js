const fs = require("fs");
const path = require("path");

const urlDirectoryMap = {
  "id.b2b.yahooinc": "yahoo_dsp"
};

let id = 0;

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

const yahooDspPostRequestHandler = (url, payload) => {
  const mockData = getData(url);
      //resolve with status 200 and response data contains value for contact created
      return { data: mockData.data, status: 200 };
};
module.exports = yahooDspPostRequestHandler;
