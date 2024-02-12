const { AbortedError, InstrumentationError } = require('@rudderstack/integrations-lib');
const {
  getSignatureHeader,
  getRevenue,
  getDeviceAdvertisingId,
  getDestinationExternalIDObject,
  getAdvertisingId,
  prepareCustomProperties,
  populateEventName,
  getDataProcessingOptions,
  getPrivacySetting,
  enrichTrackPayload,
} = require('./utils');

describe('getSignatureHeader', () => {
  it('should calculate the signature header for a valid request and secret key', () => {
    const request = { data: 'example' };
    const secretKey = 'secret';
    const expected = 'rvxETQ7kIU5Cko3GddD2AeFpz8E=';

    const result = getSignatureHeader(request, secretKey);

    expect(result).toBe(expected);
  });

  it('should handle requests with different data types and secret key', () => {
    const request1 = { data: 'example' };
    const secretKey1 = 'secret';
    const expected1 = 'rvxETQ7kIU5Cko3GddD2AeFpz8E=';

    const result1 = getSignatureHeader(request1, secretKey1);

    expect(result1).toBe(expected1);

    const request2 = { data: 123 };
    const secretKey2 = 'secret';
    const expected2 = 'V5RSVwxqHRLkZftZ0+IrZAp4L4s=';

    const result2 = getSignatureHeader(request2, secretKey2);

    expect(result2).toBe(expected2);

    const request3 = { data: true };
    const secretKey3 = 'secret';
    const expected3 = 'oZ28NtyMYDGxRV0E+Tgvz7B1jds=';

    const result3 = getSignatureHeader(request3, secretKey3);

    expect(result3).toBe(expected3);
  });

  it('should throw an AbortedError when secret key is missing', () => {
    const request = { data: 'example' };
    const secretKey = null;

    expect(() => {
      getSignatureHeader(request, secretKey);
    }).toThrow(AbortedError);
  });
});

describe('getRevenue', () => {
  it('should return revenue value from message properties for custom events', () => {
    const message = {
      event: 'customEvent',
      properties: {
        value: 100,
      },
    };
    const result = getRevenue(message);
    expect(result).toBe(100);
  });

  it('should calculate revenue based on price and quantity from message properties if ecomm event is supported for price calculation', () => {
    const message = {
      event: 'Product Added',
      properties: {
        price: 10,
        quantity: 5,
      },
    };
    const result = getRevenue(message);
    expect(result).toBe(50);
  });

  it('should return revenue value from message properties if ecomm event is supported for revenue calculation', () => {
    const message = {
      event: 'Order Completed',
      properties: {
        revenue: 200,
      },
    };
    const result = getRevenue(message);
    expect(result).toBe(200);
  });

  it('should return default revenue value from properties.value for ecomm events', () => {
    let message = {
      event: 'Product Added',
      properties: {
        price: '',
        value: 200,
      },
    };
    let result = getRevenue(message);
    expect(result).toBe(200);

    message = {
      event: 'Order Completed',
      properties: {
        value: 200,
      },
    };
    result = getRevenue(message);
    expect(result).toBe(200);
  });

  it('should throw an Instrumentation error if revenue is missing for `Order Completed` event', () => {
    const message = {
      event: 'Order Completed',
      properties: {},
    };
    expect(() => {
      getRevenue(message);
    }).toThrow(InstrumentationError);
  });
});

