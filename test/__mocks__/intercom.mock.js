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
    const requestPayload = JSON.parse(payload);
    const mockData = getData(url);
    if (requestPayload.query?.value[0]?.value === 'test@intercom.com') {
        return { data: { data: [], total_count: 0 }, status: 200 };
    } else if (requestPayload.query?.value[0]?.value === 'test@rudderlabs.com') {
        return { data: mockData, status: 200 };
    } else if (requestPayload?.company_id === 'rudderstack@1') {
        return { data: mockData, status: 200 };
    } else {
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