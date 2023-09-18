const fs = require("fs");
const path = require("path");
const directoryMap = {
    "shopify_test": "shopify",
    "redis_test": "redis",
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
        const response = data[redisKey];
        return response;
    }
}
let connectionRequestCount = 0;
const getCallKeysForError = ["error", "shopifyGetAnonymousId", "shopifyGetSessionId", "shopify_test_get_items_fail"];
const setCallKeysForError = ["error", "shopify_test_set_map_fail", "shopify_test_set_redis_error"];
class Redis {
    constructor(data) {
        this.host = data.host,
            this.port = data.port,
            this.password = data.password,
            this.username = data.username,
            this.enableReadyCheck = data.enableReadyCheck,
            this.retryStrategy = data.retryStrategy;
        this.status = "connecting";
    };

    get(key) {
        if (getCallKeysForError.includes(key)) {
            throw new Error("Connection is Closed");
        }
        const mockData = getData(key);
        if (mockData) {
            return mockData;
        } else {
            return null;
        }
    }

    set(key, value) {
        if (setCallKeysForError.includes(key)) {
            throw new Error("Connection is Closed");
        }
        return {
            expire: (key) => {
                return {
                    exec: () => { }
                }
            }
        }
    }

    hgetall(key) {
        const obj = this.get(key);
        return obj;
    }
    multi() {
        return { hmset: this.hmset, set: this.set }
    };
    hmset(key, value) {
        if (setCallKeysForError.includes(key)) {
            throw new Error("Connection is Closed");
        }
        return {
            expire: (key, expiryTime) => {
                return {
                    exec: () => { }
                }
            }
        }
    }

    changeEventToReadyStatus() {
        setTimeout(() => {
            this.status = "ready"
        },
            100);
    }

    connect() {
        if (connectionRequestCount > 0) {
            this.status = "ready"
            return new Promise((resolve, _) => {
                resolve({ data: "OK", status: 200 });
            });
        } else {
            connectionRequestCount += 1;
            this.changeEventToReadyStatus();
            throw new Error("Connection is Closed");
        }

    }
    on() { jest.fn() }
    end(times) {
        this.retryStrategy(times);
        this.status = "end"
    }
    disconnect() {
        this.status = "closed";
    }
};

module.exports = Redis;
