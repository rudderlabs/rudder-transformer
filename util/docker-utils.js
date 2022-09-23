/* eslint-disable no-unused-vars */

const shell = require("shelljs");

function cmdExec(command) {
  return new Promise((resolve, reject) => {
    shell.exec(command, (code, _stdout, _stderr) => {
      if (code !== 0) {
        reject(Error(`Error code ${code}.`));
      }

      resolve();
    });
  });
}

function buildImage(path, ...args) {
  let command = `docker build ${path}`;

  if (args.length > 0) {
    command += ` ${args.join(" ")}`;
  }

  return cmdExec(command);
}

function pushImage(image, ...args) {
  let command = `docker push ${image}`;

  if (args.length > 0) {
    command += ` ${args.join(" ")}`;
  }

  return cmdExec(command);
}

function pullImage(image, ...args) {
  let command = `docker pull ${image}`;

  if (args.length > 0) {
    command += ` ${args.join(" ")}`;
  }

  return cmdExec(command);
}

function login(username, password) {
  const command = `docker login -u ${username} -p ${password}`;
  return cmdExec(command);
}

module.exports.buildImage = buildImage;
module.exports.pullImage = pullImage;
module.exports.pushImage = pushImage;
module.exports.login = login;
