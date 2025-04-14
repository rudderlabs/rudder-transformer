const {
  encodePathParameter,
  isdeviceRelatedEventName,
  identifyResponseBuilder,
  aliasResponseBuilder,
  groupResponseBuilder,
  defaultResponseBuilder,
} = require('./util');

const getTestMessage = () => {
  let message = {
    anonymousId: 'anonId',
    previousId: 'user0',
    traits: {
      email: 'abc@test.com',
      name: 'rudder',
      address: {
        city: 'kolkata',
        country: 'India',
      },
      createdAt: '2014-05-21T15:54:20Z',
      timestamp: '2014-05-21T15:54:20Z',
    },
    properties: {
      test: 'property',
      value: 123,
    },
  };
  return message;
};
const getIdentifyTestMessage = () => {
  let message = {
    anonymousId: 'anonId',
    traits: {
      name: 'rudder',
      address: {
        city: 'kolkata',
        country: 'India',
      },
      createdAt: '2014-05-21T15:54:20Z',
      timestamp: '2014-05-21T15:54:20Z',
    },
  };
  return message;
};

const getGroupTestMessage = () => {
  let message = {
    groupId: 'group1',
    anonymousId: 'anonId',
    traits: {
      objectTypeId: 'obj1',
      email: 'abc@test.com',
      name: 'rudder',
      address: {
        city: 'kolkata',
        country: 'India',
      },
      action: 'test',
      createdAt: '2014-05-21T15:54:20Z',
      timestamp: '2014-05-21T15:54:20Z',
    },
  };
  return message;
};

describe('Unit test cases for customerio isdeviceRelatedEventName', () => {
  it('Device token name does not match with event name as well as allowed list', async () => {
    const destination = {
      Config: {
        apiKey: 'ef32c3f60fb98f39ef35',
        datacenterEU: true,
        deviceTokenEventName: 'device_token_registered',
        siteID: 'c0efdbd20b9fbe24a7e2',
      },
    };
    expect(isdeviceRelatedEventName('test', destination)).toEqual(false);
  });
  it('Device token matches with event name but not with allowed list', async () => {
    const destination = {
      Config: {
        apiKey: 'ef32c3f60fb98f39ef35',
        datacenterEU: true,
        deviceTokenEventName: 'test',
        siteID: 'c0efdbd20b9fbe24a7e2',
      },
    };
    expect(isdeviceRelatedEventName('test', destination)).toEqual(true);
  });

  it('Device token does not match with event name but with allowed list', async () => {
    const destination = {
      Config: {
        apiKey: 'ef32c3f60fb98f39ef35',
        datacenterEU: true,
        deviceTokenEventName: 'test',
        siteID: 'c0efdbd20b9fbe24a7e2',
      },
    };
    expect(isdeviceRelatedEventName('Application Installed', destination)).toEqual(true);
  });
});

describe('Unit test cases for customerio identifyResponseBuilder', () => {
  it('Device token name does not match with event name as well as allowed list', async () => {
    let expectedOutput = {
      endpoint: 'https://track.customer.io/api/v1/customers/user1',
      rawPayload: {
        anonymous_id: 'anonId',
        city: 'kolkata',
        country: 'India',
        created_at: 1400687660,
        email: 'abc@test.com',
        name: 'rudder',
        timestamp: '2014-05-21T15:54:20Z',
      },
      requestConfig: { requestFormat: 'JSON', requestMethod: 'PUT' },
    };
    expect(identifyResponseBuilder('user1', getTestMessage())).toEqual(expectedOutput);
  });
  it('No Identifier to send for Identify Call', async () => {
    let expectedOutput = 'userId or email is not present';
    try {
      identifyResponseBuilder(null, getIdentifyTestMessage());
    } catch (error) {
      expect(error.message).toEqual(expectedOutput);
    }
  });
  it('No Identifier to send for Identify Call', async () => {
    let expectedOutput = 'userId or email is not present';
    try {
      identifyResponseBuilder('', getIdentifyTestMessage());
    } catch (error) {
      expect(error.message).toEqual(expectedOutput);
    }
  });
});

