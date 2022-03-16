const fs = require("fs");

const cdkVersion = process.argv[2];
const pData = require("./package.json");

pData.dependencies["rudder-transformer-cdk"] = cdkVersion;
fs.writeFileSync("./package.json", JSON.stringify(pData));