describe('getDeviceAdvertisingId', () => {
  it('should return an object with deviceId and type properties when context.device.advertisingId and context.os.name are present', () => {
    let message = {
      context: {
        device: {
          advertisingId: '123456789',
        },
        os: {
          name: 'android',
        },
      },
    };
    let result = getDeviceAdvertisingId(message);
    expect(result).toEqual({ deviceId: '123456789', type: 'AAID' });

    message = {
      context: {
        device: {
          advertisingId: '123456789',
        },
        os: {
          name: 'ios',
        },
      },
    };
    result = getDeviceAdvertisingId(message);
    expect(result).toEqual({ deviceId: '123456789', type: 'IDFA' });

    message = {
      context: {
        device: {
          advertisingId: '123456789',
        },
        os: {
          name: 'windows',
        },
      },
    };
    result = getDeviceAdvertisingId(message);
    expect(result).toEqual({ deviceId: '123456789', type: 'NAID' });
  });

  it('should return an object with undefined type property when osName is not "android", "windows", or an Apple OS', () => {
    const message = {
      context: {
        device: {
          advertisingId: '123456789',
        },
        os: {
          name: 'linux',
        },
      },
    };
    const result = getDeviceAdvertisingId(message);
    expect(result).toEqual({ deviceId: '123456789', type: undefined });
  });

  it('should return an object with undefined deviceId and type properties when context is undefined', () => {
    let message = {};
    let result = getDeviceAdvertisingId(message);
    expect(result).toEqual({ deviceId: undefined, type: undefined });

    message = {
      context: {},
    };
    result = getDeviceAdvertisingId(message);
    expect(result).toEqual({ deviceId: undefined, type: undefined });

    message = {
      context: {
        device: {},
      },
    };
    result = getDeviceAdvertisingId(message);
    expect(result).toEqual({ deviceId: undefined, type: undefined });
  });
});

describe('getDestinationExternalIDObject', () => {
  it('should return the external ID object when it exists in the message context', () => {
    const message = {
      context: {
        externalId: [
          { id: '123', type: 'daid' },
          { id: '456', type: 'type123' },
        ],
      },
    };
    const result = getDestinationExternalIDObject(message);
    expect(result).toEqual({ id: '123', type: 'daid' });
  });

  it('should return undefined when no external ID object exists in the message context', () => {
    let message = {
      context: {
        externalId: [],
      },
    };
    let result = getDestinationExternalIDObject(message);
    expect(result).toBeUndefined();

    message = {
      context: {},
    };
    result = getDestinationExternalIDObject(message);
    expect(result).toBeUndefined();
  });

  it('should return the first matching external ID object in the array', () => {
    const message = {
      context: {
        externalId: [
          { id: '', type: 'daid' },
          { id: '456', type: 'tdid' },
          { id: '789', type: 'UID2' },
        ],
      },
    };
    const result = getDestinationExternalIDObject(message);
    expect(result).toEqual({ id: '456', type: 'tdid' });
  });
});

describe('getAdvertisingId', () => {
  it('should return an object with the ID and type when the message contains a valid device advertising ID and OS type', () => {
    const message = {
      context: {
        device: {
          advertisingId: '1234567890',
        },
        os: {
          name: 'android',
        },
      },
    };

    const result = getAdvertisingId(message);
    expect(result).toEqual({ id: '1234567890', type: 'AAID' });
  });

  it('should return an object with the ID and type when the message contains a valid external ID object with a supported type', () => {
    const message = {
      context: {
        externalId: [
          {
            type: 'IDFA',
            id: 'abcdefg',
          },
        ],
      },
    };

    const result = getAdvertisingId(message);
    expect(result).toEqual({ id: 'abcdefg', type: 'IDFA' });
  });

  it('should return an object with undefined ID and type when the message contains a valid external ID object with an unsupported type', () => {
    let message = {
      context: {
        externalId: [
          {
            type: 'unsupported',
            id: '1234567890',
          },
        ],
      },
    };

    let result = getAdvertisingId(message);
    expect(result).toEqual({ id: null, type: null });

    message = {
      context: {
        device: {
          advertisingId: '1234567890',
        },
      },
    };

    result = getAdvertisingId(message);
    expect(result).toEqual({ id: null, type: null });
  });

  it('should return an object with undefined ID and type when the message contains an external ID object with a supported type but no ID or missing externalId', () => {
    let message = {
      context: {
        externalId: [
          {
            type: 'IDFA',
          },
        ],
      },
    };
    let result = getAdvertisingId(message);
    expect(result).toEqual({ id: null, type: null });

    message = {
      context: {},
    };
    result = getAdvertisingId(message);
    expect(result).toEqual({ id: null, type: null });
  });
});

