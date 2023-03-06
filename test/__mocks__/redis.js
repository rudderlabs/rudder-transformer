const fs = require("fs");
const path = require("path");
const directoryMap ={
    "shopify_test" : "shopify"
}
const getData = redisKey => {
    const directory = Object.keys(directoryMap).find(key => {
      return redisKey.includes(key);
    });
    if (directory) {
      const dataFile = fs.readFileSync(
        path.resolve(__dirname, `./data/sources/${directory}/response.json`)
      );
      const data = JSON.parse(dataFile);
      response =  data[redisKey];
      return response;
    }
  }
module.exports = {
    createClient( data) {
        return {
            connectionStatus:false,
            __data: {},
            get data() {
                return this.__data;
            },
            set data(data) {
                this.__data = data;
            },
            get(key) {
                const mockData = getData(key);
                if (mockData) {
                    return JSON.stringify(mockData);
                  } else {
                    return "Not Found";
                  }
            },
            set(key, value) {
                this.data[key] = value;
            },
            connect(){
                this.connectionStatus= true
                return new Promise((resolve, reject) => {
                      resolve({ data: "OK", status: 200 });
                  });
            },
            on(){
                return true;
            },
            instanceInfo: data
        }
    }
}
