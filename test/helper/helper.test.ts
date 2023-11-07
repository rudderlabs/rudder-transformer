import GeoLocationHelper from '../../src/helpers/geoLocation';

describe('GeoLocationHelper tests', () => {
  test('when context.geo is valid object & address is available in context.traits, map all values in context.traits.address', () => {
    const contextObj = {
      geo: {
        city: 'Gurugram',
        country: 'IN',
        ip: '223.190.82.63',
        location: '28.459700,77.028200',
        postal: '122001',
        region: 'Haryana',
        timezone: 'Asia/Kolkata',
      },
      app: {
        build: '1.0.0',
        name: 'RudderLabs JavaScript SDK',
        namespace: 'com.rudderlabs.javascript',
        version: '1.1.0-beta.2',
      },
      ip: '0.0.0.0',
      library: {
        name: 'RudderLabs JavaScript SDK',
        version: '1.1.0-beta.2',
      },
      locale: 'en-GB',
      os: {
        name: '',
        version: '',
      },
      screen: {
        density: 2,
      },
      traits: {
        email: 'example124@email.com',
        name: 'abcd124',
        address: {
          street: 'dalhousie street',
        },
      },
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
    };

    const msg = {
      anonymousId: '297b0750-934b-4411-b66c-9b418cdbc0c9',
      channel: 'web',
      context: contextObj,
      integrations: {
        All: true,
      },
      messageId: '0bab70e8-bf2f-449a-a19b-ca6e3bfed9b7',
      originalTimestamp: '2020-03-23T18:27:28.98Z',
      receivedAt: '2020-03-23T23:57:29.022+05:30',
      request_ip: '[::1]:51573',
      sentAt: '2020-03-23T18:27:28.981Z',
      timestamp: '2020-03-23T23:57:29.021+05:30',
      type: 'identify',
      userId: 'abcd-124',
    };

    const enhancedMsg = GeoLocationHelper.getGeoLocationData(msg);

    expect(enhancedMsg.context.traits.address).not.toBe(undefined);
    expect(enhancedMsg.context.traits.address).toEqual({
      city: 'Gurugram',
      country: 'IN',
      postalCode: '122001',
      state: 'Haryana',
      street: 'dalhousie street',
    });
  });

  test('when context.geo is valid object & address is not available at all, map all values in traits.address', () => {
    const contextObj = {
      geo: {
        city: 'Gurugram',
        country: 'IN',
        ip: '223.190.82.63',
        location: '28.459700,77.028200',
        postal: '122001',
        region: 'Haryana',
        timezone: 'Asia/Kolkata',
      },
      app: {
        build: '1.0.0',
        name: 'RudderLabs JavaScript SDK',
        namespace: 'com.rudderlabs.javascript',
        version: '1.1.0-beta.2',
      },
      ip: '0.0.0.0',
      library: {
        name: 'RudderLabs JavaScript SDK',
        version: '1.1.0-beta.2',
      },
      locale: 'en-GB',
      os: {
        name: '',
        version: '',
      },
      screen: {
        density: 2,
      },
      traits: {
        email: 'example124@email.com',
        name: 'abcd124',
      },
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
    };

    const msg = {
      anonymousId: '297b0750-934b-4411-b66c-9b418cdbc0c9',
      channel: 'web',
      context: contextObj,
      integrations: {
        All: true,
      },
      messageId: '0bab70e8-bf2f-449a-a19b-ca6e3bfed9b7',
      originalTimestamp: '2020-03-23T18:27:28.98Z',
      receivedAt: '2020-03-23T23:57:29.022+05:30',
      request_ip: '[::1]:51573',
      sentAt: '2020-03-23T18:27:28.981Z',
      timestamp: '2020-03-23T23:57:29.021+05:30',
      type: 'identify',
      userId: 'abcd-124',
    };

    const enhancedMsg = GeoLocationHelper.getGeoLocationData(msg);

    expect(enhancedMsg.context.traits.address).not.toBe(undefined);
    expect(enhancedMsg.context.traits.address).toEqual({
      city: 'Gurugram',
      country: 'IN',
      postalCode: '122001',
      state: 'Haryana',
    });
  });

  test('when context.geo is valid object & address has some in traits, enrich those that are not available in traits.address', () => {
    const contextObj = {
      geo: {
        city: 'Gurugram',
        country: 'IN',
        ip: '223.190.82.63',
        location: '28.459700,77.028200',
        postal: '122001',
        region: 'Haryana',
        timezone: 'Asia/Kolkata',
      },
      app: {
        build: '1.0.0',
        name: 'RudderLabs JavaScript SDK',
        namespace: 'com.rudderlabs.javascript',
        version: '1.1.0-beta.2',
      },
      ip: '0.0.0.0',
      library: {
        name: 'RudderLabs JavaScript SDK',
        version: '1.1.0-beta.2',
      },
      locale: 'en-GB',
      os: {
        name: '',
        version: '',
      },
      screen: {
        density: 2,
      },
      traits: {
        email: 'example124@email.com',
        name: 'abcd124',
      },
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
    };

    const msg = {
      anonymousId: '297b0750-934b-4411-b66c-9b418cdbc0c9',
      channel: 'web',
      context: contextObj,
      integrations: {
        All: true,
      },
      traits: {
        address: {
          state: 'Himachal',
          country: 'INDIA',
          street: 'damgoo road',
        },
      },
      messageId: '0bab70e8-bf2f-449a-a19b-ca6e3bfed9b7',
      originalTimestamp: '2020-03-23T18:27:28.98Z',
      receivedAt: '2020-03-23T23:57:29.022+05:30',
      request_ip: '[::1]:51573',
      sentAt: '2020-03-23T18:27:28.981Z',
      timestamp: '2020-03-23T23:57:29.021+05:30',
      type: 'identify',
      userId: 'abcd-124',
    };

    const enhancedMsg = GeoLocationHelper.getGeoLocationData(msg);

    expect(enhancedMsg.traits.address).not.toBe(undefined);
    expect(enhancedMsg.traits.address).toEqual({
      city: 'Gurugram',
      postalCode: '122001',
      // already in traits.address
      state: 'Himachal',
      country: 'INDIA',
      street: 'damgoo road',
    });
  });

  test('when context.geo is valid object & address is already enhanced, do not enrich with values from context.geo', () => {
    const contextObj = {
      geo: {
        city: 'Gurugram',
        country: 'IN',
        ip: '223.190.82.63',
        location: '28.459700,77.028200',
        postal: '122001',
        region: 'Haryana',
        timezone: 'Asia/Kolkata',
      },
      app: {
        build: '1.0.0',
        name: 'RudderLabs JavaScript SDK',
        namespace: 'com.rudderlabs.javascript',
        version: '1.1.0-beta.2',
      },
      ip: '0.0.0.0',
      library: {
        name: 'RudderLabs JavaScript SDK',
        version: '1.1.0-beta.2',
      },
      locale: 'en-GB',
      os: {
        name: '',
        version: '',
      },
      screen: {
        density: 2,
      },
      traits: {
        email: 'example124@email.com',
        name: 'abcd124',
      },
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
    };

    const msg = {
      anonymousId: '297b0750-934b-4411-b66c-9b418cdbc0c9',
      channel: 'web',
      context: contextObj,
      integrations: {
        All: true,
      },
      traits: {
        address: {
          state: 'Himachal',
          country: 'INDIA',
          street: 'damgoo road',
          city: 'Dharamshala',
          postalCode: '123546',
        },
      },
      messageId: '0bab70e8-bf2f-449a-a19b-ca6e3bfed9b7',
      originalTimestamp: '2020-03-23T18:27:28.98Z',
      receivedAt: '2020-03-23T23:57:29.022+05:30',
      request_ip: '[::1]:51573',
      sentAt: '2020-03-23T18:27:28.981Z',
      timestamp: '2020-03-23T23:57:29.021+05:30',
      type: 'identify',
      userId: 'abcd-124',
    };

    const enhancedMsg = GeoLocationHelper.getGeoLocationData(msg);

    expect(enhancedMsg.traits.address).not.toBe(undefined);
    expect(enhancedMsg.traits.address).toEqual({
      // already in traits.address
      state: 'Himachal',
      country: 'INDIA',
      street: 'damgoo road',
      city: 'Dharamshala',
      postalCode: '123546',
    });
  });

  test("when context.geo doesn't have some properties, do not make use of non-available values in context.geo", () => {
    const contextObj = {
      geo: {
        city: '',
        country: '',
        ip: '223.190.82.63',
        location: '28.459700,77.028200',
        postal: '122001',
        region: 'Haryana',
        timezone: 'Asia/Kolkata',
      },
      app: {
        build: '1.0.0',
        name: 'RudderLabs JavaScript SDK',
        namespace: 'com.rudderlabs.javascript',
        version: '1.1.0-beta.2',
      },
      ip: '0.0.0.0',
      library: {
        name: 'RudderLabs JavaScript SDK',
        version: '1.1.0-beta.2',
      },
      locale: 'en-GB',
      os: {
        name: '',
        version: '',
      },
      screen: {
        density: 2,
      },
      traits: {
        email: 'example124@email.com',
        name: 'abcd124',
      },
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
    };

    const msg = {
      anonymousId: '297b0750-934b-4411-b66c-9b418cdbc0c9',
      channel: 'web',
      context: contextObj,
      integrations: {
        All: true,
      },
      traits: {
        address: {
          state: 'Himachal',
          street: 'damgoo road',
          postalCode: '123546',
        },
      },
      messageId: '0bab70e8-bf2f-449a-a19b-ca6e3bfed9b7',
      originalTimestamp: '2020-03-23T18:27:28.98Z',
      receivedAt: '2020-03-23T23:57:29.022+05:30',
      request_ip: '[::1]:51573',
      sentAt: '2020-03-23T18:27:28.981Z',
      timestamp: '2020-03-23T23:57:29.021+05:30',
      type: 'identify',
      userId: 'abcd-124',
    };

    const enhancedMsg = GeoLocationHelper.getGeoLocationData(msg);

    expect(enhancedMsg.traits.address).not.toBe(undefined);
    expect(enhancedMsg.traits.address).toEqual({
      // already in traits.address
      state: 'Himachal',
      street: 'damgoo road',
      postalCode: '123546',
    });
  });

  test("when context.geo doesn't exist, enrichment would not happen", () => {
    const contextObj = {
      app: {
        build: '1.0.0',
        name: 'RudderLabs JavaScript SDK',
        namespace: 'com.rudderlabs.javascript',
        version: '1.1.0-beta.2',
      },
      ip: '0.0.0.0',
      library: {
        name: 'RudderLabs JavaScript SDK',
        version: '1.1.0-beta.2',
      },
      locale: 'en-GB',
      os: {
        name: '',
        version: '',
      },
      screen: {
        density: 2,
      },
      traits: {
        email: 'example124@email.com',
        name: 'abcd124',
      },
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
    };

    const msg = {
      anonymousId: '297b0750-934b-4411-b66c-9b418cdbc0c9',
      channel: 'web',
      context: contextObj,
      integrations: {
        All: true,
      },
      messageId: '0bab70e8-bf2f-449a-a19b-ca6e3bfed9b7',
      originalTimestamp: '2020-03-23T18:27:28.98Z',
      receivedAt: '2020-03-23T23:57:29.022+05:30',
      request_ip: '[::1]:51573',
      sentAt: '2020-03-23T18:27:28.981Z',
      timestamp: '2020-03-23T23:57:29.021+05:30',
      type: 'identify',
      userId: 'abcd-124',
    };

    const enhancedMsg = GeoLocationHelper.getGeoLocationData(msg);

    expect(enhancedMsg).toEqual({});
  });
});
