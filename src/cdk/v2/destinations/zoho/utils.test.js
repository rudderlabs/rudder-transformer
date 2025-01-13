const {
  handleDuplicateCheck,
  deduceModuleInfo,
  validatePresenceOfMandatoryProperties,
  formatMultiSelectFields,
  validateConfigurationIssue,
} = require('./utils');

const { ConfigurationError } = require('@rudderstack/integrations-lib');

describe('handleDuplicateCheck', () => {
  // Returns identifierType when addDefaultDuplicateCheck is false
  it('should return identifierType when addDefaultDuplicateCheck is false', () => {
    const identifierType = 'email';
    const addDefaultDuplicateCheck = false;
    const operationModuleType = 'Leads';
    const moduleWiseDuplicateCheckField = {};

    const result = handleDuplicateCheck(
      addDefaultDuplicateCheck,
      identifierType,
      operationModuleType,
      moduleWiseDuplicateCheckField,
    );

    expect(result).toEqual([identifierType]);
  });

  it('Handles valid operationModuleType and already included identifierType', () => {
    const identifierType = 'Email';
    const addDefaultDuplicateCheck = true;
    const operationModuleType = 'Leads';

    const result = handleDuplicateCheck(
      addDefaultDuplicateCheck,
      identifierType,
      operationModuleType,
    );

    expect(result).toEqual(['Email']);
  });

  // Returns identifierType and 'Name' when addDefaultDuplicateCheck is true and moduleDuplicateCheckField is not defined
  it("should return identifierType and 'Name' when addDefaultDuplicateCheck is true and moduleDuplicateCheckField is not defined", () => {
    const identifierType = 'id';
    const operationModuleType = 'type3';
    const addDefaultDuplicateCheck = true;

    const result = handleDuplicateCheck(
      addDefaultDuplicateCheck,
      identifierType,
      operationModuleType,
    );

    expect(result).toEqual(['id', 'Name']);
  });

  // Handles null values in moduleWiseDuplicateCheckField
  it('should handle null values in moduleWiseDuplicateCheckField', () => {
    const addDefaultDuplicateCheck = true;
    const identifierType = 'Identifier';
    const operationModuleType = 'type1';

    const result = handleDuplicateCheck(
      addDefaultDuplicateCheck,
      identifierType,
      operationModuleType,
    );

    expect(result).toEqual(['Identifier', 'Name']);
  });
});

describe('deduceModuleInfo', () => {
  const Config = { region: 'US' };

  it('should return empty object when mappedToDestination is not present', () => {
    const inputs = [{}];
    const result = deduceModuleInfo(inputs, Config);
    expect(result).toEqual({});
  });

  it('should return operationModuleInfo when mappedToDestination is present', () => {
    const inputs = [
      {
        message: {
          context: {
            externalId: [{ type: 'ZOHO-Leads', id: '12345', identifierType: 'Email' }],
            mappedToDestination: true,
          },
        },
      },
    ];

    const result = deduceModuleInfo(inputs, Config);
    expect(result).toEqual({
      operationModuleType: 'Leads',
      upsertEndPoint: 'https://www.zohoapis.com/crm/v6/Leads',
      identifierType: 'Email',
    });
  });

  it('should handle different regions in config', () => {
    const inputs = [
      {
        message: {
          context: {
            externalId: [{ type: 'ZOHO-Leads', id: '12345', identifierType: 'Email' }],
            mappedToDestination: 'true',
          },
        },
      },
    ];
    const Config = { region: 'EU' };

    const result = deduceModuleInfo(inputs, Config);
    expect(result).toEqual({
      operationModuleType: 'Leads',
      upsertEndPoint: 'https://www.zohoapis.eu/crm/v6/Leads',
      identifierType: 'Email',
    });
  });
});

