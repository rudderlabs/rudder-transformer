const { processNonEComGenericEvent } = require('./transform');

describe('transform', () => {
  describe('processNonEComGenericEvent function tests', () => {
    // Function returns an object with ea, ec, and ni properties
    it('should return an object with ea, ec, and ni properties', () => {
      const message = {
        event: 'test_event',
        properties: {
          category: 'test_category',
          nonInteraction: false,
        },
      };

      const destination = {
        Config: {
          nonInteraction: true,
        },
      };

      const result = processNonEComGenericEvent(message, destination);

      expect(result).toHaveProperty('ea', 'test_event');
      expect(result).toHaveProperty('ec', 'test_category');
      expect(result).toHaveProperty('ni', 0);
    });
    // Handle when message.properties is undefined or null
    it('should handle when message.properties is null', () => {
      const message = {
        event: 'test_event',
        properties: null,
      };

      const destination = {
        Config: {
          nonInteraction: false,
        },
      };

      const result = processNonEComGenericEvent(message, destination);

      expect(result).toHaveProperty('ea', 'test_event');
      expect(result).toHaveProperty('ec', 'All');
      expect(result).toHaveProperty('ni', 0);
    });
    // Handle when message.event is undefined or null
    it('should return an object with ea as undefined and default ec when message.event is undefined', () => {
      const message = {
        properties: {
          category: 'test_category',
          nonInteraction: false,
        },
      };

      const destination = {
        Config: {
          nonInteraction: true,
        },
      };

      const result = processNonEComGenericEvent(message, destination);

      expect(result).toHaveProperty('ea', undefined);
      expect(result).toHaveProperty('ec', 'test_category');
      expect(result).toHaveProperty('ni', 0);
    });
  });
});
