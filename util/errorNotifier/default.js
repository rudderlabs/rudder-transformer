const logger = require("../../logger");

function init() {}

function notify(err, context, metadata) {
  logger.error(err, context, metadata);
}

module.exports = {
  init,
  notify
};
