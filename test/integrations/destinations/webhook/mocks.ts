const webhookUtils = require('../../../../src/v0/destinations/webhook/utils');

export const defaultMockFns = (_) => {
  jest.spyOn(webhookUtils, 'isFeatureEnabled').mockResolvedValue(true);
};
