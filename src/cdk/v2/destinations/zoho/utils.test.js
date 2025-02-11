jest.mock('../../../../adapters/network');
const { ConfigurationError } = require('@rudderstack/integrations-lib');
const { handleHttpRequest } = require('../../../../adapters/network');
const {
  handleDuplicateCheck,
  deduceModuleInfo,
  validatePresenceOfMandatoryProperties,
  validateConfigurationIssue,
  formatMultiSelectFields,
  transformToURLParams,
  calculateTrigger,
  searchRecordId,
} = require('./utils');

describe('handleDuplicateCheck', () => {
  const testCases = [
    {
      name: 'should return identifierType when addDefaultDuplicateCheck is false',
      input: {
        identifierType: 'email',
        addDefaultDuplicateCheck: false,
        operationModuleType: 'Leads',
        moduleWiseDuplicateCheckField: {},
      },
      expected: ['email'],
    },
    {
      name: 'handles valid operationModuleType and already included identifierType',
      input: {
        identifierType: 'Email',
        addDefaultDuplicateCheck: true,
        operationModuleType: 'Leads',
      },
      expected: ['Email'],
    },
    {
      name: "should return identifierType and 'Name' when addDefaultDuplicateCheck is true and moduleDuplicateCheckField is not defined",
      input: {
        identifierType: 'id',
        addDefaultDuplicateCheck: true,
        operationModuleType: 'type3',
      },
      expected: ['id', 'Name'],
    },
    {
      name: 'should handle null values in moduleWiseDuplicateCheckField',
      input: {
        identifierType: 'Identifier',
        addDefaultDuplicateCheck: true,
        operationModuleType: 'type1',
      },
      expected: ['Identifier', 'Name'],
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      const result = handleDuplicateCheck(
        input.addDefaultDuplicateCheck,
        input.identifierType,
        input.operationModuleType,
        input.moduleWiseDuplicateCheckField,
      );
      expect(result).toEqual(expected);
    });
  });
});

describe('formatMultiSelectFields', () => {
  const testCases = [
    {
      name: 'should convert a field value to an array if a mapping exists in multiSelectFieldLevelDecision',
      input: {
        config: {
          multiSelectFieldLevelDecision: [{ from: 'tags', to: 'tagsArray' }],
        },
        fields: { tags: 'value' },
      },
      expected: { tags: ['value'] },
    },
    {
      name: 'should leave fields unchanged if no mapping exists',
      input: {
        config: {
          multiSelectFieldLevelDecision: [{ from: 'categories', to: 'catArray' }],
        },
        fields: { tags: 'value', other: 'val' },
      },
      expected: { tags: 'value', other: 'val' },
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      const result = formatMultiSelectFields(input.config, { ...input.fields });
      expect(result).toEqual(expected);
    });
  });
});

describe('transformToURLParams', () => {
  const testCases = [
    {
      name: 'should build a proper URL with encoded criteria based on fields and config',
      input: {
        fields: { First_Name: 'John, Doe', Age: '30' },
        config: { region: 'US' },
      },
      expected: `https://www.zohoapis.com/crm/v6/Leads/search?criteria=(First_Name:equals:John%5C%2C%20Doe)and(Age:equals:30)`,
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      const url = transformToURLParams(input.fields, input.config);
      expect(url).toEqual(expected);
    });
  });
});

describe('calculateTrigger', () => {
  const testCases = [
    {
      name: 'should return null when trigger is "Default"',
      input: 'Default',
      expected: null,
    },
    {
      name: 'should return an empty array when trigger is "None"',
      input: 'None',
      expected: [],
    },
    {
      name: 'should return an array containing the trigger for Custom',
      input: 'Custom',
      expected: ['Custom'],
    },
    {
      name: 'should return an array containing the trigger for Approval',
      input: 'Approval',
      expected: ['Approval'],
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      expect(calculateTrigger(input)).toEqual(expected);
    });
  });
});

