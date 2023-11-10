import { ProcessorTransformationRequest, RouterTransformationRequest } from '../../src/types';
import GeoEnricher from '../../src/middlewares/enricher';

describe('[GeoLocation Enrichment] Processor transformation tests', () => {
  test('should enrich when context.geo is populated correctly', async () => {
    const inputData: ProcessorTransformationRequest[] = [
      {
        destination: {
          ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
          Name: 'Autopilot',
          DestinationDefinition: {
            ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
            Name: 'AUTOPILOT',
            DisplayName: 'Autopilot',
            Config: {
              cdkEnabled: true,
              excludeKeys: [],
              includeKeys: [],
            },
          },
          Config: {
            apiKey: 'dummyApiKey',
            customMappings: [
              {
                from: '0001',
                to: 'Signup',
              },
            ],
            triggerId: '00XX',
          },
          Enabled: true,
          Transformations: [],
          // @ts-ignore
          IsProcessorEnabled: true,
        },
        message: {
          anonymousId: 'ac7722c2-ccb6-4ae2-baf6-1effe861f4cd',
          channel: 'web',
          context: {
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
              version: '1.1.1-rc.2',
            },
            library: {
              name: 'RudderLabs JavaScript SDK',
              version: '1.1.1-rc.2',
            },
            locale: 'en-GB',
            os: {
              name: '',
              version: '',
            },
            page: {
              path: '/tests/html/index4.html',
              referrer: '',
              search: '',
              title: '',
              url: 'http://localhost/tests/html/index4.html',
            },
            screen: {
              density: 2,
            },
            userAgent:
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
          },
          integrations: {
            All: true,
          },
          messageId: 'fad9b3fb-5778-4db3-9fb6-7168b554191f',
          originalTimestamp: '2020-04-17T14:42:44.722Z',
          receivedAt: '2020-04-17T20:12:44.758+05:30',
          request_ip: '[::1]:53513',
          sentAt: '2020-04-17T14:42:44.722Z',
          traits: {
            age: 23,
            email: 'testmp@rudderstack.com',
            firstname: 'Test Kafka',
          },
          timestamp: '2020-04-17T20:12:44.758+05:30',
          type: 'identify',
          userId: 'user12345',
        },
      },
    ];
    const ctx = { request: { body: inputData } };
    // @ts-ignore
    await GeoEnricher.enrich(ctx, () => {});
    expect(ctx.request.body[0].message.traits).toMatchObject(
      expect.objectContaining({
        age: 23,
        email: 'testmp@rudderstack.com',
        firstname: 'Test Kafka',
        address: {
          city: 'Gurugram',
          country: 'IN',
          postalCode: '122001',
          state: 'Haryana',
        },
      }),
    );
  });

  test('should not enrich when address is already enhanced', async () => {
    const inputData: ProcessorTransformationRequest[] = [
      {
        destination: {
          ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
          Name: 'Autopilot',
          DestinationDefinition: {
            ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
            Name: 'AUTOPILOT',
            DisplayName: 'Autopilot',
            Config: {
              cdkEnabled: true,
              excludeKeys: [],
              includeKeys: [],
            },
          },
          Config: {
            apiKey: 'dummyApiKey',
            customMappings: [
              {
                from: '0001',
                to: 'Signup',
              },
            ],
            triggerId: '00XX',
          },
          Enabled: true,
          Transformations: [],
          // @ts-ignore
          IsProcessorEnabled: true,
        },
        message: {
          context: {
            geo: {
              city: 'Gurugram',
              country: 'IN',
              ip: '223.190.82.63',
              location: '28.459700,77.028200',
              postal: '122001',
              region: 'Haryana',
              timezone: 'Asia/Kolkata',
            },
            library: {
              name: 'RudderLabs JavaScript SDK',
              version: '1.1.1-rc.2',
            },
          },
          integrations: {
            All: true,
          },
          traits: {
            age: 23,
            email: 'testmp1@rudderstack.com',
            firstname: 'Test Kafka2',
            address: {
              state: 'Himachal',
              country: 'INDIA',
              street: 'damgoo road',
              postalCode: '123321',
              city: 'Bandarpur',
            },
          },
        },
      },
    ];
    const ctx = { request: { body: inputData } };
    // @ts-ignore
    await GeoEnricher.enrich(ctx, () => {});
    expect(ctx.request.body[0].message.traits).toMatchObject(
      expect.objectContaining({
        age: 23,
        email: 'testmp1@rudderstack.com',
        firstname: 'Test Kafka2',
        address: {
          state: 'Himachal',
          country: 'INDIA',
          street: 'damgoo road',
          postalCode: '123321',
          city: 'Bandarpur',
        },
      }),
    );
  });

  test('should enrich only those fields that are not already enriched when address already contains partial data', async () => {
    const inputData: ProcessorTransformationRequest[] = [
      {
        destination: {
          ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
          Name: 'Autopilot',
          DestinationDefinition: {
            ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
            Name: 'AUTOPILOT',
            DisplayName: 'Autopilot',
            Config: {
              cdkEnabled: true,
              excludeKeys: [],
              includeKeys: [],
            },
          },
          Config: {
            apiKey: 'dummyApiKey',
            customMappings: [
              {
                from: '0001',
                to: 'Signup',
              },
            ],
            triggerId: '00XX',
          },
          Enabled: true,
          Transformations: [],
          // @ts-ignore
          IsProcessorEnabled: true,
        },
        message: {
          context: {
            geo: {
              city: 'Gurugram',
              country: 'IN',
              ip: '223.190.82.63',
              location: '28.459700,77.028200',
              postal: '122001',
              region: 'Haryana',
              timezone: 'Asia/Kolkata',
            },
            library: {
              name: 'RudderLabs JavaScript SDK',
              version: '1.1.1-rc.2',
            },
          },
          traits: {
            age: 23,
            email: 'testmp1@rudderstack.com',
            firstname: 'Test Kafka2',
            address: {
              state: 'Himachal',
              country: 'INDIA',
              street: 'damgoo road',
              postalCode: '123321',
            },
          },
        },
      },
    ];
    const ctx = { request: { body: inputData } };
    // @ts-ignore
    await GeoEnricher.enrich(ctx, () => {});
    expect(ctx.request.body[0].message.traits).toMatchObject(
      expect.objectContaining({
        age: 23,
        email: 'testmp1@rudderstack.com',
        firstname: 'Test Kafka2',
        address: {
          state: 'Himachal',
          country: 'INDIA',
          street: 'damgoo road',
          postalCode: '123321',
          // enriched field
          city: 'Gurugram',
        },
      }),
    );
  });

  test('should not enrich when context.geo is not populated & address is already present', async () => {
    const inputData: ProcessorTransformationRequest[] = [
      {
        destination: {
          ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
          Name: 'Autopilot',
          DestinationDefinition: {
            ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
            Name: 'AUTOPILOT',
            DisplayName: 'Autopilot',
            Config: {
              cdkEnabled: true,
              excludeKeys: [],
              includeKeys: [],
            },
          },
          Config: {
            apiKey: 'dummyApiKey',
            customMappings: [
              {
                from: '0001',
                to: 'Signup',
              },
            ],
            triggerId: '00XX',
          },
          Enabled: true,
          Transformations: [],
          // @ts-ignore
          IsProcessorEnabled: true,
        },
        message: {
          context: {
            library: {
              name: 'RudderLabs JavaScript SDK',
              version: '1.1.1-rc.2',
            },
          },
          traits: {
            age: 23,
            email: 'testmp@rudderstack.com',
            firstname: 'Test Kafka',
            address: {
              country: 'India',
            },
          },
        },
      },
    ];
    const ctx = { request: { body: inputData } };
    // @ts-ignore
    await GeoEnricher.enrich(ctx, () => {});

    // @ts-ignore
    expect(ctx.request.body[0].message.traits?.address).toEqual({ country: 'India' });
  });

  test('should not contain address object, when context.geo & address are not present', async () => {
    const inputData: ProcessorTransformationRequest[] = [
      {
        destination: {
          ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
          Name: 'Autopilot',
          DestinationDefinition: {
            ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
            Name: 'AUTOPILOT',
            DisplayName: 'Autopilot',
            Config: {
              cdkEnabled: true,
              excludeKeys: [],
              includeKeys: [],
            },
          },
          Config: {
            apiKey: 'dummyApiKey',
            customMappings: [
              {
                from: '0001',
                to: 'Signup',
              },
            ],
            triggerId: '00XX',
          },
          Enabled: true,
          Transformations: [],
          // @ts-ignore
          IsProcessorEnabled: true,
        },
        message: {
          anonymousId: 'ac7722c2-ccb6-4ae2-baf6-1effe861f4cd',
          channel: 'web',
          context: {
            app: {
              build: '1.0.0',
              name: 'RudderLabs JavaScript SDK',
              namespace: 'com.rudderlabs.javascript',
              version: '1.1.1-rc.2',
            },
            library: {
              name: 'RudderLabs JavaScript SDK',
              version: '1.1.1-rc.2',
            },
            locale: 'en-GB',
            os: {
              name: '',
              version: '',
            },
            page: {
              path: '/tests/html/index4.html',
              referrer: '',
              search: '',
              title: '',
              url: 'http://localhost/tests/html/index4.html',
            },
            screen: {
              density: 2,
            },
            userAgent:
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
          },
          integrations: {
            All: true,
          },
          messageId: 'fad9b3fb-5778-4db3-9fb6-7168b554191f',
          originalTimestamp: '2020-04-17T14:42:44.722Z',
          receivedAt: '2020-04-17T20:12:44.758+05:30',
          request_ip: '[::1]:53513',
          sentAt: '2020-04-17T14:42:44.722Z',
          traits: {
            age: 23,
            email: 'testmp@rudderstack.com',
            firstname: 'Test Kafka',
          },
          timestamp: '2020-04-17T20:12:44.758+05:30',
          type: 'identify',
          userId: 'user12345',
        },
      },
      {
        destination: {
          ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
          Name: 'Autopilot',
          DestinationDefinition: {
            ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
            Name: 'AUTOPILOT',
            DisplayName: 'Autopilot',
            Config: {
              cdkEnabled: true,
              excludeKeys: [],
              includeKeys: [],
            },
          },
          Config: {
            apiKey: 'dummyApiKey',
            customMappings: [
              {
                from: '0001',
                to: 'Signup',
              },
            ],
            triggerId: '00XX',
          },
          Enabled: true,
          Transformations: [],
          // @ts-ignore
          IsProcessorEnabled: true,
        },
        message: {
          context: {
            library: {
              name: 'RudderLabs JavaScript SDK',
              version: '1.1.1-rc.2',
            },
          },
          traits: {
            key: 'val',
          },
        },
      },
    ];
    const ctx = { request: { body: inputData } };
    // @ts-ignore
    await GeoEnricher.enrich(ctx, () => {});
    expect(ctx.request.body[0].message.traits).not.toHaveProperty('address');
    expect(ctx.request.body[1].message.traits).not.toHaveProperty('address');
  });

  test('should enrich when context.geo is populated correctly for multiple payloads with their own geolocation data', async () => {
    const inputData: ProcessorTransformationRequest[] = [
      {
        destination: {
          ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
          Name: 'Autopilot',
          DestinationDefinition: {
            ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
            Name: 'AUTOPILOT',
            DisplayName: 'Autopilot',
            Config: {
              cdkEnabled: true,
              excludeKeys: [],
              includeKeys: [],
            },
          },
          Config: {
            apiKey: 'dummyApiKey',
            customMappings: [
              {
                from: '0001',
                to: 'Signup',
              },
            ],
            triggerId: '00XX',
          },
          Enabled: true,
          Transformations: [],
          // @ts-ignore
          IsProcessorEnabled: true,
        },
        message: {
          context: {
            geo: {
              city: 'Gurugram',
              country: 'IN',
              ip: '223.190.82.63',
              location: '28.459700,77.028200',
              postal: '122001',
              region: 'Haryana',
              timezone: 'Asia/Kolkata',
            },
            library: {
              name: 'RudderLabs JavaScript SDK',
              version: '1.1.1-rc.2',
            },
          },
          traits: {
            age: 23,
            email: 'testmp@rudderstack.com',
            firstname: 'Test Kafka',
          },
        },
      },
      {
        destination: {
          ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
          Name: 'Autopilot',
          DestinationDefinition: {
            ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
            Name: 'AUTOPILOT',
            DisplayName: 'Autopilot',
            Config: {
              cdkEnabled: true,
              excludeKeys: [],
              includeKeys: [],
            },
          },
          Config: {
            apiKey: 'dummyApiKey',
            customMappings: [
              {
                from: '0001',
                to: 'Signup',
              },
            ],
            triggerId: '00XX',
          },
          Enabled: true,
          Transformations: [],
          // @ts-ignore
          IsProcessorEnabled: true,
        },
        message: {
          anonymousId: 'ac7722c2-ccb6-4ae2-baf6-1effe861f4cd',
          channel: 'web',
          context: {
            geo: {
              city: 'Gurugram',
              country: 'IN',
              ip: '223.190.82.63',
              location: '28.459700,77.028200',
              postal: '122002',
              region: 'Haryana',
              timezone: 'Asia/Kolkata',
            },
            app: {
              build: '1.0.0',
              name: 'RudderLabs JavaScript SDK',
              namespace: 'com.rudderlabs.javascript',
              version: '1.1.1-rc.2',
            },
            library: {
              name: 'RudderLabs JavaScript SDK',
              version: '1.1.1-rc.2',
            },
            locale: 'en-GB',
            os: {
              name: '',
              version: '',
            },
            page: {
              path: '/tests/html/index4.html',
              referrer: '',
              search: '',
              title: '',
              url: 'http://localhost/tests/html/index4.html',
            },
            screen: {
              density: 2,
            },
            userAgent:
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
          },
          integrations: {
            All: true,
          },
          messageId: 'fad9b3fb-5778-4db3-9fb6-7168b554191f',
          originalTimestamp: '2020-04-17T14:42:44.722Z',
          receivedAt: '2020-04-17T20:12:44.758+05:30',
          request_ip: '[::1]:53513',
          sentAt: '2020-04-17T14:42:44.722Z',
          traits: {
            address: {
              street: 'janamsthan',
            },
          },
          timestamp: '2020-04-17T20:12:44.758+05:30',
          type: 'identify',
          userId: 'user12345',
        },
      },
    ];
    const ctx = { request: { body: inputData } };
    // @ts-ignore
    await GeoEnricher.enrich(ctx, () => {});
    expect(ctx.request.body[0].message.traits).toMatchObject(
      expect.objectContaining({
        age: 23,
        email: 'testmp@rudderstack.com',
        firstname: 'Test Kafka',
        address: {
          city: 'Gurugram',
          country: 'IN',
          postalCode: '122001',
          state: 'Haryana',
        },
      }),
    );
    expect(ctx.request.body[1].message.traits).toMatchObject(
      expect.objectContaining({
        address: {
          city: 'Gurugram',
          country: 'IN',
          postalCode: '122002',
          state: 'Haryana',
          street: 'janamsthan',
        },
      }),
    );
  });
});

