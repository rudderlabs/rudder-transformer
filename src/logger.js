/* istanbul ignore file */

const levelDebug = 0; // Most verbose logging level
const levelInfo = 1; // Logs about state of the application
const levelWarn = 2; // Logs about warnings which dont immediately halt the application
const levelError = 3; // Logs about errors which dont immediately halt the application
// any value greater than levelError will work as levelNone

let logLevel = process.env.LOG_LEVEL
  ? parseInt(process.env.LOG_LEVEL, 10)
  : levelInfo;

const setLogLevel = (level) => {
  logLevel = level || logLevel;
}

const debug = (...args) => {
  if (levelDebug >= logLevel) {
    console.debug(...args);
  }
};

const info = (...args) => {
  if (levelInfo >= logLevel) {
    console.info(...args);
  }
};

const warn = (...args) => {
  if (levelWarn >= logLevel) {
    console.warn(...args);
  }
};

const error = (...args) => {
  if (levelError >= logLevel) {
    console.error(...args);
  }
};

module.exports = {
  debug,
  info,
  warn,
  error,
  setLogLevel,
  levelDebug,
  levelInfo,
  levelWarn,
  levelError
};
