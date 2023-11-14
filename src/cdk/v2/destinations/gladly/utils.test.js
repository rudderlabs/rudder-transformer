const {
  getHeaders,
  getEndpoint,
  formatField,
  getCustomerId,
  getFieldValue,
  getQueryParams,
  validatePayload,
  formatFieldForRETl,
  getCustomAttributes,
  getExternalCustomerId,
  formatFieldForEventStream,
} = require('./utils');
const { base64Convertor } = require('../../../../v0/util');

describe('Unit test cases for getHeaders function', () => {
  it('Should return headers', () => {
    const destination = {
      Config: {
        apiToken: 'token',
        userName: 'user',
      },
    };
    const expectedHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${base64Convertor('user:token')}`,
    };

    const result = getHeaders(destination);

    expect(result).toEqual(expectedHeaders);
  });
});

describe('Unit test cases for getEndpoint function', () => {
  it('Should return destination endpoint', () => {
    const destination = {
      Config: {
        domain: 'rudderstack.us-uat.gladly.qa',
      },
    };
    const expected = 'https://rudderstack.us-uat.gladly.qa/api/v1/customer-profiles';
    const result = getEndpoint(destination);
    expect(result).toBe(expected);
  });
});

describe('Unit test cases for getFieldValue function', () => {
  it('Should return an array with a single object containing the original value when the input field is a string', () => {
    const field = 'rudderlabs1@gmail.com';
    const result = getFieldValue(field);
    expect(result).toEqual([{ original: field }]);
  });

  it('should return an array with each element containing the original value when the input field is an array', () => {
    const field = ['rudderlabs1@gmail.com', 'rudderlabs2@gmail.com', 'rudderlabs3@gmail.com'];
    const result = getFieldValue(field);
    expect(result).toEqual([
      {
        original: 'rudderlabs1@gmail.com',
      },
      {
        original: 'rudderlabs2@gmail.com',
      },
      {
        original: 'rudderlabs3@gmail.com',
      },
    ]);
  });

  it('Should return undefined when the input field is null', () => {
    const field = null;
    const result = getFieldValue(field);
    expect(result).toBeUndefined();
  });

  it('Should return undefined when the input field is undefined', () => {
    const field = undefined;
    const result = getFieldValue(field);
    expect(result).toBeUndefined();
  });
});

describe('Unit test cases for formatFieldForRETl function', () => {
  it('should return the object containing the original value when identifierType matches fieldName', () => {
    const message = {
      context: {
        externalId: [
          {
            id: 'test@rudderlabs.com',
            identifierType: 'email',
          },
        ],
      },
      traits: {
        emails: ['test@rudderlabs.com', 'test@rudderlabshome.com'],
      },
    };
    const fieldName = 'email';
    const expected = [{ original: 'test@rudderlabs.com' }];

    const result = formatFieldForRETl(message, fieldName);

    expect(result).toEqual(expected);
  });

  it('Should retrieve the email value from traits when fieldName does not match with identifierType', () => {
    const message = {
      context: {
        externalId: [
          {
            id: '+91 9999999999',
            identifierType: 'phone',
          },
        ],
      },
      traits: {
        emails: ['test@rudderlabs.com', 'test@rudderlabshome.com'],
      },
    };
    const fieldName = 'email';
    const expected = [{ original: 'test@rudderlabs.com' }, { original: 'test@rudderlabshome.com' }];

    const result = formatFieldForRETl(message, fieldName);

    expect(result).toEqual(expected);
  });
});

describe('Unit test cases for formatFieldForEventStream function', () => {
  it('Should return field value when fieldName exist in payload', () => {
    const message = {
      context: {
        traits: {
          phone: '+91 9999999999',
        },
      },
    };
    const fieldName = 'phone';
    const expected = [{ original: '+91 9999999999' }];

    const result = formatFieldForEventStream(message, fieldName);
    expect(result).toEqual(expected);
  });

  it('Should return undefined when fieldName does not exist in payload', () => {
    const message = {
      context: {
        traits: {
          phone: '+91 9999999999',
        },
      },
    };
    const fieldName = 'email';
    const result = formatFieldForEventStream(message, fieldName);
    expect(result).toBeUndefined();
  });
});

describe('Unit test cases for formatField function', () => {
  describe('rETL tests', () => {
    it('Should return field value from externalId when identifier type matches with fieldName', () => {
      const message = {
        context: {
          externalId: [
            {
              id: '+91 9999999999',
              identifierType: 'phone',
            },
          ],
          mappedToDestination: true,
        },
        traits: {
          emails: ['test@rudderlabs.com', 'test@rudderlabshome.com'],
        },
      };
      const result = formatField(message, 'phone');
      expect(result).toEqual([{ original: '+91 9999999999' }]);
    });

    it('Should return field value from traits when identifier type does not match with fieldName', () => {
      const message = {
        context: {
          externalId: [
            {
              id: 'user@1',
              identifierType: 'externalCustomerId',
            },
          ],
          mappedToDestination: true,
        },
        traits: {
          phones: ['+91 9999999999'],
        },
      };
      const result = formatField(message, 'phone');
      expect(result).toEqual([{ original: '+91 9999999999' }]);
    });
  });

  describe('Event stream tests', () => {
    it('Should return field value from payload', () => {
      const message = {
        context: {
          traits: {
            phone: ['+91 9999999999'],
          },
        },
      };
      const result = formatField(message, 'phone');
      expect(result).toEqual([{ original: '+91 9999999999' }]);
    });
  });
});

describe('Unit test cases for getCustomAttributes function', () => {
  describe('rETL tests', () => {
    it('Should return custom attributes from payload', () => {
      const message = {
        context: {
          mappedToDestination: true,
        },
        traits: {
          customAttributes: {
            attribute1: 'value1',
            attribute2: 'value2',
          },
        },
      };
      const result = getCustomAttributes(message);
      expect(result).toEqual({
        attribute1: 'value1',
        attribute2: 'value2',
      });
    });

    it('Should return undefined when empty custom attributes object is present in payload', () => {
      const message = {
        context: {
          mappedToDestination: true,
        },
        traits: {
          customAttributes: {},
        },
      };
      const result = getCustomAttributes(message);
      expect(result).toBeUndefined();
    });

    it('Should return undefined when no custom attributes are present in payload', () => {
      const message = {
        context: {
          mappedToDestination: true,
        },
        traits: {},
      };
      const result = getCustomAttributes(message);
      expect(result).toBeUndefined();
    });
  });

  describe('Event stream tests', () => {
    it('Should filter traits and return remaining custom attributes from payload', () => {
      const message = {
        context: {
          traits: {
            name: 'John Doe',
            email: 'john@gmail.com',
            age: 65,
            source: 'rudderstack',
          },
        },
      };
      const result = getCustomAttributes(message);
      expect(result).toEqual({
        age: 65,
        source: 'rudderstack',
      });
    });

    it('Should return undefined when empty traits object is present in payload', () => {
      const message = {
        context: {
          traits: {},
        },
      };
      const result = getCustomAttributes(message);
      expect(result).toBeUndefined();
    });

    it('Should return undefined when no traits object is present in payload', () => {
      const message = {
        context: {},
      };
      const result = getCustomAttributes(message);
      expect(result).toBeUndefined();
    });
  });
});

describe('Unit test cases for getExternalCustomerId function', () => {
  describe('rETL tests', () => {
    it('Should return the external ID when the identifier type is "externalCustomerId"', () => {
      const message = {
        context: {
          externalId: [
            {
              id: 'externalCustomer@1',
              identifierType: 'externalCustomerId',
            },
          ],
          mappedToDestination: true,
        },
      };

      const result = getExternalCustomerId(message);
      expect(result).toBe('externalCustomer@1');
    });

    it('Should return the external ID from traits when identifier type is not "externalCustomerId"', () => {
      const message = {
        context: {
          externalId: [
            {
              id: 'test@rudderlabs.com',
              identifierType: 'email',
            },
          ],
          mappedToDestination: true,
        },
        traits: {
          externalCustomerId: 'externalCustomer@1',
        },
      };
      const result = getExternalCustomerId(message);
      expect(result).toBe('externalCustomer@1');
    });

    it('Should return undefined when external customer id is not present in payload', () => {
      const message = {
        context: {
          mappedToDestination: true,
        },
      };

      const result = getExternalCustomerId(message);
      expect(result).toBeUndefined();
    });
  });

  describe('Event stream tests', () => {
    it('Should return the external ID as userId is present in payload', () => {
      const message = {
        userId: 'externalCustomer@1',
        context: {},
      };

      const result = getExternalCustomerId(message);
      expect(result).toBe('externalCustomer@1');
    });

    it('Should return undefined when userId is not present in payload', () => {
      const message = {
        context: {},
      };

      const result = getExternalCustomerId(message);
      expect(result).toBeUndefined();
    });
  });
});

describe('Unit test cases for getCustomerId function', () => {
  describe('rETL tests', () => {
    it('Should return the customerId when the identifier type is "id"', () => {
      const message = {
        context: {
          externalId: [
            {
              id: 'user@1',
              identifierType: 'id',
            },
          ],
          mappedToDestination: true,
        },
      };

      const result = getCustomerId(message);
      expect(result).toBe('user@1');
    });

    it('Should return the customerId from traits when identifier type is not "id"', () => {
      const message = {
        context: {
          externalId: [
            {
              id: 'test@rudderlabs.com',
              identifierType: 'email',
            },
          ],
          mappedToDestination: true,
        },
        traits: {
          id: 'user@1',
        },
      };
      const result = getCustomerId(message);
      expect(result).toBe('user@1');
    });

    it('Should return undefined when customerId is not present in payload', () => {
      const message = {
        context: {
          mappedToDestination: true,
        },
      };

      const result = getCustomerId(message);
      expect(result).toBeUndefined();
    });
  });

  describe('Event stream tests', () => {
    it('Should return the customerId as GladlyCustomerId is present in payload', () => {
      const message = {
        context: {
          externalId: [
            {
              id: 'user@1',
              type: 'GladlyCustomerId',
            },
          ],
        },
      };
      const result = getCustomerId(message);
      expect(result).toBe('user@1');
    });

    it('Should return undefined when GladlyCustomerId is not present in payload', () => {
      const message = {
        context: {},
      };
      const result = getCustomerId(message);
      expect(result).toBeUndefined();
    });
  });
});

describe('Unit test cases for validatePayload function', () => {
  it('Should throw an error when payload does not have all required fields', () => {
    const payload = {};
    try {
      validatePayload(payload);
    } catch (err) {
      expect(err.message).toEqual(
        'One of phone, email, userId or GladlyCustomerId is required for an identify call',
      );
    }
  });

  it('Should throw an error when payload is undefined', () => {
    const payload = undefined;
    try {
      validatePayload(payload);
    } catch (err) {
      expect(err.message).toEqual(
        'One of phone, email, userId or GladlyCustomerId is required for an identify call',
      );
    }
  });
});

describe('Unit test cases for getQueryParams function', () => {
  it('Should return email as query parameter if email is present in payload', () => {
    const payload = {
      emails: [{ original: 'test@example.com' }],
    };
    const result = getQueryParams(payload);
    expect(result).toBe('email=test%40example.com');
  });

  it('Should return phone as query parameter if phone is present in payload', () => {
    const payload = {
      phones: [{ original: '+91 9999999999' }],
    };
    const result = getQueryParams(payload);
    expect(result).toBe('phoneNumber=%2B91%209999999999');
  });

  it('Should return externalCustomerId as query parameter if externalCustomerId is present in payload', () => {
    const payload = {
      externalCustomerId: 'externalCustomer@1',
    };
    const result = getQueryParams(payload);
    expect(result).toBe('externalCustomerId=externalCustomer%401');
  });

  it('should return undefined when no supported query params are present in payload', () => {
    const payload = {};
    const result = getQueryParams(payload);
    expect(result).toBeUndefined();
  });
});
