const path = require("path");
const fs = require("fs");

const mapping = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./mapping.json"), "utf-8")
);

module.exports = { mapping };
