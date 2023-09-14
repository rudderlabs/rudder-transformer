const fs = require("fs");
const path = require("path");
const getData = url => {
    const dataFile = fs.readFileSync(
        path.resolve(__dirname, "./data/intercom/response.json")
    );
    const data = JSON.parse(dataFile);
    const response = data[url];
    return response || {};
};

const intercomPostRequestHandler = (url, payload) => {
    const mockData = getData(url);
    switch (url) {
        case "https://api.intercom.io/contacts/search":
            //resolve with status 201 and response data contains value for contact created
            return { data: mockData, status: 200 };
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

module.exports = { intercomPostRequestHandler };