describe('searchRecordId', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const testCases = [
    {
      name: 'should return valid record IDs when HTTP response is successful with data',
      input: {
        fields: { email: 'test@example.com' },
        metadata: { secret: { accessToken: 'token' } },
        config: { region: 'US' },
        mockResponse: {
          processedResponse: {
            status: 200,
            response: {
              data: [{ id: 'rec1' }, { id: 'rec2' }],
            },
          },
        },
      },
      expected: { erroneous: false, message: ['rec1', 'rec2'] },
    },
    {
      name: 'should return error if HTTP status indicates failure',
      input: {
        fields: { email: 'error@example.com' },
        metadata: { secret: { accessToken: 'token' } },
        config: { region: 'US' },
        mockResponse: {
          processedResponse: {
            status: 400,
            response: 'Bad Request',
          },
        },
      },
      expected: { erroneous: true, message: 'Bad Request' },
    },
    {
      name: 'should return error message when HTTP status is 204 (no content)',
      input: {
        fields: { email: 'nocontent@example.com' },
        metadata: { secret: { accessToken: 'token' } },
        config: { region: 'US' },
        mockResponse: {
          processedResponse: {
            status: 204,
            response: null,
          },
        },
      },
      expected: { erroneous: true, message: 'No contact is found with record details' },
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, async () => {
      handleHttpRequest.mockResolvedValue(input.mockResponse);
      const result = await searchRecordId(input.fields, input.metadata, input.config);
      expect(result).toEqual(expected);
    });
  });
});

describe('deduceModuleInfo', () => {
  const testCases = [
    {
      name: 'should return empty object when mappedToDestination is not present',
      input: {
        inputs: [{}],
        config: { region: 'US' },
      },
      expected: {},
    },
    {
      name: 'should return operationModuleInfo when mappedToDestination is present',
      input: {
        inputs: [
          {
            message: {
              context: {
                externalId: [{ type: 'ZOHO-Leads', id: '12345', identifierType: 'Email' }],
                mappedToDestination: true,
              },
            },
          },
        ],
        config: { region: 'US' },
      },
      expected: {
        operationModuleType: 'Leads',
        upsertEndPoint: 'https://www.zohoapis.com/crm/v6/Leads',
        identifierType: 'Email',
      },
    },
    {
      name: 'should handle different regions in config',
      input: {
        inputs: [
          {
            message: {
              context: {
                externalId: [{ type: 'ZOHO-Leads', id: '12345', identifierType: 'Email' }],
                mappedToDestination: 'true',
              },
            },
          },
        ],
        config: { region: 'EU' },
      },
      expected: {
        operationModuleType: 'Leads',
        upsertEndPoint: 'https://www.zohoapis.eu/crm/v6/Leads',
        identifierType: 'Email',
      },
    },
    {
      name: 'should handle null input',
      input: {
        inputs: null,
        config: {},
      },
      expected: {},
    },
    {
      name: 'should handle undefined input',
      input: {
        inputs: undefined,
        config: {},
      },
      expected: {},
    },
    {
      name: 'should handle non-array input',
      input: {
        inputs: 'not an array',
        config: {},
      },
      expected: {},
    },
    {
      name: 'should handle empty array',
      input: {
        inputs: [],
        config: {},
      },
      expected: {},
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      const result = deduceModuleInfo(input.inputs, input.config);
      expect(result).toEqual(expected);
    });
  });
});