describe('[GeoLocation Enrichment] Router/Batch transformation tests', () => {
  test('should enrich with geo information when context.geo is present', async () => {
    const inputData: RouterTransformationRequest = {
      input: [
        {
          destination: {
            ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
            Name: 'Autopilot',
            DestinationDefinition: {
              ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
              Name: 'AUTOPILOT',
              DisplayName: 'Autopilot',
              Config: {
                excludeKeys: [],
                includeKeys: [],
              },
            },
            Config: {
              apiKey: 'dummyApiKey',
              customMappings: [
                {
                  from: '0001',
                  to: 'Signup',
                },
              ],
              triggerId: '00XX',
            },
            Enabled: true,
            Transformations: [],
            // @ts-ignore
            IsProcessorEnabled: true,
          },
          message: {
            context: {
              geo: {
                city: 'Gurugram',
                country: 'IN',
                ip: '223.190.82.63',
                location: '28.459700,77.028200',
                postal: '122001',
                region: 'Haryana',
                timezone: 'Asia/Kolkata',
              },
            },
            traits: {
              age: 23,
              email: 'testm3p@rudderstack.com',
              firstname: 'Test Kafka',
            },
          },
        },
        {
          destination: {
            ID: '1afjtc6chkhdeKsXYrNFOzR5D9v',
            Name: 'Autopilot',
            DestinationDefinition: {
              ID: '1afjX4MlAucK57Q0ctTVlD27Tvo',
              Name: 'AUTOPILOT',
              DisplayName: 'Autopilot',
              Config: {
                excludeKeys: [],
                includeKeys: [],
              },
            },
            Config: {
              apiKey: 'dummyApiKey',
              customMappings: [
                {
                  from: '0001',
                  to: 'Signup',
                },
              ],
              triggerId: '00XX',
            },
            Enabled: true,
            Transformations: [],
            // @ts-ignore
            IsProcessorEnabled: true,
          },
          message: {
            context: {
              geo: {
                city: 'Gurugram',
                country: 'IN',
                ip: '223.190.82.63',
                location: '28.459700,77.028200',
                postal: '122002',
                region: 'Haryana',
                timezone: 'Asia/Kolkata',
              },
              traits: {
                age: 23,
                email: 'testmp@rudderstack.com',
                firstname: 'Test Kafka',
              },
            },
          },
        },
      ],
      destType: 'autopilot',
    };
    const ctx = { request: { body: inputData } };
    // @ts-ignore
    await GeoEnricher.enrich(ctx, () => {});
    expect(ctx.request.body.input[0].message.traits).toMatchObject(
      expect.objectContaining({
        age: 23,
        email: 'testm3p@rudderstack.com',
        firstname: 'Test Kafka',
        address: {
          city: 'Gurugram',
          country: 'IN',
          postalCode: '122001',
          state: 'Haryana',
        },
      }),
    );
    // @ts-ignore
    expect(ctx.request.body.input[1].message.context?.traits).toMatchObject(
      expect.objectContaining({
        address: {
          city: 'Gurugram',
          country: 'IN',
          postalCode: '122002',
          state: 'Haryana',
        },
      }),
    );
  });
});
