const fs = require("fs");
const path = require("path");
const directoryMap = {
    "shopify_test": "shopify"
}
const getData = redisKey => {
    let directory = "";
    Object.keys(directoryMap).forEach(key => {
        if (redisKey.includes(key)) {
            directory = directoryMap[key];
        }
    });
    if (directory) {
        const dataFile = fs.readFileSync(
            path.resolve(__dirname, `./data/sources/${directory}/response.json`)
        );
        const data = JSON.parse(dataFile);
        response = data[redisKey];
        return response;
    }
}

class Redis {
    constructor(data) {
        this.status = "ready",
            this.data = data
    };

    get(key) {
        const mockData = getData(key);
        if (mockData) {
            return JSON.stringify(mockData);
        } else {
            return null;
        }
    }

    set(key, value) {
        this.data[key] = value;
    }

    connect() {
        this.connectionStatus = true
        return new Promise((resolve, reject) => {
            resolve({ data: "OK", status: 200 });
        });
    }

    on() {
        return true;
    }
};

module.exports = Redis;
