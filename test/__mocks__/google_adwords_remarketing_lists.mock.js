const fs = require("fs");
const path = require("path");
const getData = url => {
    const dataFile = fs.readFileSync(
      path.resolve(__dirname, "./data/google_adwords_remarketing_lists/proxy_response.json")
    );
    const data = JSON.parse(dataFile);
    const response =  data[url];
    return response || {};  
};

const garlPostRequestHandler = (url) => {
  const mockResponse = getData(url);
  switch (url) {
    case "https://googleads.googleapis.com/v13/customers/1234567890/googleAds:searchStream":
      //resolve with status 201 and response data contains value for contact created
      return mockResponse;
    case "https://googleads.googleapis.com/v13/customers/1234567891/googleAds:searchStream":
      return mockResponse;
    case "https://googleads.googleapis.com/v13/customers/1234567891:uploadConversionAdjustments":
        return mockResponse;
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

module.exports = garlPostRequestHandler;
  