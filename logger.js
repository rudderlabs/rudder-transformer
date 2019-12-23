const levelDebug = 0; // Most verbose logging level
const levelInfo = 1; // Logs about state of the application
const levelError = 2; // Logs about errors which dont immediately halt the application

let logLevel = process.env.LOG_LEVEL
  ? parseInt(process.env.LOG_LEVEL, 10)
  : levelInfo;

const debug = (msg, ...optionalParams) => {
  if (levelDebug >= logLevel) {
    console.debug(msg, optionalParams);
  }
};

const info = (msg, ...optionalParams) => {
  if (levelInfo >= logLevel) {
    console.info(msg, optionalParams);
  }
};

const error = (msg, ...optionalParams) => {
  if (levelError >= logLevel) {
    console.error(msg, optionalParams);
  }
};

module.exports = {
  debug,
  info,
  error
};
