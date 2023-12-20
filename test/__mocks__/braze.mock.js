const fs = require("fs");
const path = require("path");
const getData = url => {
    const dataFile = fs.readFileSync(
      path.resolve(__dirname, "./data/braze/response.json")
    );
    const data = JSON.parse(dataFile);
    const response =  data[url];
    return response || {};  
};

const brazePostRequestHandler = (url, payload) => {
  const mockData = getData(url);
  switch (url) {
    case "https://rest.iad-03.braze.com":
      //resolve with status 201 and response data contains value for contact created
      return { data: mockData, status: 201 };
    default:
      return new Promise((resolve, reject) => {
        if (mockData) {
          resolve({ data: mockData, status: 200 });
        } else {
          resolve({ error: "Request failed" });
        }
      });
  }
};

module.exports = { brazePostRequestHandler };