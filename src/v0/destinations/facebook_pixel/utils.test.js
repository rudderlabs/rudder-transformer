const { InstrumentationError } = require('@rudderstack/integrations-lib');
const {
  getActionSource,
  formatRevenue,
  getCategoryFromEvent,
  verifyEventDuration,
} = require('./utils');
const { CONFIG_CATEGORIES, OTHER_STANDARD_EVENTS } = require('./config');

Date.now = jest.fn(() => new Date('2022-01-20T00:00:00Z'));
describe('Test Facebook Pixel Utils', () => {
  describe('getActionSource', () => {
    // Returns 'other' if payload.action_source is not defined and channel is neither 'web' nor 'mobile'
    it('should return "other" when payload.action_source is not defined and channel is neither "web" nor "mobile"', () => {
      const payload = {};
      const channel = 'email';
      const result = getActionSource(payload, channel);
      expect(result).toBe('other');
    });

    // Returns payload.action_source if it is defined and is a valid value from ACTION_SOURCES_VALUES
    it('should return payload.action_source when it is defined and is a valid value from ACTION_SOURCES_VALUES', () => {
      const payload = { action_source: 'website' };
      const channel = 'email';
      const result = getActionSource(payload, channel);
      expect(result).toBe('website');
    });

    // Returns 'website' if channel is 'web' and payload.action_source is not defined
    it('should return "website" when channel is "web" and payload.action_source is not defined', () => {
      const payload = {};
      const channel = 'web';
      const result = getActionSource(payload, channel);
      expect(result).toBe('website');
    });

    // Throws an InstrumentationError if payload.action_source is defined but not a valid value from ACTION_SOURCES_VALUES
    it('should throw an InstrumentationError when payload.action_source is defined but not a valid value from ACTION_SOURCES_VALUES', () => {
      const payload = { action_source: 'invalid' };
      const channel = 'email';
      expect(() => {
        getActionSource(payload, channel);
      }).toThrow(InstrumentationError);
    });
  });

  describe('formatRevenue', () => {
    // Returns a number with two decimal places when passed a valid revenue value.
    it('should return a number with two decimal places when passed a valid revenue value', () => {
      const revenue = '100.50';
      const formattedRevenue = formatRevenue(revenue);
      expect(formattedRevenue).toBe(100.5);
    });

    // Returns 0 when passed a null revenue value.
    it('should return 0 when passed a null revenue value', () => {
      const revenue = null;
      const formattedRevenue = formatRevenue(revenue);
      expect(formattedRevenue).toBe(0);
    });

    // Returns 0 when passed an undefined revenue value.
    it('should return 0 when passed an undefined revenue value', () => {
      const revenue = undefined;
      const formattedRevenue = formatRevenue(revenue);
      expect(formattedRevenue).toBe(0);
    });

    // Throws an InstrumentationError when passed a non-numeric string revenue value.
    it('should throw an InstrumentationError when passed a non-numeric string revenue value', () => {
      const revenue = 'abc';
      expect(() => {
        formatRevenue(revenue);
      }).toThrow(InstrumentationError);
    });

    // Returns a number with two decimal places when passed a numeric string revenue value with more than two decimal places.
    it('should return a number with two decimal places when passed a numeric string revenue value with more than two decimal places', () => {
      const revenue = '100.555';
      const formattedRevenue = formatRevenue(revenue);
      expect(formattedRevenue).toBe(100.56);
    });

    // Returns a number with two decimal places when passed a numeric value with more than two decimal places.
    it('should return a number with two decimal places when passed a numeric value with more than two decimal places', () => {
      const revenue = 100.555;
      const formattedRevenue = formatRevenue(revenue);
      expect(formattedRevenue).toBe(100.56);
    });
  });

  describe('getCategoryFromEvent', () => {
    // The function correctly maps the eventName to its corresponding category.
    it('should correctly map the eventName to its corresponding category', () => {
      const eventName = CONFIG_CATEGORIES.PRODUCT_LIST_VIEWED.type;
      const result = getCategoryFromEvent(eventName);
      expect(result).toEqual(CONFIG_CATEGORIES.PRODUCT_LIST_VIEWED);
    });

    // The function returns the correct category for a given eventName.
    it('should return the correct category for a given eventName', () => {
      const eventName = CONFIG_CATEGORIES.PRODUCT_VIEWED.type;
      const result = getCategoryFromEvent(eventName);
      expect(result).toEqual(CONFIG_CATEGORIES.PRODUCT_VIEWED);
    });

    // The function returns the default category if the eventName is not recognized.
    it('should return the default category if the eventName is not recognized', () => {
      const eventName = 'unknownEvent';
      const result = getCategoryFromEvent(eventName);
      expect(result).toEqual(CONFIG_CATEGORIES.SIMPLE_TRACK);
    });

    // The function handles null or undefined eventName inputs.
    it('should handle null or undefined eventName inputs', () => {
      const eventName = null;
      const result = getCategoryFromEvent(eventName);
      expect(result).toEqual(CONFIG_CATEGORIES.SIMPLE_TRACK);
    });

    // The function handles empty string eventName inputs.
    it('should handle empty string eventName inputs', () => {
      const eventName = '';
      const result = getCategoryFromEvent(eventName);
      expect(result).toEqual(CONFIG_CATEGORIES.SIMPLE_TRACK);
    });

    // The function handles eventName inputs that are not strings.
    it('should handle eventName inputs that are not strings', () => {
      const eventName = 123;
      const result = getCategoryFromEvent(eventName);
      expect(result).toEqual(CONFIG_CATEGORIES.SIMPLE_TRACK);
    });

    // The function handles multiple eventNames that map to the same category.
    it('should correctly map multiple eventNames to the same category', () => {
      const eventName1 = CONFIG_CATEGORIES.PRODUCT_LIST_VIEWED.type;
      const eventName2 = CONFIG_CATEGORIES.PRODUCT_LIST_VIEWED.eventName;
      const result1 = getCategoryFromEvent(eventName1);
      const result2 = getCategoryFromEvent(eventName2);
      expect(result1).toEqual(CONFIG_CATEGORIES.PRODUCT_LIST_VIEWED);
      expect(result2).toEqual(CONFIG_CATEGORIES.PRODUCT_LIST_VIEWED);
    });

    // The function handles eventNames that are included in the OTHER_STANDARD_EVENTS list.
    it('should correctly handle eventNames included in the OTHER_STANDARD_EVENTS list', () => {
      const eventName = OTHER_STANDARD_EVENTS[0];
      const result = getCategoryFromEvent(eventName);
      expect(result).toEqual(CONFIG_CATEGORIES.OTHER_STANDARD);
      expect(result.eventName).toEqual(eventName);
    });

    // The function handles eventNames that are not recognized and not in the OTHER_STANDARD_EVENTS list.
    it('should correctly handle unrecognized eventNames', () => {
      const eventName = 'unrecognizedEvent';
      const result = getCategoryFromEvent(eventName);
      expect(result).toEqual(CONFIG_CATEGORIES.SIMPLE_TRACK);
    });
  });

  describe('verifyEventDuration', () => {
    it('should not throw an InstrumentationError when event duration is less than 8 days after the event occurred', () => {
      const message = {
        traits: {
          action_source: 'some_action_source',
        },
        context: {
          traits: {
            action_source: 'some_action_source',
          },
        },
        properties: {
          action_source: 'some_action_source',
        },
      };
      const destination = {
        ID: 'some_destination_id',
      };
      const timeStamp = '2022-01-20T00:00:00Z';
      expect(() => {
        verifyEventDuration(message, destination, timeStamp);
      }).not.toThrow(InstrumentationError);
    });
    it('should throw an InstrumentationError when event duration is exactly 8 days after the event occurred', () => {
      const message = {
        traits: {
          action_source: 'some_action_source',
        },
        context: {
          traits: {
            action_source: 'some_action_source',
          },
        },
        properties: {
          action_source: 'some_action_source',
        },
      };
      const destination = {
        ID: 'some_destination_id',
      };
      const timeStamp = '2022-01-12T00:00:00Z';

      expect(() => {
        verifyEventDuration(message, destination, timeStamp);
      }).toThrow(InstrumentationError);
    });
    it('should not throw an InstrumentationError when event duration is greater than 8 days after the event occurred and action_source is physical_store', () => {
      const message = {
        traits: {
          action_source: 'physical_store',
        },
        context: {
          traits: {
            action_source: 'some_action_source',
          },
        },
        properties: {
          action_source: 'some_action_source',
        },
      };
      const destination = {
        ID: 'some_destination_id',
      };
      const timeStamp = '2022-01-12T00:00:00Z';

      expect(() => {
        verifyEventDuration(message, destination, timeStamp);
      }).not.toThrow(InstrumentationError);
    });
  });
});
