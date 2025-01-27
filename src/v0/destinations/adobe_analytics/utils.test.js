const {
  handleContextData,
  handleEvar,
  handleHier,
  handleList,
  handleCustomProperties,
  stringifyValueAndJoinWithDelimiter,
  escapeToHTML,
} = require('./utils'); // Update the path accordingly

const { InstrumentationError } = require('@rudderstack/integrations-lib');

describe('handleContextData', () => {
  it('should add context data to the payload when values are found', () => {
    const payload = {};
    const destinationConfig = {
      contextDataPrefix: 'c_',
      contextDataMapping: {
        'user.id': 'userId',
        'user.email': 'userEmail',
      },
    };
    const message = {
      user: {
        id: '123',
        email: 'test@example.com',
      },
    };

    const result = handleContextData(payload, destinationConfig, message);

    expect(result.contextData).toEqual({
      c_userId: '123',
      c_userEmail: 'test@example.com',
    });
  });

  it('should not add context data to the payload when no values are found', () => {
    const payload = {};
    const destinationConfig = {
      contextDataPrefix: 'c_',
      contextDataMapping: {
        'user.id': 'userId',
        'user.email': 'userEmail',
      },
    };
    const message = {
      user: {
        name: 'John Doe',
      },
    };

    const result = handleContextData(payload, destinationConfig, message);

    expect(result.contextData).toBeUndefined();
  });
});

describe('handleEvar', () => {
  it('should map properties to eVars in the payload', () => {
    const payload = {};
    const destinationConfig = {
      eVarMapping: {
        productId: '1',
        category: '2',
      },
    };
    const message = {
      properties: {
        productId: 'p123',
        category: 'electronics',
      },
    };

    const result = handleEvar(payload, destinationConfig, message);

    expect(result).toEqual({
      eVar1: 'p123',
      eVar2: 'electronics',
    });
  });

  it('should not add eVars to the payload when no values are found', () => {
    const payload = {};
    const destinationConfig = {
      eVarMapping: {
        productId: '1',
        category: '2',
      },
    };
    const message = {
      properties: {
        name: 'Product Name',
      },
    };

    const result = handleEvar(payload, destinationConfig, message);

    expect(result).toEqual({});
  });
});

describe('handleHier', () => {
  it('should map properties to hVars in the payload', () => {
    const payload = {};
    const destinationConfig = {
      hierMapping: {
        section: '1',
        subsection: '2',
      },
    };
    const message = {
      properties: {
        section: 'home',
        subsection: 'kitchen',
      },
    };

    const result = handleHier(payload, destinationConfig, message);

    expect(result).toEqual({
      hier1: 'home',
      hier2: 'kitchen',
    });
  });

  it('should not add hVars to the payload when no values are found', () => {
    const payload = {};
    const destinationConfig = {
      hierMapping: {
        section: '1',
        subsection: '2',
      },
    };
    const message = {
      properties: {
        name: 'Section Name',
      },
    };

    const result = handleHier(payload, destinationConfig, message);

    expect(result).toEqual({});
  });
});

describe('handleList', () => {
  it('should map properties to list variables in the payload', () => {
    const payload = {};
    const destinationConfig = {
      listMapping: {
        products: '1',
      },
      listDelimiter: {
        products: ',',
      },
    };
    const message = {
      properties: {
        products: ['p1', 'p2', 'p3'],
      },
    };

    const result = handleList(payload, destinationConfig, message);

    expect(result).toEqual({
      list1: 'p1,p2,p3',
    });
  });

  it('should throw an error when list properties are not strings or arrays', () => {
    const payload = {};
    const destinationConfig = {
      listMapping: {
        products: '1',
      },
      listDelimiter: {
        products: ',',
      },
    };
    const message = {
      properties: {
        products: 123, // Invalid type
      },
    };

    expect(() => handleList(payload, destinationConfig, message)).toThrow(InstrumentationError);
  });
});

describe('handleCustomProperties', () => {
  it('should map properties to custom properties in the payload', () => {
    const payload = {};
    const destinationConfig = {
      customPropsMapping: {
        color: '1',
        size: '2',
      },
      propsDelimiter: {
        color: ',',
        size: ';',
      },
    };
    const message = {
      properties: {
        color: 'red,green,blue',
        size: ['S', 'M', 'L'],
      },
    };

    const result = handleCustomProperties(payload, destinationConfig, message);

    expect(result).toEqual({
      prop1: 'red,green,blue',
      prop2: 'S;M;L',
    });
  });

  it('should throw an error when custom properties are not strings or arrays', () => {
    const payload = {};
    const destinationConfig = {
      customPropsMapping: {
        color: '1',
      },
      propsDelimiter: {
        color: ',',
      },
    };
    const message = {
      properties: {
        color: 123, // Invalid type
      },
    };

    expect(() => handleCustomProperties(payload, destinationConfig, message)).toThrow(
      InstrumentationError,
    );
  });
});

describe('stringifyValueAndJoinWithDelimiter', () => {
  it('should join values with a delimiter after stringifying them', () => {
    const values = [1, null, 'test', true];
    const result = stringifyValueAndJoinWithDelimiter(values, '|');

    expect(result).toBe('1|null|test|true');
  });

  it('should use the default delimiter if none is provided', () => {
    const values = [1, 2, 3];
    const result = stringifyValueAndJoinWithDelimiter(values);

    expect(result).toBe('1;2;3');
  });
});

describe('escapeToHTML', () => {
  it('should escape HTML entities in a string', () => {
    const input = '<div>&</div>';
    const result = escapeToHTML(input);

    expect(result).toBe('&lt;div&gt;&amp;&lt;/div&gt;');
  });

  it('should return non-string values unchanged', () => {
    const input = 123;
    const result = escapeToHTML(input);

    expect(result).toBe(123);
  });
});
