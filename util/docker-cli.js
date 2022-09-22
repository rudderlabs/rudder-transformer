/* eslint-disable no-unused-vars */

const shell = require("shelljs");

async function buildImage(path, ...args) {
  let command = `docker build ${path}`;

  if (args.length > 0) {
    command += ` ${args.join(" ")}`;
  }

  return new Promise((resolve, reject) => {
    shell.exec(command, (code, _stdout, _stderr) => {
      if (code !== 0) {
        throw new Error(`Error code ${code}.`);
      }

      resolve();
    });
  });
}

async function pushImage(image, ...args) {
  let command = `docker push ${image}`;

  if (args.length > 0) {
    command += ` ${args.join(" ")}`;
  }

  return new Promise((resolve, reject) => {
    shell.exec(command, (code, _stdout, _stderr) => {
      if (code !== 0) {
        throw new Error(`Error code ${code}.`);
      }

      resolve();
    });
  });
}

async function login(username, password) {
  const command = `docker login -u ${username} -p ${password}`;

  return new Promise((resolve, reject) => {
    shell.exec(command, (code, _stdout, _stderr) => {
      if (code !== 0) {
        throw new Error(`Error code ${code}.`);
      }

      resolve();
    });
  });
}

module.exports.buildImage = buildImage;
module.exports.pushImage = pushImage;
