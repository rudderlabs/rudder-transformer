const DestinationMetrics = require('../../../util/destinationMetrics');

class FacebookConversionsMetrics extends DestinationMetrics {
  constructor() {
    super('facebook_conversions');
  }
}

module.exports = FacebookConversionsMetrics;