describe('validatePresenceOfMandatoryProperties', () => {
  const testCases = [
    {
      name: 'should not throw an error if the object has all required fields',
      input: {
        objectName: 'Leads',
        object: { Last_Name: 'Doe' },
      },
      expected: { missingField: [], status: false },
      expectError: false,
    },
    {
      name: 'should return missing field if mandatory field contains empty string',
      input: {
        objectName: 'Leads',
        object: { Last_Name: '' },
      },
      expected: { missingField: ['Last_Name'], status: true },
      expectError: false,
    },
    {
      name: 'should return missing field if mandatory field contains empty null',
      input: {
        objectName: 'Leads',
        object: { Last_Name: null },
      },
      expected: { missingField: ['Last_Name'], status: true },
      expectError: false,
    },
    {
      name: 'should not throw an error if the objectName is not in MODULE_MANDATORY_FIELD_CONFIG',
      input: {
        objectName: 'CustomObject',
        object: { Some_Field: 'Some Value' },
      },
      expected: undefined,
      expectError: false,
    },
    {
      name: 'should return multiple missing fields for Deals',
      input: {
        objectName: 'Deals',
        object: { Deal_Name: 'Big Deal' },
      },
      expected: {
        missingField: ['Stage', 'Pipeline'],
        status: true,
      },
      expectError: false,
    },
    {
      name: 'should not throw an error if the object has all required fields for Deals',
      input: {
        objectName: 'Deals',
        object: { Deal_Name: 'Big Deal', Stage: 'Negotiation', Pipeline: 'Sales' },
      },
      expected: { missingField: [], status: false },
      expectError: false,
    },
  ];

  testCases.forEach(({ name, input, expected, expectError }) => {
    it(name, () => {
      if (expectError) {
        expect(() =>
          validatePresenceOfMandatoryProperties(input.objectName, input.object),
        ).toThrow();
      } else {
        const result = validatePresenceOfMandatoryProperties(input.objectName, input.object);
        expect(result).toEqual(expected);
      }
    });
  });
});

describe('validateConfigurationIssue', () => {
  const testCases = [
    {
      name: 'should throw ConfigurationError when hashMapMultiselect is not empty, Config.module is different from operationModuleType, and action is not delete',
      input: {
        config: {
          multiSelectFieldLevelDecision: [{ from: 'field1', to: 'true' }],
          module: 'moduleA',
        },
        operationModuleType: 'moduleB',
      },
      expectError: true,
      errorType: ConfigurationError,
      errorMessage:
        'Object Chosen in Visual Data Mapper is not consistent with Module type selected in destination configuration. Aborting Events.',
    },
    {
      name: 'should not throw an error when hashMapMultiselect is not empty, Config.module is the same as operationModuleType',
      input: {
        config: {
          multiSelectFieldLevelDecision: [{ from: 'field1', to: 'true' }],
          module: 'moduleA',
        },
        operationModuleType: 'moduleA',
      },
      expectError: false,
    },
    {
      name: 'should not throw an error when hashMapMultiselect is empty, Config.module is different from operationModuleType',
      input: {
        config: {
          multiSelectFieldLevelDecision: [],
          module: 'moduleA',
        },
        operationModuleType: 'moduleB',
      },
      expectError: false,
    },
    {
      name: 'should not throw an error when hashMapMultiselect is empty, Config.module is the same as operationModuleType',
      input: {
        config: {
          multiSelectFieldLevelDecision: [],
          module: 'moduleA',
        },
        operationModuleType: 'moduleA',
      },
      expectError: false,
    },
    {
      name: 'should not throw an error when multiSelectFieldLevelDecision has entries without from key',
      input: {
        config: {
          multiSelectFieldLevelDecision: [{ to: 'true' }],
          module: 'moduleA',
        },
        operationModuleType: 'moduleB',
      },
      expectError: false,
    },
    {
      name: 'should throw ConfigurationError when multiSelectFieldLevelDecision has mixed case from keys, Config.module is different from operationModuleType',
      input: {
        config: {
          multiSelectFieldLevelDecision: [
            { from: 'FIELD1', to: 'true' },
            { from: 'field2', to: 'false' },
          ],
          module: 'moduleA',
        },
        operationModuleType: 'moduleB',
      },
      expectError: true,
      errorType: ConfigurationError,
      errorMessage:
        'Object Chosen in Visual Data Mapper is not consistent with Module type selected in destination configuration. Aborting Events.',
    },
  ];

  testCases.forEach(({ name, input, expectError, errorType, errorMessage }) => {
    it(name, () => {
      if (expectError) {
        expect(() => validateConfigurationIssue(input.config, input.operationModuleType)).toThrow(
          errorType,
        );
        expect(() => validateConfigurationIssue(input.config, input.operationModuleType)).toThrow(
          errorMessage,
        );
      } else {
        expect(() =>
          validateConfigurationIssue(input.config, input.operationModuleType),
        ).not.toThrow();
      }
    });
  });
});
