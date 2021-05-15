const fs = require("fs");
const path = require("path");
const responseJson = fs.readFileSync(path.resolve(__dirname, "./data/gainsight/response.json"));
const responseData = JSON.parse(responseJson);

const gainsightRequestHandler = (url, payload) => {
  if(Object.keys(responseData).includes(url)) {
    return { data: responseData[url], status: 200 };
  }
  return { error: "request failed: url not found in mock" };
};

module.exports = gainsightRequestHandler
