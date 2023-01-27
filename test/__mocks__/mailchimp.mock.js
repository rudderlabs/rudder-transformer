const fs = require("fs");
const path = require("path");

const urlDirectoryMap = {
  "api.mailchimp.com": "mailchimp"
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

const mailchimpGetRequestHandler = url => {
  const mockData = getData(url);
  if (mockData) {
    if (
      url ===
      "https://us20.api.mailchimp.com/3.0/lists/df42a82d07/members/48cd6232dc124497369f59c33d3eb4ab"
    ) {
      return { data: mockData, status: 200 };
    } else if (url === "https://us20.api.mailchimp.com/3.0/lists/ff21810eec") {
      return { data: mockData, status: 200 };
    } else if (url === "https://us20.api.mailchimp.com/3.0/lists/1232yyqw22") {
      return { data: mockData, status: 200 };
    } else {
      return new Promise((resolve, reject) => {
        reject({ error: "Request failed", status: mockData.status });
      });
    }
  } else {
    return new Promise((resolve, reject) => {
      reject({ error: "Request failed", status: 404 });
    });
  }
};

module.exports = mailchimpGetRequestHandler;
