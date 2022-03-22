// This file is solely used to update the version for rudder-transformer-cdk
const fs = require("fs");
const pkg = require("./package.json");

const cdkVersion = process.argv[2];
pkg.dependencies["rudder-transformer-cdk"] = `^${cdkVersion}`;

// Write with 2-spaced alignment
fs.writeFileSync("./package.json", JSON.stringify(pkg, null, 2));
