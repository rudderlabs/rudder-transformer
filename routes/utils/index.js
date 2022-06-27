const fs = require("fs");

const isDirectory = source => {
  return fs.lstatSync(source).isDirectory();
};

const getIntegrations = type =>
  fs.readdirSync(type).filter(destName => isDirectory(`${type}/${destName}`));

module.exports = { isDirectory, getIntegrations };