describe('prepareCustomProperties', () => {
  it('should return an empty object when customProperties is an empty array', () => {
    const message = {};
    let destination = { Config: { customProperties: [] } };
    let result = prepareCustomProperties(message, destination);
    expect(result).toEqual({});

    destination = { Config: { customProperties: [{ rudderProperty: '', tradeDeskProperty: '' }] } };
    result = prepareCustomProperties(message, destination);
    expect(result).toEqual({});

    destination = { Config: { customProperties: undefined } };
    result = prepareCustomProperties(message, destination);
    expect(result).toEqual({});
  });

  it('should return an object with `tradeDeskProperty` as key and `rudderProperty` value as value when `rudderProperty` exists in message', () => {
    const message = {
      rudderProperty1: 'value1',
      rudderProperty2: 'value2',
    };
    const destination = {
      Config: {
        customProperties: [
          {
            rudderProperty: 'rudderProperty1',
            tradeDeskProperty: 'tradeDeskProperty1',
          },
          {
            rudderProperty: 'rudderProperty2',
            tradeDeskProperty: 'tradeDeskProperty2',
          },
          {
            rudderProperty: 'rudderProperty3',
            tradeDeskProperty: 'tradeDeskProperty3',
          },
        ],
      },
    };
    const result = prepareCustomProperties(message, destination);
    expect(result).toEqual({
      tradeDeskProperty1: 'value1',
      tradeDeskProperty2: 'value2',
    });
  });
});

describe('populateEventName', () => {
  it('should return the eventName if it exists in the eventsMapping of destination.Config', () => {
    const message = { event: 'someEvent' };
    const destination = { Config: { eventsMapping: [{ from: 'someEvent', to: 'mappedEvent' }] } };
    const result = populateEventName(message, destination);
    expect(result).toBe('mappedEvent');
  });

  it('should return the eventName if it exists in the ECOMM_EVENT_MAP', () => {
    const message = { event: 'product added' };
    let destination = { Config: { eventsMapping: [{ from: 'someEvent', to: 'mappedEvent' }] } };
    let result = populateEventName(message, destination);
    expect(result).toBe('addtocart');

    destination = { Config: { eventsMapping: [] } };
    result = populateEventName(message, destination);
    expect(result).toBe('addtocart');
  });

  it('should return undefined if eventsMapping is an empty array', () => {
    const message = { event: 'someEvent' };
    const destination = { Config: { eventsMapping: [] } };
    const result = populateEventName(message, destination);
    expect(result).toBe('someEvent');
  });
});

describe('getDataProcessingOptions', () => {
  it('should return an object with policies and region when provided a integrationObj in message', () => {
    const message = {
      integrations: {
        All: true,
        THE_TRADE_DESK: {
          policies: ['LDU'],
          region: 'US-CO',
        },
      },
    };
    const expected = {
      policies: ['LDU'],
      region: 'US-CO',
    };
    const result = getDataProcessingOptions(message);
    expect(result).toEqual(expected);
  });

  it('should throw an InstrumentationError if the region is not a US state', () => {
    const message = {
      integrations: {
        All: true,
        THE_TRADE_DESK: {
          policies: ['LDU'],
          region: 'EU-abc',
        },
      },
    };
    expect(() => {
      getDataProcessingOptions(message);
    }).toThrow(InstrumentationError);
  });

  it('should throw an InstrumentationError if multiple policies are provided', () => {
    const message = {
      integrations: {
        All: true,
        THE_TRADE_DESK: {
          policies: ['LDU', 'Policy2'],
          region: 'US-CO',
        },
      },
    };

    expect(() => {
      getDataProcessingOptions(message);
    }).toThrow(InstrumentationError);
  });

  it('should throw an InstrumentationError if a policy other than `LDU` is provided', () => {
    const message = {
      integrations: {
        All: true,
        THE_TRADE_DESK: {
          policies: ['Policy1'],
          region: 'US-CO',
        },
      },
    };

    expect(() => {
      getDataProcessingOptions(message);
    }).toThrow(InstrumentationError);
  });

  it('should return an object with default policy `LDU` when policies are not provided', () => {
    const message = {
      integrations: {
        All: true,
        THE_TRADE_DESK: {
          policies: [],
          region: 'US-CO',
        },
      },
    };

    const expected = {
      policies: ['LDU'],
      region: 'US-CO',
    };

    expect(getDataProcessingOptions(message)).toEqual(expected);
  });

  it('should handle empty cases', () => {
    let message = {
      integrations: {
        All: true,
        THE_TRADE_DESK: {},
      },
    };

    expect(getDataProcessingOptions(message)).toBeUndefined();

    message = {
      integrations: {
        All: true,
      },
    };

    expect(getDataProcessingOptions(message)).toBeUndefined();

    message = {
      integrations: {
        All: true,
        THE_TRADE_DESK: { region: 'US-CO' },
      },
    };

    expect(getDataProcessingOptions(message)).toEqual({ policies: ['LDU'], region: 'US-CO' });
  });
});

