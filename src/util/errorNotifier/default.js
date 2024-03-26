const logger = require('../../logger');

function init() {}

function notify(err, context, metadata) {
  logger.errorw(err, context, metadata);
}

module.exports = {
  init,
  notify,
};
