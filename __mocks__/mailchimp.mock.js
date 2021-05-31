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
    console.log("inside mailchimpget request handler");
  const mockData = getData(url);
  console.log(mockData)
  if (!mockData) {
    //resolve with status 200
    return { data: {}, status: 200 };
  } else {
    return new Promise((resolve, reject) => {
      resolve({ error: "Request failed", status: 403 });
    });
  }
};

module.exports = mailchimpGetRequestHandler;