describe('Unit test cases for customerio aliasResponseBuilder', () => {
  it('Device token name does not match with event name as well as allowed list', async () => {
    let expectedOutput = {
      endpoint: 'https://track.customer.io/api/v1/merge_customers',
      rawPayload: { primary: { id: 'user1' }, secondary: { id: 'user0' } },
      requestConfig: { requestFormat: 'JSON', requestMethod: 'POST' },
    };
    expect(aliasResponseBuilder(getTestMessage(), 'user1')).toEqual(expectedOutput);
  });
  it('Merging happending with previous_id as email and present one as id', async () => {
    let expectedOutput = {
      endpoint: 'https://track.customer.io/api/v1/merge_customers',
      rawPayload: { primary: { id: 'user1' }, secondary: { email: 'abc@test.com' } },
      requestConfig: { requestFormat: 'JSON', requestMethod: 'POST' },
    };
    expect(aliasResponseBuilder({ previousId: 'abc@test.com' }, 'user1')).toEqual(expectedOutput);
  });
  it('Merging happending with userId as email and present one as id', async () => {
    let expectedOutput = {
      endpoint: 'https://track.customer.io/api/v1/merge_customers',
      rawPayload: { secondary: { id: 'user1' }, primary: { email: 'abc@test.com' } },
      requestConfig: { requestFormat: 'JSON', requestMethod: 'POST' },
    };
    expect(aliasResponseBuilder({ previousId: 'user1' }, 'abc@test.com')).toEqual(expectedOutput);
  });
  it('Merging happending with userId as email and present one as id', async () => {
    let expectedOutput = {
      endpoint: 'https://track.customer.io/api/v1/merge_customers',
      rawPayload: { secondary: { email: 'user1@test.com' }, primary: { email: 'abc@test.com' } },
      requestConfig: { requestFormat: 'JSON', requestMethod: 'POST' },
    };
    expect(aliasResponseBuilder({ previousId: 'user1@test.com' }, 'abc@test.com')).toEqual(
      expectedOutput,
    );
  });
});

describe('Unit test cases for customerio groupResponseBuilder', () => {
  it('Device token name does not match with event name as well as allowed list', async () => {
    let expectedOutput = {
      endpoint: 'https://track.customer.io/api/v2/batch',
      rawPayload: {
        action: 'identify',
        attributes: {
          address: { city: 'kolkata', country: 'India' },
          createdAt: '2014-05-21T15:54:20Z',
          email: 'abc@test.com',
          name: 'rudder',
          objectTypeId: 'obj1',
          timestamp: '2014-05-21T15:54:20Z',
        },
        cio_relationships: [],
        identifiers: { object_id: 'group1', object_type_id: 'obj1' },
        type: 'object',
      },
      requestConfig: { requestFormat: 'JSON', requestMethod: 'POST' },
    };
    expect(groupResponseBuilder(getGroupTestMessage(), 'user1')).toEqual(expectedOutput);
  });
});

describe('Unit test cases for customerio encodePathParameter', () => {
  const testCases = [
    {
      name: "should encode path parameter with '/'",
      param: 'test/param',
      expectedOutput: 'test%2Fparam',
    },
    {
      name: "should not encode path parameter without '/'",
      param: 'some@email.com',
      expectedOutput: 'some@email.com',
    },
    {
      name: 'should not encode non-string parameter',
      param: 123,
      expectedOutput: 123,
    },
    {
      name: 'should not encode null parameter',
      param: null,
      expectedOutput: null,
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.name, () => {
      expect(encodePathParameter(testCase.param)).toEqual(testCase.expectedOutput);
    });
  });
});

describe('Unit test cases for customerio defaultResponseBuilder with userId containing forward slash', () => {
  const testCases = [
    {
      name: 'should encode userId with forward slash in the endpoint URL',
      message: {
        properties: { test: 'property' },
        anonymousId: 'anon123',
      },
      evName: 'Test Event',
      userId: 'user/with/slashes',
      evType: 'event',
      destination: {
        Config: {
          apiKey: 'test-api-key',
          siteID: 'test-site-id',
        },
      },
      messageType: 'track',
      expectedEndpoint: 'https://track.customer.io/api/v1/customers/user%2Fwith%2Fslashes/events',
      expectedPayloadProps: {
        data: true,
        name: 'Test Event',
        type: 'event',
      },
    },
    {
      name: 'should encode userId with multiple forward slashes in the endpoint URL',
      message: {
        properties: { test: 'property' },
        anonymousId: 'anon123',
      },
      evName: 'Test Event',
      userId: 'user/with/multiple/slashes',
      evType: 'event',
      destination: {
        Config: {
          apiKey: 'test-api-key',
          siteID: 'test-site-id',
        },
      },
      messageType: 'track',
      expectedEndpoint:
        'https://track.customer.io/api/v1/customers/user%2Fwith%2Fmultiple%2Fslashes/events',
      expectedPayloadProps: {
        data: true,
        name: 'Test Event',
        type: 'event',
      },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.name, () => {
      const result = defaultResponseBuilder(
        testCase.message,
        testCase.evName,
        testCase.userId,
        testCase.evType,
        testCase.destination,
        testCase.messageType,
      );

      // Check that the userId is properly encoded in the endpoint URL
      expect(result.endpoint).toEqual(testCase.expectedEndpoint);

      // Verify other parts of the response
      if (testCase.expectedPayloadProps.data) {
        expect(result.rawPayload).toHaveProperty('data');
      }
      if (testCase.expectedPayloadProps.name) {
        expect(result.rawPayload).toHaveProperty('name', testCase.expectedPayloadProps.name);
      }
      if (testCase.expectedPayloadProps.type) {
        expect(result.rawPayload).toHaveProperty('type', testCase.expectedPayloadProps.type);
      }
    });
  });
});
