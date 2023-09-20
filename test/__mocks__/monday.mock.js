const fs = require("fs");
const path = require("path");

const getData = payload => {
    const dataFile = fs.readFileSync(
      path.resolve(__dirname, `./data/monday/response.json`)
    );
    const data = JSON.parse(dataFile);
    const boardId = payload.query.substring(21,30);
    return data[boardId];
};

const mondayPostRequestHandler = payload => {
  const mockData = getData(payload);
  if (mockData) {
    return { data: mockData, status: 200 };
  }
  return new Promise((resolve, reject) => {
    reject({
      response: {
        data: {
          error: "Not found",
          status: 404
        }
      }
    });
  });
};

module.exports = {
  mondayPostRequestHandler
};
