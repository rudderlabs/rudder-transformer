const { getMappedEventNameFromConfig } = require('./utils');
describe('getMappedEventNameFromConfig', () => {
  it('should return the mapped event name when it exists in the events mapping configuration', () => {
    const message = { event: 'Order Completed' };
    const destination = {
      Config: { eventsMapping: [{ from: 'Order Completed', to: 'PURCHASE' }] },
    };
    const result = getMappedEventNameFromConfig(message, destination);
    expect(result).toBe('PURCHASE');
  });

  it('should return undefined when the event mapping is not created', () => {
    const message = { event: 'Order Completed' };
    const destination = { Config: {} };
    const result = getMappedEventNameFromConfig(message, destination);
    expect(result).toBeUndefined();
  });
});
