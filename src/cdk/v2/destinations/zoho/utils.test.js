const {
  handleDuplicateCheck,
  deduceModuleInfo,
  validatePresenceOfMandatoryProperties,
  formatMultiSelectFields,
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
      upsertEndPoint: 'https://accounts.zoho.com/crm/v6/Leads/upsert',
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
      upsertEndPoint: 'https://accounts.zoho.eu/crm/v6/Leads/upsert',
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

describe('formatMultiSelectFields', () => {
  it('should wrap fields in an array if keys are present in multiSelectFields', () => {
    const config = {
      multiSelectFieldLevelDecision: [
        { from: 'multi-language', to: 'true' },
        { from: 'multi class', to: 'false' },
      ],
    };
    const fields = {
      'multi-language': 'English',
      'multi class': 'Science',
      'other-field': 'Value',
    };

    const result = formatMultiSelectFields(config, fields);
    expect(result['multi-language']).toEqual(['English']);
    expect(result['multi class']).toEqual(['Science']);
    expect(result['other-field']).toEqual('Value');
  });

  it('should not change fields if keys are not present in multiSelectFields', () => {
    const config = {
      multiSelectFieldLevelDecision: [
        { from: 'multi-language', to: 'true' },
        { from: 'multi class', to: 'false' },
      ],
    };
    const fields = {
      'other-field': 'Value',
    };

    const result = formatMultiSelectFields(config, fields);
    expect(result['other-field']).toEqual('Value');
  });

  it('should handle an empty multiSelectFieldLevelDecision array', () => {
    const config = {
      multiSelectFieldLevelDecision: [],
    };
    const fields = {
      'multi-language': 'English',
      'multi class': 'Science',
    };

    const result = formatMultiSelectFields(config, fields);
    expect(result['multi-language']).toEqual('English');
    expect(result['multi class']).toEqual('Science');
  });

  it('should handle an empty fields object', () => {
    const config = {
      multiSelectFieldLevelDecision: [
        { from: 'multi-language', to: 'true' },
        { from: 'multi class', to: 'false' },
      ],
    };
    const fields = {};

    const result = formatMultiSelectFields(config, fields);
    expect(result).toEqual({});
  });
});