describe('validatePresenceOfMandatoryProperties', () => {
  it('should not throw an error if the object has all required fields', () => {
    const objectName = 'Leads';
    const object = { Last_Name: 'Doe' };

    expect(() => validatePresenceOfMandatoryProperties(objectName, object)).not.toThrow();
  });

  it('should return missing field if mandatory field contains empty string', () => {
    const objectName = 'Leads';
    const object = { Last_Name: '' };

    const result = validatePresenceOfMandatoryProperties(objectName, object);

    expect(result).toEqual({ missingField: ['Last_Name'], status: true });
  });

  it('should return missing field if mandatory field contains empty null', () => {
    const objectName = 'Leads';
    const object = { Last_Name: null };

    const result = validatePresenceOfMandatoryProperties(objectName, object);

    expect(result).toEqual({ missingField: ['Last_Name'], status: true });
  });

  it('should not throw an error if the objectName is not in MODULE_MANDATORY_FIELD_CONFIG', () => {
    const objectName = 'CustomObject';
    const object = { Some_Field: 'Some Value' };

    expect(() => validatePresenceOfMandatoryProperties(objectName, object)).not.toThrow();
  });

  it('should throw an error if the object is missing multiple required fields', () => {
    const objectName = 'Deals';
    const object = { Deal_Name: 'Big Deal' };
    const output = validatePresenceOfMandatoryProperties(objectName, object);
    expect(output).toEqual({
      missingField: ['Stage', 'Pipeline'],
      status: true,
    });
  });

  it('should not throw an error if the object has all required fields for Deals', () => {
    const objectName = 'Deals';
    const object = { Deal_Name: 'Big Deal', Stage: 'Negotiation', Pipeline: 'Sales' };

    expect(() => validatePresenceOfMandatoryProperties(objectName, object)).not.toThrow();
  });
});

describe('validateConfigurationIssue', () => {
  test('should throw ConfigurationError when hashMapMultiselect is not empty, Config.module is different from operationModuleType, and action is not delete', () => {
    const Config = {
      multiSelectFieldLevelDecision: [{ from: 'field1', to: 'true' }],
      module: 'moduleA',
    };
    const operationModuleType = 'moduleB';
    const action = 'create';

    expect(() => validateConfigurationIssue(Config, operationModuleType, action)).toThrow(
      ConfigurationError,
    );
    expect(() => validateConfigurationIssue(Config, operationModuleType, action)).toThrow(
      'Object Chosen in Visual Data Mapper is not consistent with Module type selected in destination configuration. Aborting Events.',
    );
  });

  test('should not throw an error when hashMapMultiselect is not empty, Config.module is the same as operationModuleType, and action is not delete', () => {
    const Config = {
      multiSelectFieldLevelDecision: [{ from: 'field1', to: 'true' }],
      module: 'moduleA',
    };
    const operationModuleType = 'moduleA';
    const action = 'create';

    expect(() => validateConfigurationIssue(Config, operationModuleType, action)).not.toThrow();
  });

  test('should not throw an error when hashMapMultiselect is empty, Config.module is different from operationModuleType, and action is not delete', () => {
    const Config = {
      multiSelectFieldLevelDecision: [],
      module: 'moduleA',
    };
    const operationModuleType = 'moduleB';
    const action = 'create';

    expect(() => validateConfigurationIssue(Config, operationModuleType, action)).not.toThrow();
  });

  test('should not throw an error when hashMapMultiselect is empty, Config.module is the same as operationModuleType, and action is not delete', () => {
    const Config = {
      multiSelectFieldLevelDecision: [],
      module: 'moduleA',
    };
    const operationModuleType = 'moduleA';
    const action = 'create';

    expect(() => validateConfigurationIssue(Config, operationModuleType, action)).not.toThrow();
  });

  test('should not throw an error when multiSelectFieldLevelDecision has entries without from key', () => {
    const Config = {
      multiSelectFieldLevelDecision: [{ to: 'true' }],
      module: 'moduleA',
    };
    const operationModuleType = 'moduleB';
    const action = 'create';

    expect(() => validateConfigurationIssue(Config, operationModuleType, action)).not.toThrow();
  });

  test('should throw ConfigurationError when multiSelectFieldLevelDecision has mixed case from keys, Config.module is different from operationModuleType, and action is not delete', () => {
    const Config = {
      multiSelectFieldLevelDecision: [
        { from: 'FIELD1', to: 'true' },
        { from: 'field2', to: 'false' },
      ],
      module: 'moduleA',
    };
    const operationModuleType = 'moduleB';
    const action = 'create';

    expect(() => validateConfigurationIssue(Config, operationModuleType, action)).toThrow(
      ConfigurationError,
    );
  });

  test('should not throw an error when hashMapMultiselect is not empty, Config.module is different from operationModuleType, and action is delete', () => {
    const Config = {
      multiSelectFieldLevelDecision: [{ from: 'field1', to: 'true' }],
      module: 'moduleA',
    };
    const operationModuleType = 'moduleB';
    const action = 'delete';

    expect(() => validateConfigurationIssue(Config, operationModuleType, action)).not.toThrow();
  });
});
