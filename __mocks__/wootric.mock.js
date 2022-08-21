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
  switch (url) {
    case "https://api.wootric.com/v1/end_users/dummyId1?lookup_by_external_id=true":
    case "https://api.wootric.com/v1/end_users/exclueFunTestId?lookup_by_external_id=true":
    case "https://api.wootric.com/v1/end_users/testuser1@gmail.com?lookup_by_email=true":
    case "https://api.wootric.com/v1/end_users/dummyuser1@gmail.com?lookup_by_email=true":
    case "https://api.wootric.com/v1/end_users/excludeUser@gmail.com?lookup_by_email=true":
    case "https://api.wootric.com/v1/end_users/phone_number/+19133456781":
    case "https://api.wootric.com/v1/end_users/phone_number/+17777777778":
      return { data: mockData, status: 200 };
    default:
      return new Promise((resolve, reject) => {
        resolve({ error: "Request failed", status: 404 });
      });
  }
};

const wootricPostRequestHandler = (url, payload) => {
  const mockData = getData(url);
  switch (url) {
    case "https://api.wootric.com/oauth/token?account_token=NPS-1234567":
      //generate access token
      return { data: mockData, status: 200 };
    default:
      return new Promise((resolve, reject) => {
        if (mockData) {
          resolve({ data: mockData, status: 200 });
        } else {
          reject({
            response: {
              data: {
                error: "Request failed",
                status: 404
              }
            }
          });
        }
      });
  }
};

module.exports = {
  wootricGetRequestHandler,
  wootricPostRequestHandler
};
