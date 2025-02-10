const {
  handleDuplicateCheck,
  deduceModuleInfo,
  validatePresenceOfMandatoryProperties,
  validateConfigurationIssue,
} = require('./utils');

const { ConfigurationError } = require('@rudderstack/integrations-lib');

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
