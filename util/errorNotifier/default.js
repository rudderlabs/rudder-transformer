const logger = require("../../logger");

function init() {}

function notify(err) {
  logger.error(err);
}

module.exports = {
  init,
  notify
};
