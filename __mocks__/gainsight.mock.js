const fs = require("fs");
const path = require("path");
const responseJson = fs.readFileSync(path.resolve(__dirname, "./data/gainsight/response.json"));
const responseData = JSON.parse(responseJson);

// mock companies that exist in db
const companyNamesList = ["Seinfeld Corps", "Mr.Robot", "The Office"];

/**
 * Single function to return mock data
 * for all axios calls.
 */
const gainsightRequestHandler = (url, payload) => {
  if(Object.keys(responseData).includes(url)) {
    // for company lookup
    if(payload.select && payload.where) {
      const name = payload.where.conditions[0].value[0];
      if(companyNamesList.includes(name)) {
        const resp = responseData[url];
        resp.data.records = [{ "Name": name }];
        return { data: resp, status: 200 };
      }
      return { data: responseData[url], status: 200 };  
    }
    return { data: responseData[url], status: 200 };
  }
  return { error: "request failed: url not found in mock" };
};

module.exports = gainsightRequestHandler