describe('getPrivacySetting', () => {
  it('should return the privacy settings object when it exists in the integration object', () => {
    const message = {
      integrations: {
        All: true,
        THE_TRADE_DESK: {
          privacy_settings: [
            {
              privacy_type: 'GDPR',
              is_applicable: 1,
              consent_string: 'ok',
            },
          ],
        },
      },
    };
    const expected = [
      {
        privacy_type: 'GDPR',
        is_applicable: 1,
        consent_string: 'ok',
      },
    ];
    const result = getPrivacySetting(message);
    expect(result).toEqual(expected);
  });

  it('should return null when the privacy settings object does not exist in the integration object', () => {
    let message = { integrations: {} };
    expect(getPrivacySetting(message)).toBeUndefined();

    message = { integrations: { THE_TRADE_DESK: {} } };
    expect(getPrivacySetting(message)).toBeUndefined();

    message = { integrations: { THE_TRADE_DESK: { privacy_settings: null } } };
    expect(getPrivacySetting(message)).toBeNull();
  });
});

describe('enrichTrackPayload', () => {
  it('should correctly enrich the payload with custom fields for ecomm events where product array is  not supported', () => {
    const message = {
      event: 'Product Added',
      properties: {
        product_id: 'prd123',
        sku: 'sku123',
        brand: 'brand123',
        property1: 'value1',
        property2: 'value2',
      },
    };
    const payload = {
      items: [
        {
          item_code: 'prd123',
        },
      ],
      property1: 'value1',
      property2: 'value2',
    };
    const expectedPayload = {
      items: [
        {
          item_code: 'prd123',
        },
      ],
      brand: 'brand123',
      property1: 'value1',
      property2: 'value2',
    };

    const result = enrichTrackPayload(message, payload);
    expect(result).toEqual(expectedPayload);
  });

  it('should correctly enrich the payload with custom fields when the for ecomm events with products array support', () => {
    const message = {
      event: 'order completed',
      properties: {
        order_id: 'ord123',
        total: 52.0,
        subtotal: 45.0,
        revenue: 50.0,
        products: [{ product_id: 'prd123', sku: 'sku123', brand: 'brand123' }],
        property1: 'value1',
        property2: 'value2',
      },
    };
    const payload = {
      order_id: 'ord123',
      value: 50.0,
      items: [{ item_code: 'prd123', brand: 'brand123' }],
      property1: 'value1',
      property2: 'value2',
    };
    const expectedPayload = {
      order_id: 'ord123',
      total: 52.0,
      subtotal: 45.0,
      value: 50.0,
      items: [{ item_code: 'prd123', brand: 'brand123' }],
      property1: 'value1',
      property2: 'value2',
    };

    const result = enrichTrackPayload(message, payload);

    expect(result).toEqual(expectedPayload);
  });

  it('should return the enriched payload for custom event', () => {
    const message = {
      event: 'someEvent',
      properties: {
        order_id: 'ord123',
        property1: 'value1',
        property2: 'value2',
        revenue: 10,
        value: 11,
        products: [
          {
            product_id: 'prd123',
            test: 'test',
          },
        ],
      },
    };
    const payload = {
      order_id: 'ord123',
      value: 11,
    };
    const expectedPayload = {
      order_id: 'ord123',
      property1: 'value1',
      property2: 'value2',
      revenue: 10,
      value: 11,
      products: [
        {
          product_id: 'prd123',
          test: 'test',
        },
      ],
    };

    const result = enrichTrackPayload(message, payload);
    expect(result).toEqual(expectedPayload);
  });
});
